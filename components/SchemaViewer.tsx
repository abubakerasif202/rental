import React from "react";
import { Copy, Database, FileText } from "lucide-react";
import { POSTGRES_SCHEMA_SQL } from "../constants";

const SchemaViewer: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(POSTGRES_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Database className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">
            PostgreSQL 16+ Production Schema
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Designed for Multi-tenancy (SaaS), Audit Compliance, and
            Scalability. Includes UUID keys, RLS-ready structures, JSONB for
            extensible settings, and strict Foreign Key constraints.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-500" />
          schema.sql
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all active:scale-95"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy SQL"}
        </button>
      </div>

      <div className="relative flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="overflow-auto h-full pt-10 pb-4 px-4 custom-scrollbar">
          <pre className="text-sm font-mono leading-relaxed text-slate-300">
            {POSTGRES_SCHEMA_SQL.split("\n").map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell select-none text-slate-600 text-right pr-4 w-10">
                  {i + 1}
                </span>
                <span className="table-cell whitespace-pre-wrap">
                  {line
                    .replace(/CREATE TABLE/g, "!!CREATE TABLE!!")
                    .replace(/PRIMARY KEY/g, "!!PRIMARY KEY!!")
                    .replace(/REFERENCES/g, "!!REFERENCES!!")
                    .replace(/ENUM/g, "!!ENUM!!")
                    .split("!!")
                    .map((part, idx) => {
                      if (part === "CREATE TABLE" || part === "ENUM")
                        return (
                          <span key={idx} className="text-purple-400 font-bold">
                            {part}
                          </span>
                        );
                      if (part === "PRIMARY KEY")
                        return (
                          <span key={idx} className="text-amber-400">
                            {part}
                          </span>
                        );
                      if (part === "REFERENCES")
                        return (
                          <span key={idx} className="text-blue-400">
                            {part}
                          </span>
                        );
                      return part;
                    })}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SchemaViewer;
