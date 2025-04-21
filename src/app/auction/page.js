import AuctionCard from "@/components/auction/AuctionCard";
import { listAuctions } from "@/service/auctionService";

export const dynamic = "force-dynamic";

export default async function AuctionList({ searchParams }) {
  const page = Number(searchParams.page ?? 1);
  const size = 10;

  const { content: auctions, totalPages } = await listAuctions({
    page: page - 1,
    size,
    title: searchParams.title ?? "",
    nickname: searchParams.nickname ?? "",
    ongoingOnly: searchParams.ongoingOnly ?? "false",
  });

  return (
    <div className="flex w-full justify-center min-h-screen bg-white">
      {/* 좌우 여백 */}
      <div className="bg-gray-50 w-1/20" />
      <div className="bg-white flex justify-center items-start p-2 w-18/20">
        <div className="w-[230rem]">
          {/* 헤더 */}
          <div className="flex justify-between items-center">
            <h1 className="text-black p-1 py-4 font-semibold text-base">경매 리스트</h1>
            <a href="/auction/add" className="btn-primary px-4">새 글 등록</a>
          </div>

          {/* 카드 그리드 */}
          <div className="grid grid-cols-5 gap-2">
            {auctions.map(a => <AuctionCard key={a.id} auction={a} />)}
          </div>

          <div className="h-10" />

          {/* 페이지네이션 */}
          <div className="flex cursor-pointer justify-center gap-2 pb-6 text-gray-600">
            {Array.from({ length: totalPages }, (_, i) => {
              const n = i + 1;
              return (
                <a
                  key={n}
                  href={`/auction?page=${n}`}
                  className={`px-3 py-1 rounded ${
                    n === page ? "bg-red-300 text-white" : "hover:bg-red-400"
                  }`}
                >
                  {n}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 w-1/20" />
    </div>
  );
}