"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader, AlertCircle } from "lucide-react";

interface QuestionGroup {
  id: string;
  passageText?: string;
  audioUrl?: string;
  part: number;
}

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  // Form fields state
  const [text, setText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [explanationVi, setExplanationVi] = useState("");
  const [part, setPart] = useState(5);
  const [subSkillTag, setSubSkillTag] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [audioUrl, setAudioUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [questionGroupId, setQuestionGroupId] = useState("");

  // UI state
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});

  // Fetch target question attributes on mount
  useEffect(() => {
    if (id) {
      fetchQuestionDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Dynamic group lookups on part change
  useEffect(() => {
    fetchGroups(part);
  }, [part]);

  const fetchQuestionDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/questions/${id}`);
      if (!res.ok) {
        if (res.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Không thể tải thông tin câu hỏi.");
      }

      const data = await res.json();
      const q = data.question;
      
      setText(q.text || "");
      setOptionA(q.optionA || "");
      setOptionB(q.optionB || "");
      setOptionC(q.optionC || "");
      setOptionD(q.optionD || "");
      setCorrectAnswer(q.correctAnswer || "A");
      setExplanationVi(q.explanationVi || "");
      setPart(q.part || 5);
      setSubSkillTag(q.subSkillTag || "");
      setDifficulty(q.difficulty || "easy");
      setAudioUrl(q.audioUrl || "");
      setImageUrl(q.imageUrl || "");
      setQuestionGroupId(q.questionGroupId || "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async (partNum: number) => {
    try {
      const res = await fetch(`/api/admin/groups?part=${partNum}`);
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách nhóm:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setValidationErrors({});

    const payload = {
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanationVi,
      part,
      subSkillTag,
      difficulty,
      audioUrl: audioUrl || null,
      imageUrl: imageUrl || null,
      questionGroupId: questionGroupId || null,
    };

    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.details) {
          setValidationErrors(data.details);
          throw new Error("Dữ liệu chỉnh sửa chưa hợp lệ. Vui lòng kiểm tra các viền đỏ.");
        }
        throw new Error(data.error || "Không thể cập nhật câu hỏi.");
      }

      router.push("/admin/questions");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 gap-3">
        <Loader className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Đang tải thông tin câu hỏi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Link */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Link href="/admin/questions" className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách câu hỏi
          </Link>
        </div>

        {/* Header Title */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Chỉnh Sửa Câu Hỏi</h1>
          <p className="text-slate-400 text-sm mt-1">Cập nhật nội dung và thuộc tính câu hỏi TOEIC.</p>
        </div>

        {/* Global Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-400">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TOEIC Part selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">TOEIC Part *</label>
              <select
                value={part}
                onChange={(e) => {
                  setPart(parseInt(e.target.value, 10));
                  setQuestionGroupId(""); // Reset group on part shift
                }}
                className={`w-full bg-slate-950 border text-slate-100 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  validationErrors.part ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                }`}
              >
                <option value="1">Part 1 - Photographs</option>
                <option value="2">Part 2 - Question/Response</option>
                <option value="3">Part 3 - Conversations</option>
                <option value="4">Part 4 - Short Talks</option>
                <option value="5">Part 5 - Incomplete Sentences</option>
                <option value="6">Part 6 - Text Completion</option>
                <option value="7">Part 7 - Reading Comprehension</option>
              </select>
              {validationErrors.part && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.part._errors[0]}</p>
              )}
            </div>

            {/* Difficulty selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Độ khó *</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={`w-full bg-slate-950 border text-slate-100 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  validationErrors.difficulty ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                }`}
              >
                <option value="easy">Easy (Dễ)</option>
                <option value="medium">Medium (Trung bình)</option>
                <option value="hard">Hard (Khó)</option>
              </select>
              {validationErrors.difficulty && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.difficulty._errors[0]}</p>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">Nội dung câu hỏi / Câu gợi ý *</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full bg-slate-950 border text-slate-100 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                validationErrors.text ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
              }`}
            />
            {validationErrors.text && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.text._errors[0]}</p>
            )}
          </div>

          {/* Answer Options Grid */}
          <div className="space-y-4 border-t border-slate-800/80 pt-4">
            <h3 className="font-semibold text-white text-sm">Các lựa chọn đáp án</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Lựa chọn A *</label>
                <input
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className={`w-full bg-slate-950 border text-slate-100 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                    validationErrors.optionA ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                  }`}
                />
                {validationErrors.optionA && (
                  <p className="text-red-500 text-xs mt-0.5">{validationErrors.optionA._errors[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Lựa chọn B *</label>
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className={`w-full bg-slate-950 border text-slate-100 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                    validationErrors.optionB ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                  }`}
                />
                {validationErrors.optionB && (
                  <p className="text-red-500 text-xs mt-0.5">{validationErrors.optionB._errors[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Lựa chọn C *</label>
                <input
                  type="text"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className={`w-full bg-slate-950 border text-slate-100 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                    validationErrors.optionC ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                  }`}
                />
                {validationErrors.optionC && (
                  <p className="text-red-500 text-xs mt-0.5">{validationErrors.optionC._errors[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Lựa chọn D *</label>
                <input
                  type="text"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className={`w-full bg-slate-950 border text-slate-100 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                    validationErrors.optionD ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                  }`}
                />
                {validationErrors.optionD && (
                  <p className="text-red-500 text-xs mt-0.5">{validationErrors.optionD._errors[0]}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800/80 pt-4">
            {/* Correct Answer */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Đáp án đúng *</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className={`w-full bg-slate-950 border text-slate-100 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  validationErrors.correctAnswer ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                }`}
              >
                <option value="A">Đáp án A</option>
                <option value="B">Đáp án B</option>
                <option value="C">Đáp án C</option>
                <option value="D">Đáp án D</option>
              </select>
              {validationErrors.correctAnswer && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.correctAnswer._errors[0]}</p>
              )}
            </div>

            {/* Sub skill tagging */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Chủ đề / Ngữ pháp (subskill-tag) *</label>
              <input
                type="text"
                value={subSkillTag}
                onChange={(e) => setSubSkillTag(e.target.value)}
                className={`w-full bg-slate-950 border text-slate-100 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  validationErrors.subSkillTag ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
                }`}
              />
              {validationErrors.subSkillTag && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.subSkillTag._errors[0]}</p>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <label className="block text-sm font-semibold text-slate-300">Lời giải chi tiết bằng Tiếng Việt *</label>
            <textarea
              rows={4}
              value={explanationVi}
              onChange={(e) => setExplanationVi(e.target.value)}
              className={`w-full bg-slate-950 border text-slate-100 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                validationErrors.explanationVi ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-850"
              }`}
            />
            {validationErrors.explanationVi && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.explanationVi._errors[0]}</p>
            )}
          </div>

          {/* Media Links */}
          <div className="space-y-4 border-t border-slate-800/80 pt-4">
            <h3 className="font-semibold text-white text-sm">Media & Links (Tùy chọn)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Đường dẫn file âm thanh (Audio URL)</label>
                <input
                  type="text"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-100 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Đường dẫn hình ảnh (Image URL)</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-100 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Relational QuestionGroup Link */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <label className="block text-sm font-semibold text-slate-300">Nhóm liên kết (Question Group)</label>
            <select
              value={questionGroupId}
              onChange={(e) => setQuestionGroupId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 text-slate-100 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">-- Không liên kết với Group --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  [{g.id.substring(0, 8)}...] {g.passageText ? g.passageText.replace(/<[^>]*>/g, "").substring(0, 60) + "..." : g.audioUrl ? "Audio: " + g.audioUrl : "Group"}
                </option>
              ))}
            </select>
            <p className="text-slate-400 text-xs">
              Mẹo: Các groups được tự động tải tương ứng với Part {part} đã chọn để tránh sai sót.
            </p>
          </div>

          {/* Submit Action buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-800/80 pt-6">
            <Link
              href="/admin/questions"
              className="px-5 py-2.5 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-indigo-900/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {submitting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Lưu Thay Đổi
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
