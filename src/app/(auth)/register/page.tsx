"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Mật khẩu phải chứa ít nhất 8 ký tự!");
      setLoading(false);
      return;
    }

    // Simulate signup redirect to onboarding target scores S-4
    setTimeout(() => {
      router.push("/onboarding");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/60 max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <Link href="/" className="font-display text-3xl font-extrabold text-primary inline-block">
            TOEIC<span className="text-secondary">Master</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Tạo Tài Khoản Mới</h2>
          <p className="text-xs text-slate-400">Đăng ký hoàn toàn miễn phí và bắt đầu học ngay.</p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg font-medium border border-destructive/20 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Họ Và Tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nguyễn Văn Minh"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus-ring"
            />
          </div>

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
              placeholder="Mật khẩu chứa ít nhất 8 ký tự"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus-ring"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 focus-ring disabled:opacity-50"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng Ký Tài Khoản"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Đăng Nhập Ngay
          </Link>
        </div>

      </div>
    </div>
  );
}
