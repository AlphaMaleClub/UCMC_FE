"use client";
import { useEffect, useState } from "react";
import { getAuction, deleteAuction, bidAuction } from "@/service/auctionService";
import { useRouter } from "next/navigation";

export default function AuctionDetail({ params }) {
  const id       = Number(params.id);
  const router   = useRouter();
  const [auction, setAuction] = useState(null);
  const [bidPrice, setBidPrice] = useState("");

  useEffect(() => {
    getAuction(id).then(setAuction).catch(e => alert(e.message));
  }, [id]);

  if (!auction) return <p>로딩 중...</p>;

  async function handleBid() {
    if (!bidPrice || Number(bidPrice) <= auction.price) {
      alert("현재가보다 높은 금액을 입력해주세요.");
      return;
    }
    try {
      await bidAuction(id, bidPrice);
      alert("입찰 완료");
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteAuction(id);
      alert("삭제 되었습니다.");
      router.push("/auction");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="flex w-full justify-center min-h-screen bg-white">
      <div className="bg-gray-50 w-1/20" />
      <div className="bg-white w-18/20 flex flex-col items-center p-4">
        <div className="w-[230rem] flex flex-col gap-4 text-black">

          <h1 className="text-lg font-semibold">{auction.title}</h1>
          <p>작성자: {auction.authorNickname}</p>
          <p>현재가: <span className="font-bold">{auction.price.toLocaleString()}원</span></p>
          <p>상태: {auction.status}</p>
          <p>마감: {new Date(auction.endTime).toLocaleString()}</p>
          <p className="whitespace-pre-wrap bg-red-100 rounded-xs p-3">{auction.content}</p>

          {auction.status === "ONGOING" && (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={bidPrice}
                onChange={e => setBidPrice(e.target.value)}
                placeholder="입찰 금액"
                className="input w-40"
              />
              <button onClick={handleBid} className="btn-primary px-4">입찰하기</button>
            </div>
          )}

          <div className="flex gap-2">
            <a href={`/auction/${id}/edit`} className="btn-secondary px-4">수정</a>
            <button onClick={handleDelete} className="btn-danger px-4">삭제</button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 w-1/20" />
    </div>
  );
}