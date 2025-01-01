import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const query = searchParams.get('query');

  if (!query || !type) {
    return new Response('Missing parameters', { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = '';
    switch (type) {
      case 'companyOverview':
        prompt = `Write 3 paragraphs about ${query} company. Format the response as:
<!-- wp:paragraph -->
<p>First paragraph (20-30 words)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Second paragraph (20-30 words)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Third paragraph (20-30 words)</p>
<!-- /wp:paragraph -->
Keep it professional.`;
        break;
      case 'aboutJobProfile':
        prompt = `Write 3 paragraphs about the ${query} role. Format the response as:
<!-- wp:paragraph -->
<p>First paragraph (25-35 words)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Second paragraph (25-35 words)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Third paragraph (25-35 words)</p>
<!-- /wp:paragraph -->
Keep it professional and focus on job opportunities.`;
        break;
      case 'responsibilities':
        prompt = `Generate a list of 5-8 key responsibilities for ${query} position. Format the response as:
<!-- wp:list -->
<ul>
<li>Responsibility 1</li>
<li>Responsibility 2</li>
[and so on...]
</ul>
<!-- /wp:list -->
Keep it professional.`;
        break;
      case 'requirements':
        prompt = `Generate 5-8 key requirements for ${query} position. Format the response as:
<!-- wp:list -->
<ul>
<li>Requirement 1</li>
<li>Requirement 2</li>
[and so on...]
</ul>
<!-- /wp:list -->
Include education, experience, and technical skills.`;
        break;
      default:
        return new Response('Invalid type', { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ content: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response('Error processing request', { status: 500 });
  }
} 