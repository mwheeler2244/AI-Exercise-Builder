// app/lib/actions.js
"use server";
import { Prisma } from "@prisma/client";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "./db";

export async function getExerciseRoutine(muscles) {
  if (!muscles || muscles.length === 0) {
    throw new Error("No muscle groups provided");
  }

  try {
    const response = await fetch("http://localhost:3000/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ muscles }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error Response:", errorData); // Debug log
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    revalidatePath("/");
    return data.plan;
  } catch (error) {
    console.error("Detailed error:", error); // More detailed error logging
    throw new Error(`Failed to fetch workout plan: ${error.message}`);
  }
}

export async function saveWorkoutData(text) {
  try {
    // Get current user ID
    const { userId } = await auth();

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check for existing exercise first
    const existingExercise = await db.exercise.findFirst({
      where: {
        text,
        userId: user.clerkUserId,
      },
    });

    if (existingExercise) {
      throw new Error("You've already saved this exercise!");
    }

    // Create new exercise if no duplicate exists
    const exercise = await db.exercise.create({
      data: {
        text,
        userId: user.clerkUserId,
      },
    });

    return exercise;
  } catch (error) {
    throw error;
  }
}
