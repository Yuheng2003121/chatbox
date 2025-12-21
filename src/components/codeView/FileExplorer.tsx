import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CodeView from ".";
import { Fragment, useCallback, useMemo, useState } from "react";
import Hint from "../Hint";
import { Button } from "../ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import TreeView from "../TreeView";
import { convertFilesToTreeItems } from "@/lib/utils";

export type FileCollection = {
  [path: string]: string;
};
function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "txt";
}

interface FileExplorerProps {
  files: FileCollection;
}

export default function FileExplorer({ files }: FileExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if(selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);

      setTimeout(() => setCopied(false), 5000);
    }
  }, [files, selectedFile])

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={20} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar">
        {selectedFile && files[selectedFile] ? (
          <div className="h-full flex flex-col">
            <div className="border-b p-2 flex items-center">
              {/* <span className="font-bold">{selectedFile}</span> */}
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text={copied ? "Copied" : "Copy to clipboard"} side="bottom" align="center">
                <Button
                  variant={"outline"}
                  size="icon"
                  disabled={false}
                  className="ml-auto"
                  onClick={handleCopy}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                // code={longCodeStirng}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            {"Select a file to view it'ss content"}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

interface FileBreadcrumbProps {
  filePath: string;
}
const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 4;

  const renderBredCrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      //show all segments if 4 or less
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-bold">{segment}</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      //show first and last segments and ellipsis for the middle segments
      const startSegments = pathSegments[0];
      const endSegments = pathSegments[pathSegments.length - 1];
      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{startSegments}</span>
            <BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold">
                {endSegments}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };


  return (
    <Breadcrumb className="p-2">
      <BreadcrumbList>{renderBredCrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};
