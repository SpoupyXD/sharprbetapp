import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Parse body and allow amount to be null/undefined
    const { bookie_id, amount = null, bonus_bets } = await request.json();

    // Validate request
    if (typeof bookie_id !== "string" || !bookie_id) {
      return NextResponse.json({ error: "Invalid bookmaker ID" }, { status: 400 });
    }
    // Only validate amount if provided
    let depositAmount = 0;
    if (amount !== null && amount !== undefined) {
      if (typeof amount !== "number" || isNaN(amount)) {
        return NextResponse.json({ error: "Invalid deposit amount" }, { status: 400 });
      }
      depositAmount = amount;
    }
    // Validate bonus bets if provided
    let bonusAmount = 0;
    if (bonus_bets !== null && bonus_bets !== undefined) {
      if (typeof bonus_bets !== "number" || isNaN(bonus_bets)) {
        return NextResponse.json({ error: "Invalid bonus bets value" }, { status: 400 });
      }
      bonusAmount = bonus_bets;
    }

    // 1. Fetch current balance & bonus_bets
    const { data: account, error: fetchErr } = await supabase
      .from("bookmaker_accounts")
      .select("balance, bonus_bets")
      .eq("id", bookie_id)
      .single();
    if (fetchErr || !account) {
      throw new Error(fetchErr?.message || "Bookmaker not found");
    }

    // 2. Calculate new values
    const currentBal = parseFloat(account.balance as unknown as string);
    const newBalance = currentBal + depositAmount;
    const existingBonus = typeof account.bonus_bets === "number" ? account.bonus_bets : 0;
    const newBonus = existingBonus + bonusAmount;

    // 3. Update record
    const { data: updated, error: updErr } = await supabase
      .from("bookmaker_accounts")
      .update({ balance: newBalance, bonus_bets: newBonus })
      .eq("id", bookie_id)
      .select()
      .single();
    if (updErr) throw new Error(updErr.message);

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Deposit failed" },
      { status: 500 }
    );
  }
}
