// components/bookie-balances.tsx
"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

//
// ─── DATA SHAPE ─────────────────────────────────────────────────────────────────
//
//   Each account object must look like this:
//
//     interface AccountBalance {
//       name: string;       // e.g. "Bet365"
//       balance: number;    // e.g. 1200
//       profit: number;     // e.g. 250 (can be negative)
//       color?: string;     // optional: a hex color string for bar/legend
//     }
//
//   You must pass in an array of AccountBalance to this component. If you do not
//   have a `profit` field in your database, compute profit first (e.g. winnings
//   minus deposits), then feed it in here.
//

export interface AccountBalance {
  name: string;
  balance: number;
  profit: number;
  color?: string;
}

interface BookieBalancesProps {
  /** 
   * The full list of accounts you want to chart.
   * Each object must include { name, balance, profit, color? }. 
   */
  accounts: AccountBalance[];

  /**
   * If true, the “Profit/Loss” mode is unlocked. If false, “Profit/Loss” is
   * disabled and the user can only view “Balance.”
   */
  isPremium?: boolean;
}

export function BookieBalances({ accounts, isPremium = false }: BookieBalancesProps) {
  // ─────────────────────────────────────────────────────────────────────────────
  // State: current “page” of accounts, and which “view mode” to show.
  // ─────────────────────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"profit" | "balance">("profit");

  // ─────────────────────────────────────────────────────────────────────────────
  // Pagination configuration. PAGE_SIZE = how many bars to show per page.
  // If you have fewer accounts than PAGE_SIZE, it simply stays on one page.
  // ─────────────────────────────────────────────────────────────────────────────
  const PAGE_SIZE = 6;
  const maxIndex = Math.max(0, Math.ceil(accounts.length / PAGE_SIZE) - 1);

  const prevPage = useCallback(() => {
    setCurrentIndex((idx) => Math.max(0, idx - 1));
  }, []);

  const nextPage = useCallback(() => {
    setCurrentIndex((idx) => Math.min(maxIndex, idx + 1));
  }, [maxIndex]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Derive the slice of accounts we want to display on this page.
  // ─────────────────────────────────────────────────────────────────────────────
  const visibleAccounts = useMemo(() => {
    const start = currentIndex * PAGE_SIZE;
    return accounts.slice(start, start + PAGE_SIZE);
  }, [accounts, currentIndex]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Transform visibleAccounts into the form Recharts expects:
  // { name: string, value: number, color: string }
  // If viewMode === "profit" → use account.profit; else use account.balance.
  // ─────────────────────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    return visibleAccounts.map((acct) => ({
      name: acct.name,
      value: viewMode === "profit" ? acct.profit : acct.balance,
      color: acct.color ?? "#8884d8", // fallback if color is missing
    }));
  }, [visibleAccounts, viewMode]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Y‐axis label formatting. If “profit” we allow negatives, otherwise always ≥ 0.
  // ─────────────────────────────────────────────────────────────────────────────
  const formatYAxis = (val: number) => {
    if (viewMode === "profit") {
      return val < 0 ? `-$${Math.abs(val)}` : `$${val}`;
    }
    return `$${val}`;
  };

  return (
    <div className="h-[350px] w-full bg-gray-900 p-4 rounded-lg">
      {/* ─────────────────────────────────────────────────────────────────────────────
          Top toolbar: pagination arrows, current-range label, view-mode selector,
          and “Pro Only” badge (if isPremium===false).
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevPage} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold text-gray-100">
            Bookies {currentIndex * PAGE_SIZE + 1}–{Math.min((currentIndex + 1) * PAGE_SIZE, accounts.length)} of {accounts.length}
          </span>
          <Button variant="outline" size="icon" onClick={nextPage} disabled={currentIndex === maxIndex}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onValueChange={(val) => setViewMode(val as "profit" | "balance")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profit" disabled={!isPremium}>
                Profit/Loss
              </SelectItem>
              <SelectItem value="balance">Balance</SelectItem>
            </SelectContent>
          </Select>

          {!isPremium && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Pro Only
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    “Profit/Loss” mode is available only with a Pro subscription.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          The bar chart itself, inside a ResponsiveContainer so it always fills the
          available width/height. We map each bar’s color based on positive/negative
          in “profit” mode, or the custom color in “balance” mode.
      ───────────────────────────────────────────────────────────────────────────── */}
      <ResponsiveContainer width="100%" height="60%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#DDD" }}
            axisLine={{ stroke: "#666" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12, fill: "#DDD" }}
            axisLine={{ stroke: "#666" }}
            tickLine={false}
            domain={
              viewMode === "profit"
                ? ["dataMin - 20", "dataMax + 20"]
                : [0, "dataMax + 50"]
            }
          />
          <RechartsTooltip
            contentStyle={{ backgroundColor: "#222", border: "none" }}
            labelStyle={{ color: "#FFF" }}
            formatter={(value: number) => {
              if (viewMode === "profit") {
                return value < 0 ? `-$${Math.abs(value)}` : `$${value}`;
              }
              return `$${value}`;
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={
                  viewMode === "profit"
                    ? entry.value >= 0
                      ? "#22c55e" // green if profit ≥ 0
                      : "#ef4444" // red if profit < 0
                    : entry.color!
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* ─────────────────────────────────────────────────────────────────────────────
          Legend below the chart: each visible account’s name, and its corresponding
          Profit/Loss or Balance value.
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {visibleAccounts.map((acct) => (
          <div key={acct.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: acct.color ?? "#8884d8" }}
            />
            <div className="text-sm text-gray-200 flex-1 flex justify-between">
              <span>{acct.name}</span>
              <span
                className={
                  viewMode === "profit"
                    ? acct.profit > 0
                      ? "text-green-500"
                      : acct.profit < 0
                      ? "text-red-500"
                      : "text-gray-300"
                    : "text-gray-300"
                }
              >
                {viewMode === "profit"
                  ? acct.profit > 0
                    ? `+$${acct.profit}`
                    : acct.profit < 0
                    ? `-$${Math.abs(acct.profit)}`
                    : "$0"
                  : `$${acct.balance}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
