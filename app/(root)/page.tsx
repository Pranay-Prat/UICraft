import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
export default function Home() {
  return (
  <div className="flex min-h-screen items-center justify-center bg-background font-sans text-foreground">
      <Button>test</Button>
      <UserButton/>
    </div>
  );
}
