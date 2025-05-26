import type { HorseRacingBet } from "@/lib/types"

// Storage keys
const HORSE_RACING_BETS_KEY = "horseRacingBets"
const BONUS_BETS_KEY = "bonusBets"
const PROMO_USAGE_KEY = "horseRacingPromoUsage"

// Horse Racing Bets Storage
export function saveHorseRacingBets(bets: HorseRacingBet[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(HORSE_RACING_BETS_KEY, JSON.stringify(bets))
  }
}

export function loadHorseRacingBets(): HorseRacingBet[] {
  if (typeof window !== "undefined") {
    const storedBets = localStorage.getItem(HORSE_RACING_BETS_KEY)
    return storedBets ? JSON.parse(storedBets) : []
  }
  return []
}

// Bonus Bets Storage
export function saveBonusBets(bonusBets: Record<string, any>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(BONUS_BETS_KEY, JSON.stringify(bonusBets))
  }
}

export function loadBonusBets(): Record<string, any> {
  if (typeof window !== "undefined") {
    const storedBonusBets = localStorage.getItem(BONUS_BETS_KEY)
    return storedBonusBets ? JSON.parse(storedBonusBets) : {}
  }
  return {}
}

// Promo Usage Storage
export function savePromoUsage(promoUsage: Record<string, any>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROMO_USAGE_KEY, JSON.stringify(promoUsage))
  }
}

export function loadPromoUsage(): Record<string, any> {
  if (typeof window !== "undefined") {
    const storedPromoUsage = localStorage.getItem(PROMO_USAGE_KEY)
    if (storedPromoUsage) {
      return JSON.parse(storedPromoUsage)
    }
    // Initialize with empty data if not found
    const today = new Date().toISOString().split("T")[0]
    const initialPromoUsage = {
      [today]: {},
    }
    savePromoUsage(initialPromoUsage)
    return initialPromoUsage
  }
  return {}
}
