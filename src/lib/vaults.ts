import type { SavingsVault, VaultSchedule } from "@/lib/storage";

export const SAFE_APY = 0.08;

export function createVaultId() {
  return `vault_${Math.random().toString(36).slice(2, 9)}`;
}

export function contributionCadenceDays(schedule: VaultSchedule): number {
  if (schedule === "Weekly") return 7;
  if (schedule === "BiWeekly") return 14;
  return 10;
}

export function computeAccruedInterest(vault: SavingsVault): number {
  const daysElapsed = Math.max(
    1,
    Math.floor((Date.now() - new Date(vault.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );
  const principal = vault.currentBalance;
  const dailyRate = SAFE_APY / 365;
  const compounded = principal * (Math.pow(1 + dailyRate, daysElapsed) - 1);
  return Math.max(0, Number(compounded.toFixed(2)));
}

export function projectedCompletionDate(vault: SavingsVault): string {
  const history = vault.contributionHistory;
  if (vault.currentBalance >= vault.targetAmount) return "Completed";
  if (history.length === 0) return "Need first deposit";

  const daysSinceStart = Math.max(
    1,
    Math.floor((Date.now() - new Date(vault.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );
  const dailyPace = vault.currentBalance / daysSinceStart;
  if (dailyPace <= 0) return "Insufficient pace";

  const remaining = vault.targetAmount - vault.currentBalance;
  const daysRemaining = Math.ceil(remaining / dailyPace);
  const target = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);
  return target.toLocaleDateString();
}

export function weeklyPace(vault: SavingsVault): number {
  const daysSinceStart = Math.max(
    1,
    Math.floor((Date.now() - new Date(vault.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );
  return Number(((vault.currentBalance / daysSinceStart) * 7).toFixed(2));
}
