"use client";

import { useEffect, useState, useRef } from "react";
import {
  listAuctionImages,
  updateAuctionImages,
  deleteAuctionImages,
} from "@/service/auctionService";

/*
 * 경매글 이미지 교체/삭제 전용 컴포넌트
 * 스스로 GET /auctions/{id}/images 로 이미지 목록을 로딩해옴. 
 * 교체할 이미지를 선택하면 filesMap 에 (imageId → File) 로 보관했다가
 * “선택 이미지 교체” 버튼 클릭 시 PATCH /auctions/{id}/images 호출.  
 * 개별·전체 삭제 버튼으로 DELETE /auctions/{id}/images 실행.
 */
export default function AuctionImagesManager({ auctionId }) {
  // 서버에서 내려온 이미지 목록
  const [images, setImages] = useState([]);

  // 사용자가 교체용으로 고른 파일 집합
  const [filesMap, setFilesMap] = useState({});

  // 새 이미지 상태 관리
  const [newFiles, setNewFiles]   = useState([]);
  const [newPrev,  setNewPrev]    = useState([]);
  const newInputRef               = useRef(null);

  // 목록 새로고침
  const refresh = async () => {
    try {
      const data = await listAuctionImages(auctionId);
      setImages(data);
      setFilesMap({});
      setNewFiles([]);
      setNewPrev([]);
    } catch (err) {
      alert(err.message);
    }
  };

  // 파일 input 변경
  const handleFileChange = (imageId, file) => {
    setFilesMap((prev) => ({ ...prev, [imageId]: file }));
  };

  // 선택된 파일들을 서버로 전송해 교체
  const handleUpdate = async () => {
    const payload = Object.entries(filesMap)
      .filter(([, file]) => file) // null 제외
      .map(([imageId, file]) => ({ imageId: Number(imageId), file }));

    if (payload.length === 0) {
      alert("교체할 이미지를 선택하세요.");
      return;
    }
    try {
      await updateAuctionImages(auctionId, payload);
      alert("이미지 교체 완료");
      refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // 개별 삭제
  const handleDeleteOne = async (imageId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteAuctionImages(auctionId, [imageId]);
      alert("삭제 완료");
      refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // 전체 삭제
  const handleDeleteAll = async () => {
    if (!confirm("정말 전체 이미지를 삭제하시겠습니까?")) return;
    try {
      await deleteAuctionImages(auctionId, null); // imageIds 없으면 전체 삭제
      alert("전체 삭제 완료");
      refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // 새 파일 선택/드롭
  const takeNewFiles = (arr) => {
    const remain = 5 - images.length;
    const picked = arr.slice(0, remain);
    setNewFiles(picked);
    setNewPrev(picked.map((f) => URL.createObjectURL(f)));
  };
  const onNewChange = (e) => takeNewFiles(Array.from(e.target.files));
  const onDrop = (e) => {
    e.preventDefault();
    takeNewFiles(Array.from(e.dataTransfer.files));
  };

  // 업로드 실행
  const uploadNew = async () => {
    if (!newFiles.length) return alert("추가할 이미지를 선택하세요.");
    const fd = new FormData();
    newFiles.forEach((f) => fd.append("images", f));
    try {
      await fetch(`/api/auctions/${auctionId}/images`, { method: "POST", body: fd });
      alert("추가 업로드 완료");
      refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    refresh();
  }, [auctionId]);

  if (!images.length)
    return (
      <div className="border rounded p-3 text-center text-sm text-gray-500">
        <p>등록된 이미지가 없습니다.</p>
      </div>
    );

  return (
    <div className="bg-white border rounded-xl p-3 space-y-4">
      <h3 className="font-semibold">이미지 수정 / 삭제</h3>

      {/* 이미지 썸네일 + 파일 선택 + 개별 삭제 */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-gray-200 p-2 rounded-xl">
            <img
              src={img.imageUrl}
              alt="auction"
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(img.id, e.target.files?.[0] || null)
              }
            />
            <button
              type="button"
              className="btn-danger mt-2 block w-full"
              onClick={() => handleDeleteOne(img.id)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* 동작 버튼 */}
      <div className="flex gap-2">
        <button onClick={handleUpdate} className="btn-primary flex-1">
          선택 이미지 교체
        </button>
        <button onClick={handleDeleteAll} className="btn-danger flex-1">
          전체 삭제
        </button>
      </div>

      {/* 새 이미지 업로드 영역 */}
      <h4 className="font-semibold mt-6">새 이미지 추가</h4>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => newInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer
                   hover:border-pink-400 transition"
      >
        <p className="text-sm text-gray-600">
          클릭하거나 파일을 드래그하여 첨부 (남은 슬롯 {5 - images.length}개)
        </p>
        <input
          ref={newInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onNewChange}
          className="hidden"
        />
      </div>

      {newPrev.length > 0 && (
        <div className="flex gap-2 mt-3">
          {newPrev.map((src, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded overflow-hidden bg-gray-200"
            >
              <img src={src} alt="new" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      )}

      <button onClick={uploadNew} className="btn-primary w-full">
        추가 업로드
      </button>
    </div>
  );
}