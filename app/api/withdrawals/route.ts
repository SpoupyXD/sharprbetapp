import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { bookie_id, amount } = await request.json();

    if (typeof bookie_id !== "string" || !bookie_id) {
      return NextResponse.json({ error: "Invalid bookmaker ID" }, { status: 400 });
    }
    if (typeof amount !== "number" || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }

    const { data: account, error: fetchErr } = await supabase
      .from("bookmaker_accounts")
      .select("balance")
      .eq("id", bookie_id)
      .single();
    if (fetchErr || !account) {
      throw new Error(fetchErr?.message || "Bookmaker not found");
    }

    const currentBal = parseFloat(account.balance as unknown as string);
    if (amount > currentBal) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );
    }

    const newBalance = currentBal - amount;

    const { data: updated, error: updErr } = await supabase
      .from("bookmaker_accounts")
      .update({ balance: newBalance })
      .eq("id", bookie_id)
      .select()
      .single();
    if (updErr) throw new Error(updErr.message);

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Withdrawal failed" },
      { status: 500 }
    );
  }
}
