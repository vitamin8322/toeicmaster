import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { 
  Database, 
  PlusCircle, 
  Settings, 
  FileText, 
  HelpCircle,
  TrendingUp,
  FolderOpen
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch real-time statistics
  const totalQuestions = await prisma.question.count();
  const totalGroups = await prisma.questionGroup.count();
  const totalUsers = await prisma.user.count({ where: { role: "LEARNER" } });

  // Get question counts by Part (1-7)
  const partStats = await prisma.question.groupBy({
    by: ["part"],
    _count: {
      id: true,
    },
  });

  const countsByPart = Array.from({ length: 7 }, (_, i) => {
    const partNum = i + 1;
    const stat = partStats.find((s) => s.part === partNum);
    return {
      part: partNum,
      count: stat?._count.id || 0,
      title: `Part ${partNum}`,
      description: getPartDescription(partNum),
    };
  });

  function getPartDescription(part: number) {
    switch (part) {
      case 1: return "Photographs (Mô tả tranh)";
      case 2: return "Question - Response (Hỏi - Đáp)";
      case 3: return "Conversations (Hội thoại ngắn)";
      case 4: return "Short Talks (Bài nói ngắn)";
      case 5: return "Incomplete Sentences (Điền từ vào câu)";
      case 6: return "Text Completion (Điền từ vào đoạn văn)";
      case 7: return "Reading Comprehension (Đọc hiểu văn bản)";
      default: return "";
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-white flex items-center gap-3">
              <Database className="h-8 w-8 text-indigo-500" />
              Bảng Quản Trị Hệ Thống
            </h1>
            <p className="text-slate-400 mt-2">
              Chào mừng, <span className="font-semibold text-indigo-400">{session.user.name}</span>. Quản lý kho câu hỏi và cấu hình học tập TOEIC.
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/admin/questions"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold transition-all shadow-lg hover:shadow-indigo-900/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <Settings className="h-4 w-4" />
              Quản lý câu hỏi
            </Link>
            <Link
              href="/admin/questions/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold transition-all shadow-lg hover:shadow-emerald-900/40 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <PlusCircle className="h-4 w-4" />
              Thêm câu hỏi
            </Link>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Tổng Số Câu Hỏi</p>
              <p className="text-4xl font-extrabold text-white mt-1">{totalQuestions}</p>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <HelpCircle className="h-8 w-8" />
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Nhóm Câu Hỏi (Groups)</p>
              <p className="text-4xl font-extrabold text-white mt-1">{totalGroups}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <FolderOpen className="h-8 w-8" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Học Viên Đang Ôn Tập</p>
              <p className="text-4xl font-extrabold text-white mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            Lối Tắt Thao Tác Nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/admin/questions" 
              className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-lg p-5 transition-all text-left flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div>
                <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">Ngân hàng câu hỏi</p>
                <p className="text-slate-400 text-sm mt-1">Tìm kiếm, lọc, sửa hoặc xóa các câu hỏi hiện tại.</p>
              </div>
              <span className="text-xs text-indigo-400 font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Truy cập ngay &rarr;
              </span>
            </Link>

            <Link 
              href="/admin/questions/create" 
              className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-lg p-5 transition-all text-left flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div>
                <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">Tạo câu hỏi thủ công</p>
                <p className="text-slate-400 text-sm mt-1">Soạn câu hỏi mới với đầy đủ tùy chọn nghe, đọc, dịch và lời giải thích.</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Soạn câu hỏi &rarr;
              </span>
            </Link>

            <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-5 text-left flex flex-col justify-between opacity-70 cursor-not-allowed">
              <div>
                <p className="font-bold text-slate-400">Nhập liệu từ Excel/ZIP</p>
                <p className="text-slate-500 text-sm mt-1">Nhập hàng loạt câu hỏi và ZIP media. Sắp ra mắt ở các story tiếp theo.</p>
              </div>
              <span className="text-xs text-slate-500 font-semibold mt-4">
                Chưa mở khóa
              </span>
            </div>
          </div>
        </div>

        {/* TOEIC Part Breakdown Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-400" />
            Thống Kê Câu Hỏi Theo TOEIC Part
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countsByPart.map((stat) => (
              <div 
                key={stat.part} 
                className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded">
                      Phần {stat.part}
                    </span>
                    <h3 className="font-bold text-lg text-white mt-2">{stat.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 min-h-[32px]">{stat.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-white">{stat.count}</p>
                    <p className="text-slate-500 text-xs mt-1">câu hỏi</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <Link 
                    href={`/admin/questions?part=${stat.part}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1"
                  >
                    Xem chi tiết &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
