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
      .select(
        [
          "id",
          "name",
          "type",
          "website",
          "balance",
          "owner",
          "link_group",
          "color",
          "notes",
          "created_at",
          "updated_at"
        ].join(",")
      )
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("🔍 POST /api/bookies request body:", body);

    const {
      name,
      type,
      website = null,
      balance,
      owner = null,
      linkGroup = null,
      color = null,
      notes = null,
    } = body;

    // Validation
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Account name is required" },
        { status: 400 }
      );
    }
    if (!["bookie", "exchange", "bank"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }
    if (typeof balance !== "number" || isNaN(balance)) {
      return NextResponse.json(
        { error: "Balance must be a number" },
        { status: 400 }
      );
    }

    // Build payload matching table columns
    const insertPayload: Record<string, unknown> = {
      name: name.trim(),
      type,
      website:
        typeof website === "string" && website.trim()
          ? website.trim()
          : null,
      balance,
      owner:
        typeof owner === "string" && owner.trim()
          ? owner.trim()
          : null,
      link_group:
        typeof linkGroup === "string" && linkGroup.trim()
          ? linkGroup.trim()
          : null,
      color:
        typeof color === "string" && color.trim()
          ? color.trim()
          : null,
      notes:
        typeof notes === "string" && notes.trim()
          ? notes.trim()
          : null,
    };

    console.log("🔧 Inserting payload:", insertPayload);

    const { data: created, error } = await supabase
      .from("bookmaker_accounts")
      .insert(insertPayload)
      .select(
        [
          "id",
          "name",
          "type",
          "website",
          "balance",
          "owner",
          "link_group",
          "color",
          "notes",
          "created_at",
          "updated_at"
        ].join(",")
      )
      .single();

    if (error) {
      console.error(
        "POST /api/bookies Supabase error:",
        error.message,
        error.details || ""
      );
      return NextResponse.json(
        { error: "DB insert failed: " + (error.message || "Unknown error") },
        { status: 500 }
      );
    }

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/bookies unexpected error:", err);
    const msg = err?.message || "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
