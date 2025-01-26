"use client";
import { toast } from "sonner";
import { useState } from "react";

import { saveWorkoutData } from "../lib/actions";

export default function SaveExercise({ exercisePlan }) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleClick() {
    setIsSaving(true);

    try {
      const plan = await saveWorkoutData(exercisePlan);

      if (plan) {
        toast.success("Exercise saved successfully!");
      }
    } catch (error) {
      console.error("Error saving joke:", error);
      const errorMessage = error.message.includes("already saved")
        ? "You've already saved this exercise!"
        : null;
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <button className="add-muscle-group-button" onClick={handleClick}>
        {isSaving ? "Saving..." : "Save for later!"}
      </button>
    </div>
  );
}
