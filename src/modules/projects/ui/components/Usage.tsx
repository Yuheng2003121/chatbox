import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface UsageProps {
  points: number;
  msBeforeNext: number;
}
export default function Usage({ points, msBeforeNext }: UsageProps) {
  const {has} = useAuth();
  const hasProAccess = has?.({plan: "pro"})

  return (
    <div className="rounded-t-xl bg-background border boder-b-0 p-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">
            {points} {!hasProAccess && "free"} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {""}
            {formatDuration(
              intervalToDuration({
                start: new Date(),
                end: new Date(Date.now() + msBeforeNext),
              }),
              { format: ["months", "days", "hours"] }
            )}
          </p>
        </div>
        {!hasProAccess && (
          <Button asChild size={"sm"} variant={"teritary"}>
            <Link href={"/pricing"}>
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
