// app/api/bookies/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Fetch all bookmaker accounts (for now, no filtering by user).
    const accounts = await prisma.bookmakerAccount.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(accounts, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/bookies error:", err);
    return NextResponse.json(
      { error: "Unable to fetch bookie accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    /**
     * Expected JSON shape (your front end should send):
     * {
     *   name: string,
     *   type: "bookie" | "exchange" | "bank",
     *   website?: string,
     *   balance: number,
     *   availablePromos?: number,
     *   notes?: string
     * }
     */
    const {
      name,
      type,
      website = "",
      balance,
      availablePromos = null,
      notes = "",
    } = body;

    // Basic server‐side validation:
    if (typeof name !== "string" || name.trim().length === 0) {
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
        { error: "Balance must be a valid number" },
        { status: 400 }
      );
    }

    const created = await prisma.bookmakerAccount.create({
      data: {
        name: name.trim(),
        type,
        website: website.trim() || null,
        balance,
        availablePromos:
          typeof availablePromos === "number" ? availablePromos : null,
        notes: notes.trim() || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/bookies error:", err);
    return NextResponse.json(
      { error: "Unable to create bookmaker account" },
      { status: 500 }
    );
  }
}
