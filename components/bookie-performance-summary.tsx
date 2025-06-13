"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

// Defines the shape of each bookmaker’s summary (no settings table required)
interface BookieSummary {
  bookmaker: string
  netDeposits: number
  bonusCredit: number
  freeBetsRemaining: number
  concludedWagers: number
  netWinnings: number
  pendingBetsCount: number
  pendingFundsAtRisk: number
  availableFunds: number
}

export function BookiePerformanceSummary() {
  const [summaries, setSummaries] = useState<BookieSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSummaries() {
      setLoading(true)
      setError(null)

      try {
        // 1) Fetch distinct bookmaker names from "bets" table
        //    (adjust table/column names as needed)
        const { data: betBookies, error: betBookiesError } = await supabase
          .from("bets")
          .select<{ bookmaker: string }>("bookmaker", { distinct: true })

        if (betBookiesError) throw betBookiesError

        // 2) Fetch distinct bookmaker names from "deposits" table
        const { data: depositBookies, error: depositBookiesError } = await supabase
          .from("deposits")
          .select<{ bookmaker: string }>("bookmaker", { distinct: true })

        if (depositBookiesError) throw depositBookiesError

        // 3) Merge both lists into a Set to get every unique bookmaker
        const namesSet = new Set<string>()
        ;(betBookies || []).forEach((r) => {
          if (r.bookmaker) namesSet.add(r.bookmaker)
        })
        ;(depositBookies || []).forEach((r) => {
          if (r.bookmaker) namesSet.add(r.bookmaker)
        })

        // If neither table returns any bookmakers, throw an error
        if (namesSet.size === 0) {
          throw new Error(
            "No bookmakers found in bets or deposits. Check your data."
          )
        }

        // Initialize a map of summaries for each bookmaker
        const summaryMap: Record<string, BookieSummary> = {}
        Array.from(namesSet).forEach((name) => {
          summaryMap[name] = {
            bookmaker: name,
            netDeposits: 0,
            bonusCredit: 0,
            freeBetsRemaining: 0,
            concludedWagers: 0,
            netWinnings: 0,
            pendingBetsCount: 0,
            pendingFundsAtRisk: 0,
            availableFunds: 0,
          }
        })

        // 4) Fetch all deposits to compute netDeposits, bonusCredit, freeBetsRemaining
        const { data: depositRows, error: depositError } = await supabase
          .from("deposits")
          .select<{
            bookmaker: string
            amount: number
            type: string
          }>("bookmaker, amount, type")

        if (depositError) throw depositError

        ;(depositRows || []).forEach((d) => {
          const book = d.bookmaker
          if (!(book in summaryMap)) return
          if (d.type === "cash") {
            summaryMap[book].netDeposits += d.amount
          } else if (d.type === "bonus") {
            summaryMap[book].bonusCredit += d.amount
          } else if (d.type === "freebet") {
            summaryMap[book].freeBetsRemaining += d.amount
          }
        })

        // 5) Fetch all bets to compute concludedWagers, netWinnings, pending counts/funds
        const { data: betRows, error: betError } = await supabase
          .from("bets")
          .select<{
            bookmaker: string
            stake: number
            profit: number
            status: string
            settled_at: string | null
          }>("bookmaker, stake, profit, status, settled_at")

        if (betError) throw betError

        ;(betRows || []).forEach((b) => {
          const book = b.bookmaker
          if (!(book in summaryMap)) return

          if (b.status === "settled" && b.settled_at) {
            summaryMap[book].concludedWagers += b.stake
            summaryMap[book].netWinnings += b.profit
          } else if (b.status === "pending") {
            summaryMap[book].pendingBetsCount += 1
            summaryMap[book].pendingFundsAtRisk += b.stake
          }
        })

        // 6) Compute availableFunds for each bookmaker:
        //    availableFunds =
        //      netDeposits + bonusCredit + freeBetsRemaining
        //      - concludedWagers + netWinnings
        //      - pendingFundsAtRisk
        for (const key of Object.keys(summaryMap)) {
          const s = summaryMap[key]
          s.availableFunds =
            s.netDeposits +
            s.bonusCredit +
            s.freeBetsRemaining -
            s.concludedWagers +
            s.netWinnings -
            s.pendingFundsAtRisk
        }

        // 7) Convert summaryMap into a sorted array by availableFunds descending
        const summaryArray = Object.values(summaryMap).sort(
          (a, b) => b.availableFunds - a.availableFunds
        )

        setSummaries(summaryArray)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Unknown error fetching bookie data.")
        setLoading(false)
      }
    }

    loadSummaries()
  }, [])

  // 8) Render loading or error states
  if (loading) {
    return <div className="text-center text-gray-400">Loading bookie data…</div>
  }
  if (error) {
    return (
      <div className="text-center text-red-500">
        Could not load bookie data: {error}
      </div>
    )
  }

  // 9) Render the table without any credit‐facility column
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Bookmaker</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Net Deposits</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Bonus Credit</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Free Bets</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Concluded Wagers</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Net Winnings</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Pending Bets (#)</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Pending Funds</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Available Funds</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background text-gray-200">
          {summaries.map((s) => (
            <tr key={s.bookmaker}>
              <td className="px-4 py-2 text-sm">{s.bookmaker}</td>
              <td className="px-4 py-2 text-right text-sm">
                ${s.netDeposits.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right text-sm">
                ${s.bonusCredit.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right text-sm">
                ${s.freeBetsRemaining.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right text-sm">
                ${s.concludedWagers.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right text-sm">
                <span
                  className={
                    s.netWinnings >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  ${s.netWinnings.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-2 text-right text-sm">
                {s.pendingBetsCount}
              </td>
              <td className="px-4 py-2 text-right text-sm">
                ${s.pendingFundsAtRisk.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right text-sm font-semibold">
                ${s.availableFunds.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
