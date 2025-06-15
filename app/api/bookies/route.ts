// app/api/bookies/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Ensure these env vars are set in .env.local:
// NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
console.log(
  "▶︎ SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 4),
  "..."
);

// Initialize Supabase client (server-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
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

    if (error) {
      console.error("GET /api/bookies Supabase error:", error);
      return NextResponse.json(
        { error: "Unable to fetch bookmaker accounts: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (err: any) {
    console.error("GET /api/bookies unexpected error:", err);
    return NextResponse.json(
      { error: "Fetch error: " + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, balance, bonus_bets } = await request.json();

    if (!id || typeof balance !== "number" || typeof bonus_bets !== "number") {
      return NextResponse.json(
        { error: "id, balance and bonus_bets are required" },
        { status: 400 }
      );
    }

const expiryDate =
  bonusAmt > 0
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    : null;

const { data, error } = await supabase
  .from("bookmaker_accounts")
  .update({ balance: newBalance, bonus_bets: newBonus })
  .eq("id", bookie_id)
  .select("*")
  .single();

    if (error) {
      console.error("PUT /api/bookies Supabase error:", error);
      return NextResponse.json(
        { error: "Update failed: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("PUT /api/bookies unexpected error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unexpected server error" },
      { status: 500 }
    );
  }
}