"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, CheckCircle2, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const milestones = [
    { score: 450, title: "Cơ Bản (Graduation)", desc: "Mục tiêu tối thiểu ra trường cho sinh viên đại học không chuyên." },
    { score: 550, title: "Khá (Graduation Pro)", desc: "Chuẩn đầu ra của các trường đại học khối kinh tế/kỹ thuật hàng đầu." },
    { score: 650, title: "Tiêu Chuẩn (Việc Làm Tốt)", desc: "Đáp ứng yêu cầu ứng tuyển của các doanh nghiệp trong nước và liên doanh." },
    { score: 750, title: "Quản Lý (Promotion)", desc: "Điều kiện cần để thăng chức và làm việc trực tiếp với đối tác nước ngoài." },
    { score: 850, title: "Đột Phá (Global Firm)", desc: "Chinh phục điểm số cao để làm việc tại các tập đoàn đa quốc gia và global." },
  ];

  const handleOnboarding = () => {
    if (!selectedScore) return;
    setLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

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
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{m.title}</h4>
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
