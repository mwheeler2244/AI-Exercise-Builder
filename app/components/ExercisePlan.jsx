import ReactMarkdown from "react-markdown";
import SaveExercise from "./SaveExercise";
function ExercisePlan({ exercisePlan }) {
  return (
    <>
      <section className="exercise-plan-container">
        <SaveExercise exercisePlan={exercisePlan} />
        <h2 className="exercise-plan-title">Your 30-Minute Workout Plan</h2>
        <div className="exercise-plan-content">
          <ReactMarkdown>{exercisePlan}</ReactMarkdown>
        </div>
      </section>
    </>
  );
}

export default ExercisePlan;
