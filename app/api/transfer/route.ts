import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with your URL and service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { from_id, to_id, amount } = await request.json();

    // 1) Validate inputs
    if (!from_id || !to_id || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "from_id, to_id and positive amount are required" },
        { status: 400 }
      );
    }

    // 2) Fetch source balance and check funds
    const { data: fromAcc, error: err1 } = await supabase
      .from("bookmaker_accounts")
      .select("balance")
      .eq("id", from_id)
      .single();
    if (err1) throw err1;
    if ((fromAcc?.balance ?? 0) < amount) {
      return NextResponse.json(
        { error: "Insufficient funds to transfer" },
        { status: 400 }
      );
    }

    // 3) Fetch destination balance (just to confirm it exists)
    const { data: toAcc, error: err2 } = await supabase
      .from("bookmaker_accounts")
      .select("balance")
      .eq("id", to_id)
      .single();
    if (err2) throw err2;

    // 4) Perform debit and credit
    const { error: subErr } = await supabase
      .from("bookmaker_accounts")
      .update({ balance: fromAcc.balance - amount })
      .eq("id", from_id);
    if (subErr) throw subErr;

    const { error: addErr } = await supabase
      .from("bookmaker_accounts")
      .update({ balance: toAcc.balance + amount })
      .eq("id", to_id);
    if (addErr) throw addErr;

    // 5) Return fresh list of accounts (matching your front-end GET)
    const { data, error: listErr } = await supabase
      .from("bookmaker_accounts")
      .select(`
        id,
        name,
        type,
        website,
        balance,
        bonus_bets,
        bonus_expiry,
        owner,
        link_group,
        color,
        notes,
        created_at,
        updated_at,
        bonus_records (
          id,
          amount,
          type,
          expiry,
          created_at
        )
      `)
      .order("name", { ascending: true });

    if (listErr) throw listErr;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("POST /api/transfer error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
