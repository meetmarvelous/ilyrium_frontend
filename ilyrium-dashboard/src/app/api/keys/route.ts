import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

// GET /api/keys — Fetch all API keys for a user (identified by wallet address)
export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get("x-wallet-address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Missing x-wallet-address header" },
      { status: 401 }
    );
  }

  // Find the user by wallet
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("wallet_address", walletAddress)
    .single();

  if (userError || !user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Fetch their keys
  const { data: keys, error: keysError } = await supabase
    .from("api_keys")
    .select("id, name, key_value, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (keysError) {
    return NextResponse.json(
      { error: "Failed to fetch keys" },
      { status: 500 }
    );
  }

  return NextResponse.json({ keys });
}

// POST /api/keys — Generate a new API key
export async function POST(request: NextRequest) {
  const walletAddress = request.headers.get("x-wallet-address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Missing x-wallet-address header" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const keyName = body.name || "Untitled Key";

  // Find or create user
  let { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("wallet_address", walletAddress)
    .single();

  if (!user) {
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({ wallet_address: walletAddress })
      .select("id")
      .single();

    if (createError || !newUser) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
    user = newUser;
  }

  // Generate a cryptographically random API key
  const keyValue = `ilr_live_${crypto.randomBytes(24).toString("hex")}`;

  const { data: newKey, error: keyError } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      name: keyName,
      key_value: keyValue,
    })
    .select("id, name, key_value, status, created_at")
    .single();

  if (keyError || !newKey) {
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }

  return NextResponse.json({ key: newKey }, { status: 201 });
}
