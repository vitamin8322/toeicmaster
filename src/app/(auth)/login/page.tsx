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
      setError("Email hoặc mật khẩu chưa chính xác! Tài khoản mẫu: learner@toeicmaster.vn / password123");
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
          <h2 className="text-xl font-bold text-slate-800">Chào Mừng Trở Lại!</h2>
          <p className="text-xs text-slate-400">Đăng nhập tài khoản để tiếp tục luyện thi TOEIC.</p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg font-medium border border-destructive/20 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Địa Chỉ Email
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
              <Lock className="w-4 h-4" /> Mật Khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu của bạn"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus-ring"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 focus-ring disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-100">
          <div>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Đăng Ký Miễn Phí
            </Link>
          </div>
          <div>
            Quên mật khẩu? <span className="text-slate-500 hover:underline cursor-pointer">Khôi phục</span>
          </div>
        </div>
      </div>
    </div>
  );
}
