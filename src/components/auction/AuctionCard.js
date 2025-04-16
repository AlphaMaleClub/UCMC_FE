"use client";
import Link from "next/link";

// 경매글 미리보기 컴포넌트. 클릭 시 상세 페이지(/auction/[id])로 이동함.
export default function AuctionCard({ auction }) {
  const {
    id,
    title,
    price,
    authorNickname,
    status,
    createdAt,
    endTime,
  } = auction;

  return (
    <Link
      href={`/auction/${id}`}
      className="block border rounded p-4 hover:shadow-md transition"
    >
      <div className="flex justify-between mb-1">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-sm">{status}</span>
      </div>
      <p className="text-sm text-gray-600">
        ₩{price.toLocaleString()} • {authorNickname}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        마감 {new Date(endTime).toLocaleString()}
      </p>
    </Link>
  );
}
