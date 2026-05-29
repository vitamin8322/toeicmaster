"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  Loader,
  AlertCircle
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  part: number;
  difficulty: string;
  subSkillTag: string;
  correctAnswer: string;
}

function AdminQuestionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State variables
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Table filters & paging state
  const [search, setSearch] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  
  // Delete action confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  // Initialize filters from URL search params if present
  useEffect(() => {
    const partUrl = searchParams.get("part") || "";
    setSelectedPart(partUrl);
    fetchQuestions(1, search, partUrl, selectedDifficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchQuestions = async (
    targetPage: number, 
    queryText: string, 
    partVal: string, 
    diffVal: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: targetPage.toString(),
        limit: "10",
        query: queryText,
        part: partVal,
        difficulty: diffVal,
      });

      const response = await fetch(`/api/admin/questions?${queryParams.toString()}`);
      if (!response.ok) {
        if (response.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Lỗi khi tải dữ liệu từ máy chủ.");
      }

      const data = await response.json();
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
      setPage(data.page);
      setTotalQuestions(data.total);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions(1, search, selectedPart, selectedDifficulty);
  };

  const handleFilterChange = (part: string, difficulty: string) => {
    setSelectedPart(part);
    setSelectedDifficulty(difficulty);
    setPage(1);
    fetchQuestions(1, search, part, difficulty);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchQuestions(newPage, search, selectedPart, selectedDifficulty);
  };

  const triggerDelete = (id: string) => {
    setDeletingId(id);
    setDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    setDeleteConfirm(false);
    try {
      const res = await fetch(`/api/admin/questions/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Không thể xóa câu hỏi. Vui lòng thử lại.");
      }

      // Refresh list
      fetchQuestions(page, search, selectedPart, selectedDifficulty);
      setDeletingId(null);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Link href="/admin/dashboard" className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Quay lại Dashboard
          </Link>
        </div>

        {/* Title and Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Quản Lý Ngân Hàng Câu Hỏi</h1>
            <p className="text-slate-400 text-sm mt-1">Danh sách câu hỏi luyện tập và đánh giá năng lực TOEIC.</p>
          </div>
          <Link 
            href="/admin/questions/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold transition-all shadow-lg hover:shadow-indigo-900/40 text-white w-fit"
          >
            <PlusCircle className="h-4 w-4" />
            Thêm Câu Hỏi Mới
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            
            {/* Live Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="h-5 w-5" />
              </span>
              <input 
                type="text" 
                placeholder="Tìm kiếm nội dung câu hỏi..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Filter by TOEIC Part */}
            <select
              value={selectedPart}
              onChange={(e) => handleFilterChange(e.target.value, selectedDifficulty)}
              className="bg-slate-950 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-w-[140px]"
            >
              <option value="">Tất cả Parts</option>
              <option value="1">Part 1 - Photographs</option>
              <option value="2">Part 2 - Question/Response</option>
              <option value="3">Part 3 - Conversations</option>
              <option value="4">Part 4 - Short Talks</option>
              <option value="5">Part 5 - Incomplete Sentences</option>
              <option value="6">Part 6 - Text Completion</option>
              <option value="7">Part 7 - Reading Comprehension</option>
            </select>

            {/* Filter by Difficulty */}
            <select
              value={selectedDifficulty}
              onChange={(e) => handleFilterChange(selectedPart, e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-w-[140px]"
            >
              <option value="">Mọi Độ khó</option>
              <option value="easy">Easy (Dễ)</option>
              <option value="medium">Medium (Trung bình)</option>
              <option value="hard">Hard (Khó)</option>
            </select>

            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Error Boundary */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-400">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold">Đã xảy ra lỗi</h4>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-3">
              <Loader className="h-10 w-10 text-indigo-500 animate-spin" />
              <p className="text-slate-400 text-sm">Đang tải danh sách câu hỏi...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center p-20 space-y-2">
              <p className="text-slate-400 text-lg font-bold">Không tìm thấy câu hỏi nào</p>
              <p className="text-slate-500 text-sm">Vui lòng thay đổi từ khóa hoặc bộ lọc để thử lại.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wider">
                    <th className="py-4 px-6 font-bold">Phần thi</th>
                    <th className="py-4 px-6 font-bold">Nội dung câu hỏi</th>
                    <th className="py-4 px-6 font-bold">Độ khó</th>
                    <th className="py-4 px-6 font-bold">Chủ đề</th>
                    <th className="py-4 px-6 font-bold">Đáp án đúng</th>
                    <th className="py-4 px-6 font-bold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <span className="bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded text-xs">
                          Part {q.part}
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-sm truncate text-white" title={q.text}>
                        {q.text}
                      </td>
                      <td className="py-4 px-6 capitalize">
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          q.difficulty === "easy" ? "bg-emerald-500/15 text-emerald-400" :
                          q.difficulty === "medium" ? "bg-amber-500/15 text-amber-400" :
                          "bg-red-500/15 text-red-400"
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs">
                        {q.subSkillTag}
                      </td>
                      <td className="py-4 px-6 font-bold text-white text-center">
                        <span className="px-2.5 py-0.5 bg-slate-950 border border-slate-800 rounded">
                          {q.correctAnswer}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/questions/edit/${q.id}`}
                            className="p-2 bg-slate-800 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 border border-slate-800 hover:border-indigo-500/30 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Chỉnh sửa"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => triggerDelete(q.id)}
                            className="p-2 bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="bg-slate-950 border-t border-slate-800 py-4 px-6 flex items-center justify-between">
              <span className="text-slate-400 text-xs">
                Hiển thị trang <span className="font-bold text-white">{page}</span> / <span className="font-bold text-white">{totalPages}</span> trang ({totalQuestions} câu hỏi)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-lg shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Xác nhận xóa câu hỏi?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Hành động này là vĩnh viễn và không thể khôi phục. Câu hỏi đã chọn sẽ bị gỡ bỏ hoàn toàn khỏi cơ sở dữ liệu.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 border-t border-slate-800/80 pt-4">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg shadow-red-900/20"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminQuestionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 gap-3">
        <Loader className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold">Đang tải trang quản lý câu hỏi...</p>
      </div>
    }>
      <AdminQuestionsPageContent />
    </Suspense>
  );
}
