"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {deletePost, getPostInfoAndImages} from "@/service/tradeBoardService";
import {bumpPost} from "@/service/tradeBoardService";
import KakaoMap from "@/components/kakaomap";
import AddressMapView from "@/components/ViewMapFromAddress";
import { useRouter } from 'next/navigation'


export default function TradePostAdd() {
    const router = useRouter()
    const { postId } = useParams();
    const [data, setData] = useState(null);
    const statusTextMap = {
        ON_SALE: "판매중",
        SOLD_OUT: "판매완료",
        RESERVED: "예약중",
    }
    const deliveryTypeTextMap = {
        PARCEL_DELIVERY: "택배 거래",
        DIRECT_TRADE: "직 거래",
        BOTH: "택배,직 거래"
    }

    useEffect(() => {

        if (!postId) return;

        const fetchPost  = async () => {
            try {
            const result = await getPostInfoAndImages(postId);
            setData(result);
            console.log(result);
            console.log(data)
            } catch (err) {
                console.error("게시글 불러오기 실패",err)
            }
        };

        fetchPost();
    },[postId]);

    const handleBump = async () => {
        try {
            const result = await bumpPost(postId);

            alert(result.message);
            console.log("끌어올림 성공", result);
        } catch (err) {
            console.error("끌어올리기 실패", err);
        }
    }


    const handleDeletePost = async () => {
        try {
            console.log(postId);

            const result = await deletePost(postId);


            // 나중에 꼭 링크를 바꿔줘야함❗❗❗❗❗❗❗❗❗❗
            router.push("/");

            alert(result.message);
            console.log("삭제 성공",result);


        } catch (err) {
            console.log(postId);
            console.log("삭제 실패",err);
        }
    }


    const [isOpen, setIsOpen] = useState(false);

    return (

        <div className="flex w-full justify-center h-210 bg-white">


            {/* 왼쪽 여백 공간 */}
            <div className="bg-gray-50 w-1/20 h-full p-1">
                <h3>section 1</h3>
            </div>

            <div className="bg-white w-18/20 h-210 flex flex-col items-center ">
                <div className="bg-white w-230 h-full flex flex-col items-center gap-2">

                    <div className="bg-white h-5"></div>

                    <div className="bg-white w-full h-100 flex justify-between items-center">

                        <div className="bg-gray-100 w-100 h-100 rounded-xl">
                            {data?.productImages?.length > 0 && (
                                <img
                                    src={data.productImages[0].imageUrl}
                                    alt="대표 이미지"
                                    className="object-cover w-full h-full"
                                />
                            )}
                        </div>

                        <div className=" w-120 h-100 flex flex-col items-start text-black gap-2">
                            <div className="flex w-full justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">카테코리 / 카태고리1 / 2</p>
                                </div>

                                <div>
                                    <p>{statusTextMap[data?.status]}</p>
                                </div>

                            </div>

                            <p className="text-lg font-semibold">{data?.title}</p>

                            <p className="text-xl font-semibold">{data?.price?.toLocaleString()} 원</p>

                            <p className="text-sm font-semibold text-black">
                                배송 방식 : {deliveryTypeTextMap[data?.deliveryType] || "알 수 없음"}
                            </p>

                            <div className="flex justify-between items-center w-full h-22 gap-2">
                                <div className="flex justify-start items-center gap-2">
                                    <div
                                        className="rounded-full bg-gray-200 w-15 h-15 flex justify-center items-center">
                                        <p>프로필</p>
                                    </div>
                                    <p>{data?.nickName}</p>

                                </div>
                            </div>

                            <div className="flex flex-col items-start w-full h-22 gap-2">
                                <div className="flex justify-between items-center w-full">
                                    <button>
                                        거래 위치
                                    </button>
                                    <label
                                        onClick={() => setIsOpen(true)}
                                        className="text-xs text-gray-400 cursor-pointer hover:underline"
                                    >
                                        <p className="hover:font-bold hover:text-black text-xs text-gray-600">위치 확인</p>

                                    </label>
                                    {isOpen && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-none">
                                            <div className="bg-white p-4 rounded-lg shadow-lg w-[530px] h-[540px] relative">
                                                <div>
                                                    <h2 className="text-lg text-blacknp font-semibold mb-2">지도</h2>
                                                </div>


                                                <div className="bg-gray-200 w-[500px] h-[400px]">
                                                    <AddressMapView address={data.locate} />
                                                </div>

                                                {/* 닫기 버튼 */}
                                                <button
                                                    onClick={() => setIsOpen(false)}
                                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    )}


                                </div>
                                <div className="bg-gray-100 w-full h-10 p-2 rounded-xl border-gray-400 border-1">
                                    <p>{data?.locate}</p>
                                </div>

                            </div>

                            <div className="bg-gray-100 rounded-xl w-full h-18 flex justify-center items-center">
                                <div className=" w-1/4 h-full flex justify-center items-center text-sm">
                                    <button onClick={handleBump} className="hover:font-bold">끌어 올리기</button>
                                </div>
                                <div className=" w-1/4 h-full flex justify-center items-center text-sm">
                                    <p>상품 수정</p>
                                </div>
                                <div className=" w-1/4 h-full flex justify-center items-center text-sm">
                                    <p>상태 변경</p>
                                </div>
                                <div className=" w-1/4 h-full flex justify-center items-center text-sm">
                                    <button onClick={handleDeletePost} className="hover:font-bold">게시글 삭제</button>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="w-full h-2 rounded-xl">

                    </div>

                    <div className="w-full h-80 bg-red-100 rounded-xl flex justify-center items-center">
                    <div className="w-19/20 h-9/10 text-black text-sm">
                            <h3>{data?.contents}</h3>
                        </div>

                    </div>


                    <div className="w-full h-30">
                        <h3 className="text-black">첨부 사진</h3>
                        <div className="flex justify-start gap-2 items-center p-1">

                            {data?.productImages?.length > 0 &&
                                data.productImages.map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className="bg-gray-300 w-13 h-13 rounded-xs overflow-hidden flex items-center justify-center"
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={`이미지${idx}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}


                        </div>
                    </div>

                    <div className="bg-white h-5"></div>

                </div>


            </div>

            {/* 우측 여백 공간 */
            }
            <div className="bg-gray-50 w-1/20 h-full">
                <h3>section 3</h3>
            </div>

        </div>


    );

}
