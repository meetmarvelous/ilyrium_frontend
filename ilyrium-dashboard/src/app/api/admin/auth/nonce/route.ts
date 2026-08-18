import { NextRequest, NextResponse } from "next/server";
import { generateAdminNonce } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, passphrase } = body;

    const adminSecret = process.env.ADMIN_SECRET_PASSPHRASE;
    const adminWalletsEnv = process.env.ADMIN_WALLET_ADDRESSES || "";
    const allowedWallets = adminWalletsEnv
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);

    if (!adminSecret || !passphrase || passphrase !== adminSecret) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required." },
        { status: 400 }
      );
    }

    const walletClean = walletAddress.trim().toLowerCase();
    if (allowedWallets.length > 0 && !allowedWallets.includes(walletClean)) {
      return NextResponse.json(
        { error: "This wallet address is not authorized for admin access." },
        { status: 403 }
      );
    }

    const nonce = generateAdminNonce(walletAddress.trim());

    return NextResponse.json({
      success: true,
      nonce,
      message: "Please sign this cryptographic challenge with your Solana wallet to verify ownership.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
