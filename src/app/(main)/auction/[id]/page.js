"use client";
import { useEffect, useState } from "react";
import { getAuction, deleteAuction, bidAuction } from "@/service/auctionService";
import { useRouter } from "next/navigation";


// 경매글 상세/입찰 페이지
// - URL: /auction/:id
export default function AuctionDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [bidPrice, setBidPrice] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAuction(id);
        setAuction(data);
      } catch (e) {
        alert(e.message);
      }
    })();
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
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{auction.title}</h1>
      <p>작성자: {auction.authorNickname}</p>
      <p>현재가: {auction.price.toLocaleString()}원</p>
      <p>상태: {auction.status}</p>
      <p>마감 시각: {new Date(auction.endTime).toLocaleString()}</p>
      <p className="mt-4 whitespace-pre-wrap">{auction.content}</p>

      {auction.status === "ONGOING" && (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            placeholder="입찰 금액"
            className="input w-40"
          />
          <button onClick={handleBid} className="btn-primary">
            입찰하기
          </button>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <a href={`/auction/${id}/edit`} className="btn-secondary">
          수정
        </a>
        <button onClick={handleDelete} className="btn-danger">
          삭제
        </button>
      </div>
    </main>
  );
}
