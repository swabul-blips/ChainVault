"use client";

import { useMemo, useState } from "react";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { updateState } from "@/lib/storage";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const state = useChainVaultState();
  const unread = useMemo(() => state.notifications.filter((n) => !n.read).length, [state.notifications]);

  function markAllRead() {
    updateState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => ({ ...notification, read: true })),
    }));
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="relative rounded-full border border-white/20 px-2 py-1 text-sm hover:bg-white/10"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notification center"
      >
        🔔
        {unread > 0 ? (
          <span className="absolute -top-2 -right-2 rounded-full bg-rose-500 px-1.5 text-[10px] text-white">
            {unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="glass-card absolute right-0 mt-2 w-80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Notifications</p>
            <button type="button" className="text-xs text-cyan-300" onClick={markAllRead}>
              Mark all read
            </button>
          </div>
          <ul className="max-h-72 space-y-2 overflow-auto text-xs">
            {state.notifications.map((notification) => (
              <li
                key={notification.id}
                className={`rounded-md border p-2 ${
                  notification.read ? "border-white/10 text-slate-400" : "border-cyan-400/40 text-slate-200"
                }`}
              >
                {notification.message}
              </li>
            ))}
            {state.notifications.length === 0 ? <li className="text-slate-400">No notifications yet.</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
