"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export default function WalletConnect() {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="wallet-adapter-custom">
      <WalletMultiButton className="!bg-primary !rounded-xl !h-11 !px-6 !font-heading !font-bold !text-sm !transition-all hover:!shadow-lg hover:!shadow-primary/20 !border-none">
        <div className="flex items-center gap-2">
          {!connected && <Wallet size={16} />}
          <span>{connected ? `${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}` : "Connect Wallet"}</span>
        </div>
      </WalletMultiButton>
      
      <style jsx global>{`
        .wallet-adapter-button-trigger {
          background-color: var(--primary) !important;
        }
        .wallet-adapter-modal-wrapper {
          background-color: white !important;
          border-radius: 32px !important;
          color: #1A1A1A !important;
          font-family: var(--font-inter) !important;
          padding: 24px !important;
        }
        .wallet-adapter-modal-title {
          font-family: var(--font-outfit) !important;
          font-weight: 800 !important;
          color: #1A1A1A !important;
        }
        .wallet-adapter-modal-list {
          margin-top: 24px !important;
        }
        .wallet-adapter-modal-list .wallet-adapter-button {
          background-color: #F9F9FB !important;
          border-radius: 16px !important;
          color: #1A1A1A !important;
          transition: all 0.3s ease !important;
        }
        .wallet-adapter-modal-list .wallet-adapter-button:hover {
          background-color: #EEEEEE !important;
        }
      `}</style>
    </div>
  );
}
