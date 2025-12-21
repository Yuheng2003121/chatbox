import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma/client";
import { CopyCheckIcon, CopyIcon, ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import React, { useState } from "react";

interface FragmentWebProps {
  data: Fragment;
}
export default function FragmentWeb({ data }: FragmentWebProps) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] =useState(0);
  const onRefresh = () => {
    setFragmentKey(prev => prev + 1)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    // setTimeout(() => setCopied(false), 1000);
  }


  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-2">
        <Hint text={"Refresh"} side={"bottom"} align={"center"}>
          <Button variant={"outline"} size="sm" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Hint text="Copy sandbox URL" side="bottom" align="start">
          <Button
            variant={"outline"}
            size="sm"
            onClick={handleCopy}
            disabled={!data.sandboxUrl}
            className="flex-1 justify-start! font-normal items-center"
          >
            {copied ? <CopyCheckIcon /> : <CopyIcon />}
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint text={"Open in a new Tab"} side={"bottom"} align={"start"}>
          <Button
            size="sm"
            disabled={!data}
            variant={"outline"}
            className=""
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        className="h-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        key={fragmentKey}
        src={data.sandboxUrl}
      />
    </div>
  );
}
