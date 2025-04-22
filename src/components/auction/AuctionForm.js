"use client";
import { useState, useRef } from "react";
import { createAuction, updateAuction } from "@/service/auctionService";
import { useRouter } from "next/navigation";

/*
 * 경매글 등록/수정용 공통 폼
 * @param {object} props
 * @param {object} [props.initial] - 수정 시 초기 값 (id, title, content, price...)
 * @param {number} [props.auctionId] - 수정 모드일 때 경매글 ID
 */
export default function AuctionForm({ initial, auctionId }) {
  const router = useRouter();

  // 텍스트 필드 상태
  const [form, setForm] = useState(
    initial ?? {
      title: "",
      content: "",
      price: 0,
      endTime: "",
      description: "",
    }
  );

  // 이미지 파일 & 미리보기
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = (arr) => {
    const picked = arr.slice(0, 5);
    setFiles(picked);
    setPreviews(picked.map((f) => URL.createObjectURL(f)));
  };

  const onFileChange = (e) => handleFiles(Array.from(e.target.files));
  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  // 공통 핸들러
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (auctionId) {
        await updateAuction(auctionId, form);
        alert("수정이 완료되었습니다.");
      } else {
        await createAuction(form, files);
        alert("경매글이 등록되었습니다.");
      }
      router.push("/auction");
    } catch (error) {
      alert(error.message || "에러가 발생했습니다.");
    }
  }

  // UI
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="제목"
        className="input"
        required
      />

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="내용"
        className="textarea h-40"
        required
      />

      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="시작가"
        className="input"
        required
      />

      <input
        type="datetime-local"
        name="endTime"
        value={form.endTime}
        onChange={handleChange}
        className="input"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="상품 상세 설명..."
        className="textarea h-32"
      />

      {/* 등록 모드에서만 이미지 업로드 */}
      {!auctionId && (
        <div className="space-y-2">
          <label className="block font-medium">이미지 업로드 (1 ~ 5장)</label>

          {/* 드래그 & 드롭 영역 */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer
                       hover:border-pink-400 transition"
          >
            <p className="text-sm text-gray-600">
              클릭하거나 파일을 드래그하여 첨부
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onFileChange}
              className="hidden"
              required
            />
          </div>

          {/* 미리보기 썸네일 */}
          {previews.length > 0 && (
            <div className="flex gap-2">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded overflow-hidden bg-gray-200"
                >
                  <img src={src} alt="preview" className="object-cover w-full h-full" />
                </div>
              ))}
              {Array.from({ length: 5 - previews.length }).map((_, i) => (
                <div
                  key={`blank-${i}`}
                  className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400"
                >
                  + 사진
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button type="submit" className="btn-primary w-full">
        {auctionId ? "수정하기" : "등록하기"}
      </button>
    </form>
  );
}