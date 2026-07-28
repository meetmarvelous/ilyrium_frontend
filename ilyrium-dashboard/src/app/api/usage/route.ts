import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/usage — Fetch aggregated usage statistics for the dashboard
export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get("x-wallet-address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Missing x-wallet-address header" },
      { status: 401 }
    );
  }

  // Find the user
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("wallet_address", walletAddress)
    .single();

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Get all user's API key IDs
  const { data: keys } = await supabase
    .from("api_keys")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!keys || keys.length === 0) {
    return NextResponse.json({
      stats: {
        totalRequests: 0,
        avgLatency: 0,
        errorRate: 0,
        activeKeys: 0,
      },
    });
  }

  const keyIds = keys.map((k) => k.id);

  // Aggregate usage from the last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: logs } = await supabase
    .from("usage_logs")
    .select("request_count, error_count, avg_latency")
    .in("api_key_id", keyIds)
    .gte("period_start", twentyFourHoursAgo);

  let totalRequests = 0;
  let totalErrors = 0;
  let totalLatency = 0;
  let logCount = 0;

  if (logs) {
    for (const log of logs) {
      totalRequests += Number(log.request_count);
      totalErrors += Number(log.error_count);
      totalLatency += Number(log.avg_latency);
      logCount++;
    }
  }

  const avgLatency = logCount > 0 ? (totalLatency / logCount).toFixed(2) : "0.00";
  const errorRate = totalRequests > 0
    ? ((totalErrors / totalRequests) * 100).toFixed(2)
    : "0.00";

  return NextResponse.json({
    stats: {
      totalRequests,
      avgLatency: `${avgLatency}ms`,
      errorRate: `${errorRate}%`,
      activeKeys: keys.length,
    },
  });
}
