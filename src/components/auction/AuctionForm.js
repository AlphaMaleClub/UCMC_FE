"use client";
import { useState } from "react";
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
  // 폼 상태
  const [form, setForm] = useState(
    initial || {
      title: "",
      content: "",
      price: 0,
      endTime: "",
      description: "",
    }
  );
  // 등록 시에만 이미지 업로드 필수, 수정 시엔 기본 로직에서 이미지 추가는 없음
  const [files, setFiles] = useState([]);

  // input/textarea 값 갱신
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (auctionId) {
        // 수정
        await updateAuction(auctionId, form);
        alert("수정이 완료되었습니다.");
      } else {
        // 등록
        await createAuction(form, files);
        alert("경매글이 등록되었습니다.");
      }
      router.push("/auction");
    } catch (error) {
      alert(error.message || "에러가 발생했습니다.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        className="textarea"
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
        className="textarea"
      />

      {/* 등록 모드일 때만 이미지 업로드를 필수로 받음 */}
      {!auctionId && (
        <div>
          <label className="block font-medium mb-1">이미지 업로드 (1~5개)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            required
          />
        </div>
      )}

      <button type="submit" className="btn-primary w-full">
        {auctionId ? "수정하기" : "등록하기"}
      </button>
    </form>
  );
}
