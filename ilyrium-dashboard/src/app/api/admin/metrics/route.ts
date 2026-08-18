import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Unauthorized access." }, { status: 403 });
  }

  try {
    // 1. Fetch Users Count & List
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, wallet_address, plan_id, created_at, plans(name, slug, price_sol)")
      .order("created_at", { ascending: false });

    if (usersError) {
      return NextResponse.json({ error: "Failed to fetch users from database." }, { status: 500 });
    }

    // 2. Fetch API Keys
    const { data: apiKeys, error: keysError } = await supabase
      .from("api_keys")
      .select("id, user_id, name, key_value, status, created_at")
      .order("created_at", { ascending: false });

    if (keysError) {
      return NextResponse.json({ error: "Failed to fetch API keys from database." }, { status: 500 });
    }

    // 3. Fetch Plans
    const { data: plans } = await supabase
      .from("plans")
      .select("*");

    // 4. Fetch Usage Logs Aggregates
    const { data: usageLogs } = await supabase
      .from("usage_logs")
      .select("request_count, error_count, avg_latency, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    let totalRequests = 0;
    let totalErrors = 0;
    let totalLatency = 0;
    let logCount = 0;

    if (usageLogs && usageLogs.length > 0) {
      for (const log of usageLogs) {
        totalRequests += Number(log.request_count || 0);
        totalErrors += Number(log.error_count || 0);
        totalLatency += Number(log.avg_latency || 0);
        logCount++;
      }
    }

    const avgLatency = logCount > 0 ? (totalLatency / logCount).toFixed(2) : "0.00";
    const errorRate = totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : "0.00";

    const totalUsers = users ? users.length : 0;
    const totalKeys = apiKeys ? apiKeys.length : 0;
    const activeKeys = apiKeys ? apiKeys.filter((k) => k.status === "active").length : 0;
    const revokedKeys = apiKeys ? apiKeys.filter((k) => k.status === "revoked").length : 0;

    // Plan distribution
    const planCounts: Record<string, number> = {};
    if (users) {
      for (const u of users) {
        const planName = (u.plans as unknown as { name: string } | null)?.name || "Developer Free";
        planCounts[planName] = (planCounts[planName] || 0) + 1;
      }
    }

    // Format recent users
    const recentUsers = (users || []).slice(0, 15).map((u) => ({
      id: u.id,
      wallet_address: u.wallet_address,
      plan: (u.plans as unknown as { name: string } | null)?.name || "Developer",
      created_at: u.created_at,
    }));

    // Format recent keys (mask secret value)
    const userWalletMap = new Map<string, string>();
    if (users) {
      for (const u of users) {
        userWalletMap.set(u.id, u.wallet_address);
      }
    }

    const recentKeys = (apiKeys || []).slice(0, 15).map((k) => ({
      id: k.id,
      name: k.name,
      masked_key: `${k.key_value.substring(0, 14)}...${k.key_value.slice(-4)}`,
      status: k.status,
      user_wallet: userWalletMap.get(k.user_id) || "Unknown",
      created_at: k.created_at,
    }));

    return NextResponse.json({
      success: true,
      telemetry: {
        totalUsers,
        totalKeys,
        activeKeys,
        revokedKeys,
        totalRequests,
        totalErrors,
        avgLatency: `${avgLatency}ms`,
        errorRate: `${errorRate}%`,
        planCounts,
      },
      plans: plans || [],
      recentUsers,
      recentKeys,
      envConfig: {
        supabaseConnected: true,
        primaryRpcConfigured: Boolean(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || process.env.PRIMARY_RPC_URL),
        fallbackRpcConfigured: Boolean(process.env.FALLBACK_RPC_URL),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
