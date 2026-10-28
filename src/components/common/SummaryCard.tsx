import React from "react";
import Markdown from "react-markdown";

const Index = ({ text }: { text?: string }) => {
  if (!text) return null;

  return (
    <aside
      className="rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)] px-5 py-5 lg:px-6"
      aria-label="文章摘要"
    >
      <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        AI 摘要
      </p>
      <div className="summary-body text-[0.95rem] leading-[1.8] tracking-[0.01em] text-[var(--ink-soft)]">
        <Markdown>{text}</Markdown>
      </div>
    </aside>
  );
};

export default Index;
