// components/navbar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold text-primary">
          Learn Champ
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/quiz">
            <Button variant="ghost">Kuis</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost">Leaderboard</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}