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
            </div>

            {/* 중앙 게시판 */}
            <div className="bg-white flex justify-center items-start p-2 w-18/20">
                <div className="bg-white w-230 h-full flex-col">
                    {/* 정렬 옵션 */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-black flex justify-start items-center w-full p-1 py-4 font-semibold text-base">중고 매매 리스트</h1>
                        <div className="w-full h-full flex justify-end items-center gap-2">

                            <div className="flex items-center gap-2 p-1 py-4 font-semibold text-xs">
                                {["최신순", "낮은가격순", "높은가격순"].map((label) => (
                                    <React.Fragment key={label}>
                                        <button
                                            onClick={() => handleSortChange(label)}
                                            className={selected === label ? "text-black" : "text-gray-400"}
                                        >
                                            {label}
                                        </button>
                                        {label !== "높은가격순" && <p>|</p>}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div>
                                <Link href={`/tradeboardaddpost`}>
                                    <p className=" flex justify-center items-center text-xs w-20 h-10 border-2 border-red-200 rounded-2xl gap-2 p-1 py-4 hover:cursor-pointer bg-red-100 hover:bg-red-400">
                                        등록하기
                                    </p>
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* 게시글 리스트 */}
                    <div className="grid grid-cols-5 gap-2">
                        {posts.map((post, index) => (
                            <div key={index}
                                 className="flex flex-col items-center w-45 h-50 p-2 text-black gap-1 rounded-xl hover:border-1 hover:border-gray-200">
                                <Link href={`/tradePostRead/${post.postId}`} className="w-full h-full">
                                    <div
                                        className="bg-red-100 w-full h-36 rounded-xl flex items-center justify-center overflow-hidden">
                                        {post.productImageUrl ? (
                                            <img
                                                src={post.productImageUrl}
                                                alt="상품 이미지"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <p className="text-sm">사진 없음</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-start w-full p-1">
                                        <div className="flex justify-between text-xs w-full">
                                            <p className="truncate max-w-[50%]">{post.title}</p>
                                            <p className="text-right text-[10px]">
                                                {new Date(post.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="font-bold text-xs mt-1">
                                            {post.price.toLocaleString()}원
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="h-10"></div>

                    {/* 페이지네이션 */}
                    <div className="flex cursor-pointer justify-center gap-2 pb-6 text-gray-600">
                        {/* << */}
                        {currentPage > 10 ? (
                            <Link href={`/tradeboard/${Math.max(1, currentPage - 10)}?sort=${sortOption}`}> {/* ✅ sortOption 유지 */}
                                <button className="px-3 py-1 hover:bg-red-400 bg-none rounded">&laquo;</button>
                            </Link>
                        ) : (
                            <button disabled className="px-3 py-1 rounded text-gray-400 opacity-50 cursor-not-allowed">
                                &laquo;
                            </button>
                        )}

                        {/* < */}
                        {currentPage > 1 ? (
                            <Link href={`/tradeboard/${currentPage - 1}?sort=${sortOption}`}> {/* ✅ sortOption 유지 */}
                                <button className="px-3 py-1 hover:bg-red-400 bg-none rounded">&lt;</button>
                            </Link>
                        ) : (
                            <button disabled className="px-3 py-1 rounded text-gray-400 opacity-50 cursor-not-allowed">
                                &lt;
                            </button>
                        )}

                        {/* 페이지 번호 */}
                        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                            const pageNumber = startPage + idx;
                            return (
                                <Link key={pageNumber} href={`/tradeboard/${pageNumber}?sort=${sortOption}`}> {/* ✅ sortOption 유지 */}
                                    <button
                                        className={`px-3 py-1 rounded ${
                                            currentPage === pageNumber
                                                ? "bg-red-300 text-white"
                                                : "hover:bg-red-400"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                </Link>
                            );
                        })}

                        {/* > */}
                        {currentPage < totalPages ? (
                            <Link href={`/tradeboard/${currentPage + 1}?sort=${sortOption}`}> {/* ✅ sortOption 유지 */}
                                <button className="px-3 py-1 hover:bg-red-400 bg-none rounded">&gt;</button>
                            </Link>
                        ) : (
                            <button disabled className="px-3 py-1 rounded text-gray-400 opacity-50 cursor-not-allowed">
                                &gt;
                            </button>
                        )}

                        {/* >> */}
                        {currentPage + 10 <= totalPages ? (
                            <Link href={`/tradeboard/${Math.min(totalPages, currentPage + 10)}?sort=${sortOption}`}> {/* ✅ sortOption 유지 */}
                                <button className="px-3 py-1 hover:bg-red-400 bg-none rounded">&raquo;</button>
                            </Link>
                        ) : (
                            <button disabled className="px-3 py-1 rounded text-gray-400 opacity-50 cursor-not-allowed">
                                &raquo;
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 오른쪽 여백 */}
            <div className="bg-white w-1/20 h-full">
            </div>
        </div>
    );
}
