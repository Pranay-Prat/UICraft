import Link from "next/link";
import React from "react";
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "@/components/ui/button";
import { useStatus } from "@/modules/usage/hooks/usage";
import { useAuth } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";
const Usage = () => {
  const { data, isPending, error } = useStatus();
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
  }, []);

  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  if (isPending) {
    return (
      <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
        <Spinner className="text-emerald-400" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
        <p className="text-sm text-destructive">Error loading usage</p>
      </div>
    );
  }
  const points = data?.remainingPoints ?? 0;
  const msBeforeNext = data?.msBeforeNext ?? 0;
  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">{points} credits remaining</p>
          <p className="text-xs text-muted-foreground">
            Resets in{" "}
            {now &&
              formatDuration(
                intervalToDuration({
                  start: now,
                  end: new Date(now.getTime() + msBeforeNext),
                }),
                { format: ["months", "days", "hours"] }
              )}
          </p>
        </div>
        {!hasProAccess && (
          <Button asChild size={"sm"} variant={"default"} className={"ml-auto"}>
            <Link href={"/pricing"}>
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
export default Usage;
