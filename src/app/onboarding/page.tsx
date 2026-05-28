"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Compass, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If the user has already completed onboarding, redirect to dashboard
    if (status === "authenticated" && session?.user && (session.user as any).onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const milestones = [
    { score: 450, title: "Cơ Bản (Graduation)", desc: "Mục tiêu tối thiểu ra trường cho sinh viên đại học không chuyên." },
    { score: 550, title: "Khá (Graduation Pro)", desc: "Chuẩn đầu ra của các trường đại học khối kinh tế/kỹ thuật hàng đầu." },
    { score: 650, title: "Tiêu Chuẩn (Việc Làm Tốt)", desc: "Đáp ứng yêu cầu ứng tuyển của các doanh nghiệp trong nước và liên doanh." },
    { score: 750, title: "Quản Lý (Promotion)", desc: "Điều kiện cần để thăng chức và làm việc trực tiếp với đối tác nước ngoài." },
    { score: 850, title: "Đột Phá (Global Firm)", desc: "Chinh phục điểm số cao để làm việc tại các tập đoàn đa quốc gia và global." },
  ];

  const handleOnboarding = async () => {
    if (!selectedScore) return;
    setLoading(true);
    setError("");

    try {
      // 1. Call API to persist data to PostgreSQL
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetScore: selectedScore }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra trong quá trình lưu dữ liệu.");
      }

      // 2. Dynamically update local NextAuth session cache
      await update({
        targetScore: selectedScore,
        onboardingCompleted: true,
      });

      // 3. Route to dashboard and force a refresh to sync shell context
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Compass className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">Đang tải cấu hình học tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/60 max-w-2xl w-full space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-800">
            Đặt Mục Tiêu Điểm Số
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Lựa chọn điểm số TOEIC bạn đang hướng tới để chúng tôi đề xuất lộ trình và phân tích điểm yếu phù hợp nhất.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl font-medium border border-destructive/20 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((m) => (
            <div
              key={m.score}
              onClick={() => setSelectedScore(m.score)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
                selectedScore === m.score
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-xl">Target {m.score}+</span>
                {selectedScore === m.score && (
                  <CheckCircle2 className="w-5 h-5 text-primary fill-primary-foreground" />
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-bold text-slate-700">{m.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleOnboarding}
          disabled={!selectedScore || loading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 focus-ring disabled:opacity-50"
        >
          {loading ? "Đang lưu cấu hình..." : "Xác Nhận & Bắt Đầu Học"} <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
