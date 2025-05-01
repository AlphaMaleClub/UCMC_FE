"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {getTop10Post} from "@/service/tradeBoardService";

export default function TradeBoardPage() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getTop10Post() // 정렬 옵션 전달
                const posts = result.tradePosts;
                const images = result.images;

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
            } catch (err) {
                console.error("데이터 불러오기 실패:", err);
            }
        }

        fetchData();
    }, []); // 정렬 변경 시에도 재호출

    return (
        <div className="flex w-full justify-center min-h-screen bg-white">
            {/* 왼쪽 여백 */}
            <div className="bg-white w-1/20 min-h-screen  p-1">
            </div>

            {/* 중앙 게시판 */}
            <div className="bg-white text-black flex min-h-screen  justify-center items-start p-2 w-18/20">
                <div className="bg-white w-230 h-full flex-col">

                    <div className=" h-8 flex justify-between items-center" >
                        <p className=" p-2 font-bold">
                            최신 등록 상품
                        </p>

                        <div className=" flex justify-between items-center p-2 h-5 text-xs  text-gray-800">
                            <Link href={`/tradeboard/1`}>
                                + 더보기
                            </Link>
                        </div>


                    </div>

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


                </div>
            </div>

            {/* 오른쪽 여백 */}
            <div className="bg-white w-1/20 min-h-screen ">
            </div>
        </div>
    );
}
