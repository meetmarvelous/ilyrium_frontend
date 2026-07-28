"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Key, Copy, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key_value: string;
  status: string;
  created_at: string;
}

export default function APIKeysPage() {
  const { publicKey } = useWallet();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const walletAddress = publicKey?.toBase58() || "";

  const fetchKeys = useCallback(async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/keys", {
        headers: { "x-wallet-address": walletAddress },
      });
      const data = await res.json();
      if (data.keys) {
        setKeys(data.keys);
      }
    } catch {
      // Supabase not connected — show empty state
      setKeys([]);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async () => {
    if (!walletAddress) return;
    setCreating(true);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": walletAddress,
        },
        body: JSON.stringify({ name: newKeyName || "Untitled Key" }),
      });
      const data = await res.json();
      if (data.key) {
        setKeys((prev) => [data.key, ...prev]);
        setShowCreateModal(false);
        setNewKeyName("");
      }
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!walletAddress) return;

    try {
      await fetch(`/api/keys/${id}`, {
        method: "DELETE",
        headers: { "x-wallet-address": walletAddress },
      });
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: "revoked" } : k))
      );
    } catch {
      // handle error
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Key size={48} className="text-primary/50 mb-4" />
        <h3 className="text-xl font-heading font-semibold text-text-main mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-text-muted max-w-sm">
          Connect a Solana wallet using the button in the top-right corner to view and manage your API keys.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-heading font-bold text-text-main">API Keys</h3>
          <p className="text-text-muted mt-1">
            Manage your API keys for authenticating RPC requests.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <Plus size={18} />
          Create Secret Key
        </button>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md">
            <h4 className="text-xl font-heading font-bold text-text-main mb-4">
              Create New API Key
            </h4>
            <input
              type="text"
              placeholder="Key name (e.g. Production MVP)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main placeholder-text-muted focus:border-primary focus:outline-none transition-colors mb-6"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-text-muted hover:text-text-main hover:bg-surfaceHover transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {creating && <Loader2 size={16} className="animate-spin" />}
                Generate Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : keys.length === 0 ? (
        <div className="p-12 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center text-center">
          <Key size={48} className="text-primary/30 mb-4" />
          <h4 className="text-lg font-heading font-semibold text-text-main mb-2">
            No API Keys Yet
          </h4>
          <p className="text-text-muted max-w-sm">
            Create your first API key to start sending RPC requests through Ilyrium.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surfaceHover/50 border-b border-border text-text-muted text-sm font-medium">
              <tr>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">SECRET KEY</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">CREATED</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surfaceHover/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-text-main">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <code className="bg-background px-3 py-1.5 rounded-lg text-text-muted font-mono text-sm border border-border">
                        {item.key_value.substring(0, 16)}...
                      </code>
                      <button
                        onClick={() => handleCopy(item.key_value)}
                        className="text-text-muted hover:text-primary transition-colors"
                      >
                        {copiedKey === item.key_value ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-400"
                          />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "active"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "active"
                            ? "bg-emerald-400 animate-pulse"
                            : "bg-red-400"
                        }`}
                      ></span>
                      {item.status === "active" ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted text-sm">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === "active" && (
                      <button
                        onClick={() => handleRevoke(item.id)}
                        className="text-text-muted hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Revoke key"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
