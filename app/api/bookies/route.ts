// app/api/bookies/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (use your service role key here)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
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
    console.error("GET /api/bookies error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}

export async function POST(request: Request) {
  const {
    name,
    type,
    website,
    balance,
    owner,
    link_group,
    color,
    notes,
    bonus_bets,
    bonus_expiry,
  } = await request.json();

  const { data, error } = await supabase
    .from("bookmaker_accounts")
    .insert([
      {
        name,
        type,
        website,
        balance,
        owner,
        link_group,
        color,
        notes,
        bonus_bets,
        bonus_expiry,
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("POST /api/bookies error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, balance, bonus_bets } = await request.json();
  if (!id || typeof balance !== "number" || typeof bonus_bets !== "number") {
    return NextResponse.json(
      { error: "id, balance and bonus_bets are required" },
      { status: 400 }
    );
  }

  // If there's a new bonus amount, push expiry out 30 days; otherwise clear it
  const bonus_expiry =
    bonus_bets > 0
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;

  const { data, error } = await supabase
    .from("bookmaker_accounts")
    .update({ balance, bonus_bets, bonus_expiry })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("PUT /api/bookies error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
