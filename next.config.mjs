/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1) 개발·운영 모두 적용할 프록시
  async rewrites() {
    return [
      {
        // 프론트에서 호출하는 경로
        source: "/api/:path*",          // 예) /api/auctions?page=0
        // 실제 백엔드(Spring) 주소
        destination: "http://localhost:8080/api/:path*",
        //  추후 경로에 맞게 수정 필요
      },
    ];
  }

};

export default nextConfig;