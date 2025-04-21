"use client";
import Link from "next/link";

export default function AuctionCard({ auction }) {
  const { id, title, price, authorNickname, status, endTime, thumbnailUrl } = auction;

  return (
    <Link
      href={`/auction/${id}`}
      className="flex flex-col items-center w-45 h-50 p-2 gap-1
                 rounded-xl hover:border hover:border-gray-200 text-black"
    >
      {/* 썸네일 */}
      <div className="bg-red-100 w-full h-36 rounded-xl overflow-hidden flex items-center justify-center">
        {thumbnailUrl ? (
          <img
            src={`${thumbnailUrl}?w=300&h=300`}
            alt="thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-sm">이미지 없음</p>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col items-start w-full p-1">
        <div className="flex justify-between text-xs w-full">
          <p className="truncate max-w-[50%]">{title}</p>
          <p className="text-right text-[10px]">
            {new Date(endTime).toLocaleDateString()}
          </p>
        </div>
        <p className="font-bold text-xs mt-1">₩{price.toLocaleString()}</p>
        <p className="text-[10px] text-gray-500">{status}</p>
      </div>
    </Link>
  );
}