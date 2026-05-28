import React from "react";
import Link from "next/link";
import { BookOpen, Headphones, Compass, Landmark, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* 1. Header Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-slate-200/60">
        <span className="font-display text-2xl font-bold text-primary">
          TOEIC<span className="text-secondary">Master</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">
            Đăng Nhập
          </Link>
          <Link href="/register" className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
            Đăng Ký Miễn Phí
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 flex-1 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full inline-block">
            NỀN TẢNG THI THỬ TOEIC DÀNH CHO NGƯỜI VIỆT
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Đột Phá Điểm Số <br className="hidden md:inline" />
            <span className="text-primary">TOEIC Bằng Trí Tuệ</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto md:mx-0">
            Học từ vựng lặp lại ngắt quãng (Leitner), tinh chỉnh tốc độ nghe dictation thông minh, 
            và nhận giải thích ngữ pháp chi tiết bằng tiếng Việt cho từng câu hỏi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/register" className="bg-primary text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:opacity-90 transition-all focus-ring">
              Bắt Đầu Ngay <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="bg-white border border-slate-200 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-all focus-ring">
              Xem Lộ Trình Học
            </Link>
          </div>
        </div>

        {/* 3. Core Feature Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/50 flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg mb-1">Từ Vựng Spaced-Repetition</h3>
              <p className="text-xs text-slate-400">Ghi nhớ từ vựng TOEIC cốt lõi bằng phương pháp lặp lại Leitner 5 hộp khoa học.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/50 flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg mb-1">Luyện Nghe Incremental-Speed</h3>
              <p className="text-xs text-slate-400">Chỉnh tốc độ audio từ 0.75x đến 1.5x, lặp từng câu để ghi chép chính tả hiệu quả.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/50 flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg mb-1">Giải Thích Tiếng Việt</h3>
              <p className="text-xs text-slate-400">Tất cả đáp án đều đi kèm giải thích ngữ pháp chi tiết bằng tiếng Việt thay vì tiếng Anh generic.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/50 flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg mb-1">Đề Thi Mock Test Chuẩn</h3>
              <p className="text-xs text-slate-400">Thi thử 2 tiếng hoàn chỉnh không xao nhãng với chuyển đổi điểm TOEIC chuẩn thực tế.</p>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="font-display text-lg font-bold text-white">
            TOEIC<span className="text-secondary">Master</span>
          </span>
          <p className="text-xs">© 2026 TOEICMaster Vietnam. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
}
