"use client";

import { useState } from "react";

type Props = {
  value: string;
};

export default function CopyPublishUrlButton({ value }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${value}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
    >
      {copied ? "Tersalin" : "Copy link"}
    </button>
  );
}