import AuctionCard from "@/components/auction/AuctionCard";
import { listAuctions } from "@/service/auctionService";

// Next.js의 13+ (App Router)에서 서버 컴포넌트로 작성 가능
export const dynamic = "force-dynamic";

export default async function AuctionList({ searchParams }) {
  // 쿼리 파라미터 추출 (검색/페이지네이션/ongoingOnly 등)
  const page = searchParams.page ?? 0;
  const size = 10;
  const ongoingOnly = searchParams.ongoingOnly ?? "false";

  // 백엔드 호출 → Page<AuctionResponse> 형태 가정
  const result = await listAuctions({
    page,
    size,
    title: searchParams.title ?? "",
    nickname: searchParams.nickname ?? "",
    ongoingOnly,
  });

  const { content: auctions, totalPages } = result;

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">경매 게시판</h1>
      <a href="/auction/add" className="btn-primary inline-block">
        새 경매글 등록
      </a>

      {auctions?.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}

      {/* 페이지네이션 버튼 */}
      <div className="flex gap-2 justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i}
            href={`?page=${i}&ongoingOnly=${ongoingOnly}`}
            className={`px-3 py-1 border rounded ${
              i == page ? "bg-gray-200" : ""
            }`}
          >
            {i + 1}
          </a>
        ))}
      </div>
    </main>
  );
}