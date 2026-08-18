import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Unauthorized access." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { target, customUrl } = body;

    let targetUrl = "";
    if (target === "primary") {
      targetUrl =
        process.env.PRIMARY_RPC_URL ||
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://api.devnet.solana.com";
    } else if (target === "fallback") {
      targetUrl =
        process.env.FALLBACK_RPC_URL ||
        "https://api.mainnet-beta.solana.com";
    } else if (target === "custom" && customUrl) {
      targetUrl = customUrl.trim();
    } else {
      targetUrl =
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://api.devnet.solana.com";
    }

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "Invalid RPC URL format. Must start with http:// or https://" },
        { status: 400 }
      );
    }

    // Mask sensitive auth query params in display URL
    let maskedUrl = targetUrl;
    try {
      const parsed = new URL(targetUrl);
      if (parsed.searchParams.has("auth")) {
        const token = parsed.searchParams.get("auth") || "";
        parsed.searchParams.set("auth", `${token.slice(0, 4)}...${token.slice(-4)}`);
        maskedUrl = parsed.toString();
      }
    } catch {
      maskedUrl = targetUrl;
    }

    // 1. Benchmark & Test getVersion + getSlot
    const startTime = performance.now();
    const rpcPayload = {
      jsonrpc: "2.0",
      id: 1,
      method: "getVersion",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    let response: Response;
    try {
      response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rpcPayload),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      return NextResponse.json({
        success: false,
        targetUrl: maskedUrl,
        status: "offline",
        error: isTimeout ? "Request timed out after 8,000ms" : "Network connection failed (unreachable)",
        latencyMs: isTimeout ? 8000 : 0,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const latencyMs = Math.round(performance.now() - startTime);
    const json = await response.json().catch(() => null);

    if (!response.ok || !json) {
      return NextResponse.json({
        success: false,
        targetUrl: maskedUrl,
        status: "degraded",
        httpStatus: response.status,
        latencyMs,
        rawResponse: json,
        error: `HTTP Error ${response.status}: ${response.statusText}`,
      });
    }

    // 2. Fetch Latest Slot for sync check
    let slot = 0;
    try {
      const slotRes = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "getSlot" }),
      });
      const slotJson = await slotRes.json();
      slot = slotJson?.result || 0;
    } catch {
      // ignore secondary check
    }

    const nodeVersion = json?.result?.["solana-core"] || json?.result?.featureSet || "Solana Node Active";

    return NextResponse.json({
      success: true,
      targetUrl: maskedUrl,
      status: "online",
      httpStatus: response.status,
      latencyMs,
      nodeVersion,
      currentSlot: slot,
      rawResponse: json,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Diagnostics execution error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
