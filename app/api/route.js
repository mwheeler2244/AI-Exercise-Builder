import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

// Validate muscle groups
const VALID_MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quadriceps",
  "hamstrings",
  "calves",
  "abs",
  "glutes",
];

// Ensure API key is set
if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY is not set in environment variables");
}

// Initialize HuggingFace client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const { muscles } = await request.json();

    // Validate input muscles
    if (!muscles || !Array.isArray(muscles)) {
      return NextResponse.json(
        { error: "Invalid muscles data" },
        { status: 400 }
      );
    }

    // Check for invalid muscle groups
    const invalidMuscles = muscles.filter(
      (muscle) => !VALID_MUSCLE_GROUPS.includes(muscle.toLowerCase())
    );

    if (invalidMuscles.length > 0) {
      return NextResponse.json(
        { error: `Invalid muscle groups: ${invalidMuscles.join(", ")}` },
        { status: 400 }
      );
    }

    // Detailed prompt for workout generation
    const prompt = `Create a detailed 30-minute workout plan targeting these muscle groups: ${muscles.join(
      ", "
    )}

Guidelines:
- Focus on the specified muscle groups
- Design a balanced, safe workout
- Include 3-4 distinct exercises
- Specify exercise names, sets, reps, and brief form tips
- Consider minimal equipment requirements

Output Format:

## Warm-up (5 minutes)
- Brief dynamic stretching and light cardio

## Main Workout (20 minutes)
1. Exercise Name
   - Sets: X
   - Reps: Y
   - Form Tips: Brief technique guidance

2. Exercise Name
   - Sets: X
   - Reps: Y
   - Form Tips: Brief technique guidance

3. Exercise Name
   - Sets: X
   - Reps: Y
   - Form Tips: Brief technique guidance

## Cool-down (5 minutes)
- Static stretching for worked muscle groups`;

    // Generate workout plan using a capable model
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    // Format the response
    const workoutPlan = `# Your 30-Minute Workout Plan\n\n${response.generated_text.trim()}`;

    console.log({ workoutPlan });

    return NextResponse.json({ plan: workoutPlan });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}
