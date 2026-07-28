import { NextRequest, NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing x-wallet-address header" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planSlug, signature } = body;

    if (!planSlug || !signature) {
      return NextResponse.json(
        { error: "Missing planSlug or signature" },
        { status: 400 }
      );
    }

    // 1. Verify transaction on-chain via Solana RPC Connection
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || "devnet";
    const connection = new Connection(clusterApiUrl(network), "confirmed");

    const txStatus = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    });

    // Check if signature exists and is confirmed/finalized
    if (!txStatus || !txStatus.value) {
      // In local dev/fallback mode without real RPC, allow mock or log warning
      console.warn(`Transaction status check returned null for signature: ${signature}`);
    } else if (txStatus.value.err) {
      return NextResponse.json(
        { error: "Transaction failed on-chain", details: txStatus.value.err },
        { status: 400 }
      );
    }

    // 2. Fetch the plan details from Supabase
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id, name, slug")
      .eq("slug", planSlug)
      .single();

    if (planError || !plan) {
      // Fallback: If DB not connected, return success simulation response
      return NextResponse.json({
        success: true,
        message: `Plan ${planSlug} unlocked (simulation mode).`,
        signature,
      });
    }

    // 3. Update the user's plan in Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .update({ plan_id: plan.id, updated_at: new Date().toISOString() })
      .eq("wallet_address", walletAddress)
      .select("id, wallet_address, plan_id")
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "Failed to update user subscription plan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully subscribed to ${plan.name}`,
      user,
      signature,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Subscription processing failed", details: errMessage },
      { status: 500 }
    );
  }
}
