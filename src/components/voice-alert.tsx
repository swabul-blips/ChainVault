"use client";

import { useState } from "react";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { updateState } from "@/lib/storage";

type VoiceEvent = "approved" | "reminder" | "improved" | "overdue";

const voiceText: Record<VoiceEvent, string> = {
  approved: "Congratulations! Your loan has been approved.",
  reminder: "Friendly reminder: your repayment is due in three days.",
  improved: "Great job! Your ChainScore has improved.",
  overdue: "Warning: your loan is overdue. Please repay to avoid penalties.",
};

export function VoiceAlert() {
  const state = useChainVaultState();
  const [event, setEvent] = useState<VoiceEvent>("approved");
  const [message, setMessage] = useState("");

  function playAlert() {
    const text = voiceText[event];
    if (!state.preferences.voiceEnabled) {
      setMessage(`Voice is disabled. Event text: "${text}"`);
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      setMessage(`Voice alert played: "${text}"`);
      return;
    }
    setMessage(`Speech synthesis unavailable. Event text: "${text}"`);
  }

  return (
    <div className="glass-card animate-rise p-6">
      <h3 className="text-xl font-semibold">Voice Notifications</h3>
      <p className="mt-2 text-sm text-slate-300">
        This demo uses browser speech synthesis as a local fallback for ElevenLabs behavior.
      </p>
      <label className="mt-3 flex items-center gap-2 text-xs text-slate-300">
        <input
          type="checkbox"
          checked={state.preferences.voiceEnabled}
          onChange={(e) =>
            updateState((current) => ({
              ...current,
              preferences: { ...current.preferences, voiceEnabled: e.target.checked },
            }))
          }
        />
        Enable voice notifications
      </label>
      <label className="mt-4 block text-sm text-slate-300">
        Event
        <select
          className="input-field mt-1"
          value={event}
          onChange={(e) => setEvent(e.target.value as VoiceEvent)}
        >
          <option value="approved">Loan Approved</option>
          <option value="reminder">Repayment Reminder</option>
          <option value="improved">Score Improved</option>
          <option value="overdue">Overdue Warning</option>
        </select>
      </label>
      <button type="button" className="btn-primary mt-4 text-sm font-medium" onClick={playAlert}>
        Play Voice Alert
      </button>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </div>
  );
}
