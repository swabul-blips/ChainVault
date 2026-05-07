"use client";

import { useState } from "react";
import { resetState } from "@/lib/storage";

export function FloatingActions() {
  const [notice, setNotice] = useState("");

  function handleReset() {
    resetState();
    setNotice("Demo state reset.");
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <div className="fixed right-5 bottom-5 z-30 flex flex-col items-end gap-2">
      {notice ? <div className="glass-card px-3 py-2 text-xs text-cyan-200">{notice}</div> : null}
      <button
        type="button"
        className="fab"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        ↑
      </button>
      <button
        type="button"
        className="fab fab-danger"
        onClick={handleReset}
        aria-label="Reset demo data"
        title="Reset demo data"
      >
        ⟳
      </button>
    </div>
  );
}
