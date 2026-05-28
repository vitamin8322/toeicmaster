"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email hoac mat khau chua chinh xac! Tai khoan mau: learner@toeicmaster.vn / password123");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/60 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="font-display text-3xl font-extrabold text-primary inline-block">
            TOEIC<span className="text-secondary">Master</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Chao Mung Tro Lai!</h2>
          <p className="text-xs text-slate-400">Dang nhap tai khoan de tiep tuc luyen thi TOEIC.</p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg font-medium border border-destructive/20 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Dia Chi Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. learner@toeicmaster.vn"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Mat Khau
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mat khau cua ban"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus-ring"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 focus-ring disabled:opacity-50"
          >
            {loading ? "Dang xu ly..." : "Dang Nhap"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-100">
          <div>
            Chua co tai khoan?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Dang Ky Mien Phi
            </Link>
          </div>
          <div>
            Quen mat khau? <span className="text-slate-500 hover:underline cursor-pointer">Khoi phuc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
