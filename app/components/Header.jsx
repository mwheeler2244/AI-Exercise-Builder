import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { checkUser } from "../lib/checkUser";

export default async function Header() {
  const user = await checkUser();

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="header-title">
          Daily Workout
        </Link>
        <Link className="saved-title" href="saved">
          Saved{" "}
        </Link>
      </div>
      <div className="auth-buttons">
        <SignedOut>
          <SignInButton className="sign-in" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
