import { supabase } from "./supabase"
import { Bet } from "@/components/bets-list"

// 🔹 Fetch all bets for current user
export async function getUserBets(userId: string): Promise<Bet[]> {
  const { data, error } = await supabase
    .from("bets")
    .select("*")
    .eq("", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error inserting bet:", error.message || JSON.stringify(error))
    return []
  }

  return data as Bet[]
}

// 🔹 Insert a new bet for current user
export async function insertBet(bet: Bet): Promise<void> {
  const { error } = await supabase.from("bets").insert([bet])

  if (error) {
    console.error("Error inserting bet:", error)
    throw error
  }
}

// 🔹 Update an existing bet
export async function updateBetById(betId: string, updates: Partial<Bet>): Promise<void> {
  const { error } = await supabase
    .from("bets")
    .update(updates)
    .eq("id", betId)

  if (error) {
    console.error("Error updating bet:", error)
    throw error
  }
}

// 🔹 Update only status + profit/loss
export async function updateBetStatus(
  betId: string,
  newStatus: Bet["status"],
  profitLoss: number
): Promise<void> {
  const { error } = await supabase
    .from("bets")
    .update({ status: newStatus, profitLoss })
    .eq("id", betId)

    if (error) {
      const readable = error.message || JSON.stringify(error)
      console.error("Error inserting bet:", readable)
      throw new Error(readable)
    }
    
}
