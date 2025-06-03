"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { BookmakerAccountsTable } from "@/components/bookmaker-accounts-table";
import { useToast } from "@/hooks/use-toast";

// Initialize Supabase client using your public anon key.
// (This runs on the client because "use client" is at the top.)
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// TypeScript interface matching your "bookmaker_accounts" table.
interface Account {
  id: string;
  name: string;
  type: "bookie" | "exchange" | "bank";
  website: string | null;
  balance: number;
  available_promos: number | null;
  notes: string | null;
  currency: string; // adjust if you store currency differently
  created_at: string;
  updated_at: string;
}

export default function BookiesPage() {
  const { toast } = useToast();

  // Local state: list of accounts fetched from Supabase
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Fetch all accounts from Supabase on mount
  useEffect(() => {
    async function fetchAccounts() {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from<Account>("bookmaker_accounts")
          .select("id, name, type, website, balance, available_promos, notes, currency, created_at, updated_at");

        if (error) {
          throw error;
        }
        // data is typed as Account[] here
        setAccounts(data || []);
      } catch (err: any) {
        console.error("Supabase fetch error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  // 2) Delete a single account by ID
  const handleDeleteAccount = useCallback(
    async (accountId: string) => {
      if (!confirm("Are you sure you want to delete this account?")) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("bookmaker_accounts")
          .delete()
          .eq("id", accountId);

        if (error) {
          throw error;
        }

        // If Supabase returns an empty array, it means no row was deleted:
        if (!data || data.length === 0) {
          toast({
            title: "Delete failed",
            description: `No account found with ID ${accountId}.`,
            variant: "destructive",
          });
          return;
        }

        // Remove from local state
        setAccounts((prev) => prev.filter((acct) => acct.id !== accountId));
        toast({
          title: "Account deleted",
          description: "The account was successfully removed.",
        });
      } catch (err: any) {
        console.error("Supabase delete error:", err);
        toast({
          title: "Delete failed",
          description: err.message || "There was a problem deleting this account.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // 3) Refresh the list (e.g. after adding/editing)
  const refreshAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from<Account>("bookmaker_accounts")
        .select("id, name, type, website, balance, available_promos, notes, currency, created_at, updated_at");

      if (error) {
        throw error;
      }
      setAccounts(data || []);
    } catch (err: any) {
      console.error("Supabase refresh error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="pt-2 p-6 md:px-10 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your bookmakers, exchanges, and bank accounts
          </p>
        </div>
        <Link href="/bookies/add">
          <Button className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
          <CardDescription>
            Track balances and manage accounts across all your bookmakers,
            exchanges, and banks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading accounts…</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : accounts.length === 0 ? (
            <p className="text-muted-foreground">
              No accounts found. Click “Add Account” to get started.
            </p>
          ) : (
            <BookmakerAccountsTable
              accounts={accounts}
              onDelete={handleDeleteAccount}
              onRefresh={refreshAccounts}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
