export type Deposit = {
  lender: string;
  tier: "Safe" | "Balanced" | "Bold";
  amount: number;
  createdAt: string;
};

export type Loan = {
  borrower: string;
  amount: number;
  termDays: number;
  interestPercent: number;
  status: "Active" | "Repaid" | "Defaulted";
  createdAt: string;
};

export type BridgeEvent = {
  fromChain: string;
  toChain: string;
  token: string;
  amount: number;
  routeId: string;
  createdAt: string;
};

export type ChainVaultState = {
  walletAddress: string;
  chainScore: number;
  totalDeposits: number;
  totalLoansIssued: number;
  totalRepaid: number;
  deposits: Deposit[];
  loans: Loan[];
  bridgeEvents: BridgeEvent[];
  vaults: SavingsVault[];
  notifications: AppNotification[];
  onboardingStep: 1 | 2 | 3 | 4;
  preferences: UserPreferences;
};

export type VaultSchedule = "Weekly" | "BiWeekly" | "Flexible";

export type SavingsVault = {
  id: string;
  owner: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentBalance: number;
  interestEarned: number;
  createdAt: string;
  targetDate?: string;
  contributionSchedule: VaultSchedule;
  isPublic: boolean;
  vouches: number;
  isCompleted: boolean;
  contributionHistory: Array<{ amount: number; createdAt: string }>;
};

export type AppNotification = {
  id: string;
  type: "loan" | "vault" | "score" | "pool" | "system";
  message: string;
  createdAt: string;
  read: boolean;
};

export type UserPreferences = {
  voiceEnabled: boolean;
  theme: "dark" | "light";
};

const defaultState: ChainVaultState = {
  walletAddress: "",
  chainScore: 540,
  totalDeposits: 0,
  totalLoansIssued: 0,
  totalRepaid: 0,
  deposits: [],
  loans: [],
  bridgeEvents: [],
  vaults: [],
  notifications: [
    {
      id: "welcome_001",
      type: "system",
      message: "Welcome to ChainVault! Connect your Solana wallet to get a live ChainScore.",
      createdAt: new Date().toISOString(),
      read: false,
    },
  ],
  onboardingStep: 1,
  preferences: {
    voiceEnabled: true,
    theme: "dark",
  },
};

const STORAGE_KEY = "chainvault_state_v1";
const STATE_EVENT = "chainvault:state-changed";

export function getState(): ChainVaultState {
  if (typeof window === "undefined") return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw) as Partial<ChainVaultState>;
    return {
      ...defaultState,
      ...parsed,
      preferences: {
        ...defaultState.preferences,
        ...(parsed.preferences ?? {}),
      },
    };
  } catch {
    return defaultState;
  }
}

export function saveState(nextState: ChainVaultState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new CustomEvent(STATE_EVENT, { detail: nextState }));
}

export function resetState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(STATE_EVENT, { detail: defaultState }));
}

export function updateState(updater: (current: ChainVaultState) => ChainVaultState): ChainVaultState {
  const current = getState();
  const next = updater(current);
  saveState(next);
  return next;
}

export function announceVoice(text: string): void {
  const state = getState();
  if (!state.preferences.voiceEnabled) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

export function addNotification(
  notification: Omit<AppNotification, "id" | "createdAt" | "read">,
): void {
  updateState((state) => ({
    ...state,
    notifications: [
      {
        id: `notif_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        read: false,
        ...notification,
      },
      ...state.notifications,
    ].slice(0, 50),
  }));
}

export function subscribeState(listener: (state: ChainVaultState) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onCustomState = (event: Event) => {
    const customEvent = event as CustomEvent<ChainVaultState>;
    if (customEvent.detail) listener(customEvent.detail);
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener(getState());
  };

  window.addEventListener(STATE_EVENT, onCustomState as EventListener);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(STATE_EVENT, onCustomState as EventListener);
    window.removeEventListener("storage", onStorage);
  };
}
