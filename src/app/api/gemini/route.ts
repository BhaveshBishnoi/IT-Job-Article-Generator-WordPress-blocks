import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize outside of function to reuse connection
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const query = searchParams.get("query");

  if (!query || !type) {
    return Response.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Improved prompt templates with better formatting instructions
    const prompts = {
      companyOverview: `Provide a concise 3-paragraph overview of ${query} company. Each paragraph should be 20-30 words, professional tone, focusing on:
1) Company background and industry
2) Key products/services
3) Market position or unique value proposition

Format exactly as:
<!-- wp:paragraph -->
<p>Paragraph text here</p>
<!-- /wp:paragraph -->`,

      aboutJobProfile: `Describe the ${query} role in 3 professional paragraphs (25-35 words each):
1) General role overview
2) Typical work environment
3) Career growth opportunities

Format exactly as:
<!-- wp:paragraph -->
<p>Paragraph text here</p>
<!-- /wp:paragraph -->`,

      responsibilities: `List 5-8 key responsibilities for a ${query} position. Each should be a concise bullet point (5-10 words). Focus on:
- Core duties
- Decision-making areas
- Key deliverables

Format exactly as:
<!-- wp:list -->
<ul>
<li>Responsibility 1</li>
<li>Responsibility 2</li>
</ul>
<!-- /wp:list -->`,

      requirements: `Provide 5-8 requirements for ${query} position covering:
- Education
- Experience
- Technical skills
- Certifications
- Soft skills

Format exactly as:
<!-- wp:list -->
<ul>
<li>Requirement 1</li>
<li>Requirement 2</li>
</ul>
<!-- /wp:list -->`,
    };

    if (!(type in prompts)) {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    const prompt = prompts[type as keyof typeof prompts];
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up response to ensure consistent formatting
    const cleanText = text
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    return Response.json(
      { content: cleanText },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
