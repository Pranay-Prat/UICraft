import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "@/components/ui/button";
import { useStatus } from "@/modules/usage/hooks/usage";
import { useAuth } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";
const Usage = () => {
  const { data, isPending, error } = useStatus();
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  if (isPending) {
    return (
      <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
        <Spinner className="text-emerald-400" />
      </div>
    );
  }
  if(error){
    return (
      <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
        <p className="text-sm text-destructive">Error loading usage</p>
      </div>
    );
  }
};
export default Usage;
