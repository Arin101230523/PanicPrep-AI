import {NextResponse} from 'next/server';
import Groq from "groq-sdk";


const systemPrompt = `You are a flashcard creator.
Your task is to generate flashcards based on the given input. 
Each flashcard should have a question on one side and the corresponding answer on the other side. 
The input will be a list of objects, each containing a 'question' and an 'answer' field. 
ALWAYS generate 10 flashcards AND MAKE sure that they are all distinct. Think outside of the box on some as it does not need to directly relate to the term.
Return ONLY following JSON format, you should give no preface toward the information.
{
    "flashcards": [
        {
            "front": str,
            "back": str
        } 
    ]
}
`;

export async function POST(req) {
    const data = await req.text();
    
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
      const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": data
          },
        ],
        "model": "llama3-8b-8192",
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stop": null
      });
      
      console.log(chatCompletion.choices[0].message.content);
      const flashcards = JSON.parse(chatCompletion.choices[0].message.content);

      return NextResponse.json(flashcards.flashcards)
}