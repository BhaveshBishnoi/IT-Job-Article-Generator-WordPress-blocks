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
        prompt = `Write 3 paragraphs about ${query} company. Each paragraph should be 20-30 words. Add <br> <br> after the first, second, and third paragraphs only. Keep it professional. `;
        break;
      case 'aboutJobProfile':
        prompt = `Write 3 paragraphs about the ${query} role. Each paragraph should be 25-35 words. Add <br> <br> after the first, second, and third paragraphs only. Keep it professional. writing tone is like opportunity for job`;
        break;
      case 'responsibilities':
        prompt = `Generate a list of 5-8 key responsibilities for ${query} position. Format as HTML list items with this structure: <li class="responsibility-item">Responsibility text</li>. Keep it professional.`;
        break;
      case 'requirements':
        prompt = `Generate 5-8 key requirements for ${query} position. Format as HTML list items with this structure: <li class="requirement-item">Requirement text</li>. Include education, experience, and technical skills.`;
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