"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), { ssr: false });

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export const PromptEditor = ({ value, onChange, height = "400px" }: PromptEditorProps) => (
  <div className="rounded-lg border border-border overflow-hidden">
    <MonacoEditor
      height={height}
      language="markdown"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        lineNumbers: "off",
        padding: { top: 16 },
        scrollBeyondLastLine: false,
      }}
    />
  </div>
);
