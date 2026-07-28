import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// DELETE /api/keys/[id] — Revoke an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const walletAddress = request.headers.get("x-wallet-address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Missing x-wallet-address header" },
      { status: 401 }
    );
  }

  // Verify the key belongs to the user
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

  const { error } = await supabase
    .from("api_keys")
    .update({ status: "revoked" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to revoke key" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Key revoked successfully" });
}
