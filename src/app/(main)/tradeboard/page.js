"use client";

import React, { useEffect, useState } from "react";
import {getAllPostAndImage} from "@/service/tradeBoardService";
import TradePostCard from "@/components/TradePostCard";

export default function TradeListPage() {

    const [selected, setSelected] = useState("최신순")

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllPostAndImage(page);
                console.log("✅ 받은 데이터:", data);

                // 예: 백엔드 응답 구조가 data.tradePosts.content일 경우
                setPosts(data.tradePosts.content);
            } catch (err) {
                console.error("❌ 데이터 불러오기 실패:", err);
            }
        }

        fetchData();
    }, [page]);

    return (
        <div className="flex w-full justify-center h-230 bg-white">


            {/* 왼쪽 여백 공간 */}
            <div className="bg-white w-1/20 h-full p-1">
                <h3>section 1</h3>
            </div>


            <div className="bg-white p-4 w-18/20 h-20">
                <div className=" flex justify-between items-center mb-4">
                    <h1 className="text-black p-1 py-4 font-semibold text-base">중고 매매 리스트</h1>
                    <div className="flex items-center justify-center gap-2 p-1 py-4 font-semibold text-xs">

                        <button
                            onClick={() => setSelected("최신순")}
                            className={selected === "최신순" ? "text-black" : "text-gray-400"}
                        >
                            최신순
                        </button>

                        <p>|</p>

                        <button
                            onClick={() => setSelected("추천순")}
                            className={selected === "추천순" ? "text-black" : "text-gray-400"}
                        >
                            추천순
                        </button>

                        <p>|</p>

                        <button
                            onClick={() => setSelected("낮은가격순")}
                            className={selected === "낮은가격순" ? "text-black" : "text-gray-400"}
                        >
                            낮은가격순
                        </button>

                        <p>|</p>

                        <button
                            onClick={() => setSelected("높은가격순")}
                            className={selected === "높은가격순" ? "text-black" : "text-gray-400"}
                        >
                            높은가격순
                        </button>

                    </div>
                </div>
            </div>
            {/* 우측 여백 공간 */}
            <div className="bg-gray-50 w-1/20 h-full">
                <h3>section 3</h3>
            </div>


        </div>
    );
}
