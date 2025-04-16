const API_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";
// process.env.NEXT_PUBLIC_API_BASE; 
// .env 파일 구성해뒀고, 배포단계에서 적용 NEXT_PUBLIC_API_BASE="http://localhost:8080/api"
// 현재 개발단계에서는 next 에서 제공하는 프록시 사용하도록 next.config.

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("/")
    ? `${API_ORIGIN}${endpoint}`
    : endpoint;

  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });
  // 에러 처리
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch (e) {
      err = { message: "알 수 없는 오류" };
    }
    throw new Error(err.message || "요청 실패");
  }
  // No Content인 경우 바디 없음
  return res.status === 204 ? null : res.json();
}

// 경매글 등록
export async function createAuction(dto, imageFiles) {
  const fd = new FormData();
  fd.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  imageFiles.forEach((f) => fd.append("images", f));
  return request("/api/auctions", { method: "POST", body: fd });
}

// 경매글 목록 조회 (+검색/필터/페이지)
export async function listAuctions(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/api/auctions?${query}`, {
    method: "GET",
  });
}

// 경매글 이미지 조회
export async function listAuctionImages(auctionId) {
  return request(`/api/auctions/${auctionId}/images`);
}

//경매글 상세 조회
export async function getAuction(auctionId) {
  return request(`/api/auctions/${auctionId}`, {
    method: "GET",
  });
}

// 경매글 수정 (제목, 내용 등 텍스트)
export async function updateAuction(auctionId, dto) {
  return request(`/api/auctions/${auctionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

//경매글 삭제
export async function deleteAuction(auctionId) {
  return request(`/api/auctions/${auctionId}`, {
    method: "DELETE",
  });
}

// 경매 입찰
export async function bidAuction(auctionId, bidPrice) {
  const url = `/api/auctions/${auctionId}/bid?bidPrice=${bidPrice}`;
  return request(url, { method: "POST" });
}

// 경매글 이미지 수정
export async function updateAuctionImages(auctionId, images) {
  // Spring 쪽은 key=이미지ID, value=파일 로 받도록 되어 있음
  const fd = new FormData();
  images.forEach(({ imageId, file }) => {
    // 필드 이름이 숫자로 들어가도록
    fd.append(String(imageId), file);
  });
  return request(`/api/auctions/${auctionId}/images`, {
    method: "PATCH",
    body: fd,
  });
}

// 경매글 이미지 삭제
export async function deleteAuctionImages(auctionId, imageIds) {
  // 없다면 전체삭제, 있다면 해당 이미지들만 삭제
  let url = `/api/auctions/${auctionId}/images`;
  if (imageIds?.length) {
    const qs = imageIds.map((id) => `imageIds=${id}`).join("&");
    url += `?${qs}`;
  }
  return request(url, { method: "DELETE" });
}