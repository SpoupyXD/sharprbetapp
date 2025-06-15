import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Parse & validate input
    const { bookie_id, amount = null, bonus_bets = null } = await request.json();

    if (typeof bookie_id !== "string" || !bookie_id) {
      return NextResponse.json({ error: "Invalid bookmaker ID" }, { status: 400 });
    }

    let depositAmount = 0;
    if (amount !== null) {
      if (typeof amount !== "number" || isNaN(amount)) {
        return NextResponse.json({ error: "Invalid deposit amount" }, { status: 400 });
      }
      depositAmount = amount;
    }

    let bonusAmount = 0;
    if (bonus_bets !== null) {
      if (typeof bonus_bets !== "number" || isNaN(bonus_bets)) {
        return NextResponse.json({ error: "Invalid bonus bets value" }, { status: 400 });
      }
      bonusAmount = bonus_bets;
    }

    // 2. Fetch current account data
    const { data: account, error: fetchErr } = await supabase
      .from("bookmaker_accounts")
      .select("balance, bonus_bets")
      .eq("id", bookie_id)
      .single();

    if (fetchErr || !account) {
      throw new Error(fetchErr?.message ?? "Bookmaker not found");
    }

    // 3. Compute new balance & bonus
    const currentBal = typeof account.balance === "number"
      ? account.balance
      : parseFloat(account.balance as unknown as string);
    const currentBonus = typeof account.bonus_bets === "number"
      ? account.bonus_bets
      : 0;

    const newBalance = currentBal + depositAmount;
    const newBonus   = currentBonus + bonusAmount;

    // 4. Update the account row
    const { data: updated, error: updErr } = await supabase
      .from("bookmaker_accounts")
      .update({ balance: newBalance, bonus_bets: newBonus })
      .eq("id", bookie_id)
      .select()
      .single();

    if (updErr) {
      throw new Error(updErr.message);
    }

    // 5. Return the updated record
    return NextResponse.json(updated, { status: 200 });

  } catch (err: any) {
    // 6. Error handler
    return NextResponse.json(
      { error: err.message ?? "Deposit failed" },
      { status: 500 }
    );
  }
}