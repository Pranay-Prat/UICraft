import { Fragment } from "@/schemas/messagesSchema";
import React, { useState } from "react";
import { ExternalLinkIcon, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./ui/hint";
type FragmentWebProps = {
  data: Fragment;
};
const FragmentWeb = ({ data }: FragmentWebProps) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const onRefresh = () => {
    setFragmentKey((prevKey) => prevKey + 1);
  };
  const onCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text={"Refresh"} side={"bottom"} align={"start"}>
          <Button size={"sm"} variant={"outline"} onClick={onRefresh}>
            <RefreshCcw className="size-4" />
          </Button>
        </Hint>
        <Hint
          text={copied ? "Copied" : "Click to Copy"}
          side={"bottom"}
          align={"start"}
        >
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={onCopy}
            disabled={!data?.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">
              {data?.sandboxUrl
                ? copied
                  ? "Copied to clipboard"
                  : data.sandboxUrl
                : "No Sandbox URL"}
            </span>
          </Button>
        </Hint>
        <Hint text={"Open in new tab"} side="bottom" align="start">
          <Button
            size={"sm"}
            variant={"outline"}
            asChild
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe key={fragmentKey} className="h-full w-full" sandbox="allow-scripts allow-same-origin" loading="lazy" src={data.sandboxUrl}></iframe>
    </div>
  );
};

export default FragmentWeb;
