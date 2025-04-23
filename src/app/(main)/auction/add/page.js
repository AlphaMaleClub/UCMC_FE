import AuctionForm from "@/components/auction/AuctionForm";

// 경매글 등록 페이지
export default function AddAuctionPage() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">경매글 등록</h1>
      <AuctionForm />
    </main>
  );
}
