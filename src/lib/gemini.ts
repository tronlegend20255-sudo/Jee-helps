import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateStudyMaterial(subject: string, chapter: string, topic: string) {
  const prompt = `You are a JEE expert tutor. The student is studying Subject: ${subject}, Chapter: ${chapter}, Topic: ${topic} for JEE Mains and Advanced.
Please provide:
1. The exact name or title of the best YouTube video tutorial that would explain this topic deeply, and the channel name.
2. Short, crisp and high-yield revision notes for this topic. Include important formulas or concepts. Use markdown.
3. 3-5 flashcards covering the most confusing or critical parts of this topic.

Also search the web (if possible) to get an accurate, high quality YouTube link for a video dealing with "${subject} ${chapter} ${topic} JEE". If you cannot find a direct link, just provide the exact search query you'd recommend.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoRecommendation: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                channel: { type: Type.STRING },
                url: { type: Type.STRING },
                searchQueryPlaceholder: { type: Type.STRING },
              },
              required: ["title", "channel", "url"]
            },
            notes: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["videoRecommendation", "notes", "flashcards"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Error generating study material:", error);
    throw error;
  }
}

export async function generatePYQs(subject: string, chapter: string, topic: string) {
  const prompt = `You are a JEE expert tutor. Give me 3 to 5 actual Previous Year Questions (PYQs) from JEE Mains and JEE Advanced for Subject: ${subject}, Chapter: ${chapter}, Topic: ${topic}.
Provide the question text, the options (if it's MCQ), the correct answer, and a brief step-by-step solution.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              exam: { type: Type.STRING, description: "e.g., JEE Mains 2021 or JEE Advanced 2019" },
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of options if MCQ, or empty array if numerical"
              },
              correctAnswer: { type: Type.STRING },
              solution: { type: Type.STRING }
            },
            required: ["exam", "questionText", "options", "correctAnswer", "solution"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Error generating PYQs", error);
    throw error;
  }
}

export async function generateMockTest(examType: "Mains" | "Advanced") {
  const isMains = examType === "Mains";
  const numQuestionsPerSubject = 5; // A mini mock to avoid timeout, but structure is similar to full length
  const prompt = `You are an expert JEE examiner creating a high-quality, new mock test for JEE ${examType}.
Please generate a full-syllabus mini mock test consisting of exactly ${numQuestionsPerSubject} Physics questions, ${numQuestionsPerSubject} Chemistry questions, and ${numQuestionsPerSubject} Mathematics questions.
For ${isMains ? 'JEE Mains' : 'JEE Advanced'}, match the difficulty, style (single correct, multi-correct, numerical), and syllabus of the real exam.
Provide the question text (in Markdown), options (for MCQs), the correct answer, and a robust solution. Assign a subject ("Physics", "Chemistry", "Mathematics") to each.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              questionType: { type: Type.STRING, description: "e.g., 'Single Correct MCQ', 'Multiple Correct MCQ', or 'Numerical'" },
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of options for MCQs, exact format. Empty for numerical."
              },
              correctAnswer: { type: Type.STRING },
              solution: { type: Type.STRING }
            },
            required: ["subject", "questionType", "questionText", "options", "correctAnswer", "solution"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Error generating mock test", error);
    throw error;
  }
}

