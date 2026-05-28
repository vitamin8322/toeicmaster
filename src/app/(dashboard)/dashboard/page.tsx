import React from "react";
import AppShell from "@/components/app-shell";
import { BookOpen, Headphones, Calendar, Flame, ChevronRight, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        
        {/* 1. Welcoming Hero Banner */}
        <div className="bg-gradient-to-r from-primary to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold">Chào Minh Đẹp Trai! 👋</h2>
            <p className="text-sm text-indigo-150 max-w-md">
              Hôm nay là một ngày tuyệt vời để bứt phá thêm 20 câu hỏi luyện nghe. Mục tiêu 650+ của bạn đang ở rất gần!
            </p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/20 flex items-center gap-4">
            <Flame className="w-10 h-10 text-amber-400 fill-amber-400 animate-bounce" />
            <div>
              <div className="text-xl font-black">5 Ngày liên tiếp</div>
              <div className="text-xs text-indigo-200">Đã hoàn thành 5/5 học phần hôm nay</div>
            </div>
          </div>
        </div>

        {/* 2. Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">TỔNG THỜI GIAN HỌC</span>
              <span className="text-2xl font-black text-slate-800">12 giờ 45 phút</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">CÂU HỎI ĐÃ GIẢI</span>
              <span className="text-2xl font-black text-slate-800">452 / 1000 câu</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">ĐIỂM DỰ ĐOÁN (MOCK)</span>
              <span className="text-2xl font-black text-slate-800">580 điểm</span>
            </div>
          </div>
        </div>

        {/* 3. Suggested Tasks & Weak Skill Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Daily Tasks */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-slate-200/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg">Nhiệm Vụ Hôm Nay</h3>
              <span className="text-xs text-primary font-bold">Làm mới lúc 00:00</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center text-xs font-black text-primary bg-primary-foreground">1</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Ôn tập 10 từ vựng Leitner</h4>
                    <p className="text-xs text-slate-400">Box 1 & Box 2 đã đến hạn ôn tập trong ngày.</p>
                  </div>
                </div>
                <Link href="/vocab" className="text-primary hover:translate-x-0.5 transition-transform">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center text-xs font-black text-primary bg-primary-foreground">2</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Luyện Nghe Part 3 (Conversations)</h4>
                    <p className="text-xs text-slate-400">Hoàn thành 2 đoạn hội thoại với tốc độ 0.85x.</p>
                  </div>
                </div>
                <Link href="/practice/listening" className="text-primary hover:translate-x-0.5 transition-transform">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Weak Skills */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/40 space-y-4">
            <h3 className="font-display font-extrabold text-lg">Cảnh Báo Kỹ Năng Yếu</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/15 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Part 7 - Triple Passages</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Tốc độ làm bài chậm, tỷ lệ chính xác hiện tại: 42%.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/15 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Part 5 - Passive Voice</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Hay nhầm lẫn cấu trúc bị động rút gọn, tỷ lệ chính xác: 48%.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
