"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation"; // ✅ 쿼리스트링을 위한 훅 추가
import Link from "next/link";
import { getAllPost } from "@/service/tradeBoardService";

export default function TradeBoardPage() {
    const params = useParams();
    const currentPage = parseInt(params.page, 10);

    const searchParams = useSearchParams(); // ✅ URL 쿼리 파라미터 접근
    const router = useRouter(); // ✅ 페이지 이동을 위한 라우터

    const sortParam = searchParams.get("sort") || "updatedAt,desc"; // ✅ URL에서 sort 값 가져오기 (기본값: 최신순)
    const [sortOption, setSortOption] = useState(sortParam); // ✅ 정렬 기준을 상태로 관리

    // ✅ URL에 따라 초기 selected 상태를 정함 (버튼 UI 용)
    const getInitialSelected = () => {
        if (sortParam === "price,asc") return "낮은가격순";
        if (sortParam === "price,desc") return "높은가격순";
        return "최신순";
    };
    const [selected, setSelected] = useState(getInitialSelected()); // UI 상태 관리

    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const pageForBackend = Math.max(currentPage - 1, 0);

    const groupSize = 10;
    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    // 정렬 버튼 클릭 시 처리
    const handleSortChange = (label) => {
        setSelected(label);

        let sortVal = "updatedAt,desc";
        if (label === "낮은가격순") sortVal = "price,asc";
        if (label === "높은가격순") sortVal = "price,desc";

        setSortOption(sortVal); // 정렬 기준 상태 업데이트
        router.push(`/tradeboard/1?sort=${sortVal}`);// ✅ URL에 쿼리 반영
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getAllPost(pageForBackend, sortOption); // 정렬 옵션 전달
                const posts = result.tradePosts.content;
                const images = result.images;

                console.log(posts);
                console.log(result.images);

                // null 값 필터링 후 이미지 맵 생성
                const imageMap = new Map(
                    images
                        .filter((img) => img !== null)
                        .map((img) => [img.postId, img.imageUrl])
                );

                console.log(imageMap);
                // 게시글 + 이미지 병합

                //posts.map을 하면 기존 posts를 순회하면서 새로운 배열을 만들수 있다
                //각 순회한 요소는 post 이름으로 객체를 생성한다
                // ({}) 안에는 return 이 생략 되어 있다. 반환 할 내용을 적으면 된다.
                const postsWithImage = posts.map((post) => ({
                    //...post를 하면 기존 posts를 post에 그대로 복사해서 넣는것이다
                    ...post,

                    //productImageUrl이라는 필드를 생성하며 get(postId)가 없을 경우 null을 부여한다.
                    productImageUrl: imageMap.get(post.postId) || null,
                }));

                console.log(postsWithImage);

                setPosts(postsWithImage);
                setTotalPages(result.tradePosts.totalPages);
            } catch (err) {
                console.error("❌ 데이터 불러오기 실패:", err);
            }
        }

        fetchData();
    }, [currentPage, sortOption]); // 정렬 변경 시에도 재호출

    return (
        <div className="flex w-full justify-center min-h-screen bg-white">
            {/* 왼쪽 여백 */}
            <div className="bg-white w-1/20 h-full p-1">
                <h3>section 1</h3>
            </div>

            {/* 중앙 게시판 */}
            <div className="bg-white text-black font-bold flex justify-center items-start p-2 w-18/20">
                <div className="bg-white w-230 h-full flex-col">
                    <div className=" h-8 flex justify-start items-center p-2">
                        <p>
                            실시간 인기 상품
                        </p>
                    </div>

                    <div className=" h-8 flex justify-start items-center p-2">
                        <p>
                            최신 등록 상품
                        </p>
                    </div>

                </div>
            </div>

            {/* 오른쪽 여백 */}
            <div className="bg-gray-50 w-1/20 h-full">
                <h3>section 3</h3>
            </div>
        </div>
    );
}
