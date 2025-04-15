import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' }, 
        { status: 400 }
      );
    }

    // For longer prompts, use gemini-pro (for shorter, faster responses)
    const model = genAI.getGenerativeModel({ 
      model: prompt.length > 1000 ? 'gemini-pro' : 'gemini-pro'
    });

    // Set generation configuration
    const generationConfig = {
      temperature: 0.7,  // Controls randomness (0.0 to 1.0)
      topP: 0.9,         // Nucleus sampling
      topK: 40,          // Top-k sampling
      maxOutputTokens: 2048,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    // Clean up response for WordPress block format
    const cleanedText = text
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .trim();

    return NextResponse.json({ text: cleanedText });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}