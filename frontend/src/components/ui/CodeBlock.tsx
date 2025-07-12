import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Download, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  theme?: "dark" | "light";
  maxHeight?: string;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showCollapseButton?: boolean;
  className?: string;
  filename?: string;
}

export default function CodeBlock({
  code,
  language = "javascript",
  title,
  showLineNumbers = true,
  showCopyButton = true,
  showDownloadButton = false,
  showCollapseButton = false,
  className = "",
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `code.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded!");
  };

  const getFileExtension = (lang: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      json: "json",
      xml: "xml",
      sql: "sql",
      bash: "sh",
      shell: "sh",
      yaml: "yml",
      markdown: "md",
    };
    return extensions[lang] || "txt";
  };

  const getLanguageLabel = (lang: string): string => {
    const labels: { [key: string]: string } = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      xml: "XML",
      sql: "SQL",
      bash: "Bash",
      shell: "Shell",
      yaml: "YAML",
      markdown: "Markdown",
    };
    return labels[lang] || lang.toUpperCase();
  };

  const isDark = "dark";
  const syntaxTheme = isDark ? oneDark : oneLight;

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Header */}
      {(title ||
        showCopyButton ||
        showDownloadButton ||
        showCollapseButton) && (
        <div
          className={`flex border-b border-white/10 items-center justify-between px-4 py-3 ${
            isDark ? "bg-none" : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-1 rounded-full font-mono bg-[#262626] `}
            >
              {getLanguageLabel(language)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showCollapseButton && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`p-1.5 rounded-md transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                }`}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            )}

            {showDownloadButton && (
              <button
                onClick={handleDownload}
                className={`p-1.5 rounded-md transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                }`}
                title="Download code"
              >
                <Download size={16} />
              </button>
            )}

            {showCopyButton && (
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded-md transition-colors ${
                  isDark
                    ? "hover:bg-button-bg text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-200 text-button-bg hover:text-gray-800"
                }`}
                title="Copy code"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Content */}
      {!isCollapsed && (
        <div className="relative">
          <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-220px)] sm:max-w-[calc(75vw-220px)]">
            <SyntaxHighlighter
              language={language}
              style={syntaxTheme}
              showLineNumbers={showLineNumbers}
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "transparent",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              lineNumberStyle={{
                minWidth: "3em",
                paddingRight: "1em",
                color: isDark ? "#6b7280" : "#9ca3af",
                userSelect: "none",
              }}
              wrapLines={true}
              wrapLongLines={true}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div
          className={`px-4 py-3 text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Code collapsed ({code.split("\n").length} lines)
        </div>
      )}
    </div>
  );
}
