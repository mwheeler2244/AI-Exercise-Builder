"use client";
import { useState } from "react";
import ExercisePlan from "./components/ExercisePlan";
import MuscleGroups from "./components/MuscleGroups";
import { getExerciseRoutine } from "./lib/actions";
import { Toaster } from "sonner";

function Hero() {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [exercisePlan, setExercisePlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (userInput.trim() !== "") {
      setMuscleGroups((prev) => [...prev, userInput.trim()]);
      setUserInput("");
    }
  }

  async function handleGeneratePlan() {
    if (muscleGroups.length === 0) {
      setError("Please add at least one muscle group");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Generating plan for muscles:", muscleGroups); // Debug log
      const plan = await getExerciseRoutine(muscleGroups);
      console.log("Received plan:", plan); // Debug log
      setExercisePlan(plan);
    } catch (error) {
      console.error("Error generating exercise plan:", error);
      setError(
        error.message ||
          "Failed to generate an exercise plan. Please try again."
      );
      setExercisePlan(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="hero">
      <form onSubmit={handleSubmit} className="add-muscle-group-form">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          type="text"
          placeholder="e.g. chest, triceps"
          name="muscleGroup"
          className="input-muscle-group"
        />
        <button className="add-muscle-group-button">Add Muscle Group</button>
      </form>

      {muscleGroups.length > 0 && (
        <MuscleGroups
          muscleGroups={muscleGroups}
          setMuscleGroups={setMuscleGroups}
          handleGeneratePlan={handleGeneratePlan}
          className="muscle-groups"
        />
      )}

      {isLoading && (
        <p className="loading-message">Loading your exercise plan...</p>
      )}

      {error && <p className="error-message">{error}</p>}

      {exercisePlan && !isLoading && (
        <ExercisePlan exercisePlan={exercisePlan} className="exercise-plan" />
      )}
      <Toaster position="bottom-right" />
    </main>
  );
}

export default Hero;
