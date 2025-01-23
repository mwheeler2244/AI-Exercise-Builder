// app/api/route.js
import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of muscle groups that a user has and suggests a workout they could do with some those muscle groups. the workout should be around 30 minutes and include at least 3 different movements. Format your response in markdown to make it easier to render to a web page`;

// Make sure we have an API key
if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY is not set in environment variables");
}

// Initialize HuggingFace client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { muscles } = body;

    if (!muscles || !Array.isArray(muscles)) {
      return NextResponse.json(
        { error: "Invalid muscles data" },
        { status: 400 }
      );
    }

    const exercise = muscles.join(", ");

    try {
      // Using gpt2 model instead
      const response = await hf.textGeneration({
        model: "gpt2",
        inputs: `Create a 30-minute workout routine for this muscle group: ${exercise}. Include at least 3 different exercises.`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      // Format the response
      const workoutPlan = `# Your 30-Minute Workout Plan\n\n${response.generated_text}`;
      return NextResponse.json({ plan: workoutPlan });
    } catch (apiError) {
      console.error("HuggingFace API Error:", apiError);
      return NextResponse.json(
        { error: "Failed to connect to HuggingFace API: " + apiError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}
