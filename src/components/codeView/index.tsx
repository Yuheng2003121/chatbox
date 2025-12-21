import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import './codeTheme.css'
import { useEffect } from "react";

interface CodeViewProps {
  code: string;
  lang: string;
}
export default function CodeView({ code, lang }: CodeViewProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code])

  return (
    <pre className="p-2 text-xs">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
}