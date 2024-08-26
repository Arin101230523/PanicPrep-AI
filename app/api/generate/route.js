import {NextResponse} from 'next/server';
import Groq from "groq-sdk";


const systemPrompt = `You are the brains behind Cramify!
Your task is to generate flashcards based on the given input, inputs will be in format of "number topic or context difficulty(optional)".
Users will either upload a lengthy text that they want to create flashcards from or they will provide a specific topic where it is up to you to get creative.
The number indicates how many flashcards you will generate, the topic refers to the topic of the flaschards, and the user may include a difficulty level if needed.
ONLY GENERATE THE NUMBER OF FLASHCARDS INDICATED, NO MORE, NO LESS.
Each flashcard should have a question on one side and the corresponding answer on the other side. 
The output will be a list of objects, each containing a 'question' and an 'answer' field. 
MAKE sure that they are all distinct. Think outside of the box on some as it does not need to directly relate to the term.
DO NOT just return generic defintions with the answer as the prompt. Include questions where they need to describe a certain process and give a sample answer.
For example, if the input was flowers, have the front be unique characteristics of a certain flower and the back be the flower name.
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
    try {
      const data = await req.text();
      console.log(data);
    
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
      
      const flashcards = JSON.parse(chatCompletion.choices[0].message.content);
      console.log(flashcards);

      return NextResponse.json(flashcards.flashcards)
    } catch(error) {
      console.error('Error generating flashcards:', error);
      alert('Error generating flashcards, please try again');
      return NextResponse.error(new Error('Error generating flashcards'));
    }
}