import AuctionForm from "@/components/auction/AuctionForm";
import AuctionImagesManager from "@/components/auction/AuctionImagesManager";
import { getAuction } from "@/service/auctionService";

export default async function EditAuctionPage({ params }) {
  const auctionId = Number(params.id);

  // 서버 컴포넌트에서 기본 글 정보만 미리 받아서 Form 초기값으로 사용
  const auction    = await getAuction(auctionId);

  return (
    <div className="flex w-full justify-center min-h-screen bg-white">
      <div className="bg-gray-50 w-1/20" />
      <div className="flex bg-white justify-center items-start w-18/20 p-4">
        <div className="w-[230rem] space-y-6">
          <h1 className="text-black p-1 py-4 font-semibold text-base">경매글 수정</h1>

          {/* 텍스트(제목·내용·가격 등) 수정 */}
          <AuctionForm initial={auction} auctionId={auctionId} />

          {/* 이미지 수정/삭제 — 이미지 목록은 컴포넌트 내부에서 GET /{id}/images 호출 */}
          <AuctionImagesManager auctionId={auctionId} />
        </div>
      </div>
      <div className="bg-gray-50 w-1/20" />
    </div>
  );
}