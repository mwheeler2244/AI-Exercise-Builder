import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/db";
import { toast } from "sonner";

export default async function Saved() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const workouts = await db.exercise.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return (
      <div className="saved-container">
        <h1 className="saved-heading">Saved Workouts</h1>
        <div className="workout-list">
          {workouts.map((each) => (
            <div key={each.id} className="workout-item">
              <p className="workout-text">{each.text}</p>
              <p className="workout-date">
                Created on: {new Date(each.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    toast.error(error.message);
  }
}
