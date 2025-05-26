export interface HorseRacingBet {
  id: string
  date: string
  time: string
  track: string
  race: string
  horse: string
  odds: number
  stake: number
  status: "pending" | "active" | "won" | "lost"
  result: string
  position: number
  bookie: string
  betType: string
  isPromo: boolean
  promoType?: string
  profit: number
  notes?: string
  bonusTriggered: boolean
  bonusBetValue: number
}
