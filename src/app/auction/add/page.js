import AuctionForm from "@/components/auction/AuctionForm";

// 경매글 등록 페이지
export default function AddAuctionPage() {
  return (
    <div className="flex w-full justify-center min-h-screen bg-white">
      <div className="bg-gray-50 w-1/20" />
      <div className="flex bg-white justify-center items-start w-18/20 p-4">
        <div className="w-[230rem]">
          <h1 className="text-black p-1 py-4 font-semibold text-base">경매글 등록</h1>
          <AuctionForm />
        </div>
      </div>
      <div className="bg-gray-50 w-1/20" />
    </div>
  );
}