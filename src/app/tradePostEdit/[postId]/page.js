'use client';

import React, {useState,useEffect} from "react";
import {createTradePost, getPostInfoAndImages, updateTradePost} from "@/service/tradeBoardService";
import KakaoMap from "@/components/kakaomap";
import {useParams} from "next/navigation";
import { useRouter } from 'next/navigation';

export default function TradeBoardAddPostPage() {

    const { postId } = useParams();

    const [baseData, setBaseData] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const result = await getPostInfoAndImages(postId);
                setBaseData(result); // 기존 data 저장

                // ✅ formData.title에 데이터 반영
                setFormData((prev) => ({
                    ...prev,
                    title: result.title || "", // title이 undefined일 수도 있으니까 대비
                    price: result.price?.toLocaleString() || "",
                    content: result.content || "",
                    locate: result.locate || "",
                    bumpedCount : result.bumpedCount || ""

                }));


            } catch (err) {
                console.error("게시글 불러오기 실패", err);
            }
        };

        fetchPost();
    }, [postId]);


    const [formData, setFormData] = useState({
        title: "",
        content: "",
        price: "",
        locate: ""
    });

    const [deliveryType, setDeliveryType] = useState('');

    const [images, setImages] = useState([]);

    //미리보기용 url
    const [previewUrls, setPreviewUrls] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 가격 필드에만 숫자 + 콤마 처리
        if (name === "price") {
            const rawValue = value.replace(/,/g, "");

            // 숫자 외 입력 방지
            if (!/^\d*$/.test(rawValue)) return;

            // 천 단위 콤마 추가
            const formatted = Number(rawValue).toLocaleString();

            setFormData((prev) => ({
                ...prev,
                [name]: formatted
            }));
            return; // 여기서 종료
        }

        // 나머지 필드는 그대로 처리
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5); // 최대 5개
        setImages(files);

        if (e.target.files.length > 5) {
            alert("사진은 최대 5개까지만 등록할 수 있습니다.");
        }

        // 미리보기 URL 생성
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };


    const handleSubmit = async (e) => {
        //새로고침 막기
        e.preventDefault();

        if(!formData.title) {
            alert("제목을 입력해주세요.");
            return; // 등록 막기
        }

        if(!formData.price) {
            alert("가격을 입력 해주세요.");
            return; // 등록 막기
        }

        if (images.length === 0) {
            alert("이미지를 넣어주세요.");
            return;
        }

        if(!formData.content) {
            alert("내용을 입력 해주세요.");
            return; // 등록 막기
        }

        if (!deliveryType) {
            alert("배송 방식을 선택해주세요.");
            return; // 등록 막기
        }

        // 콤마 제거
        const rawPrice = formData.price.replace(/,/g, "");

        const cleanFormData = {
            ...formData,
            price: Number(rawPrice),
            deliveryType: deliveryType,
            status: baseData?.status,
            bumpedCount: baseData?.bumpedCount,
        };
        const data = new FormData();

        const jsonBlob = new Blob([JSON.stringify(cleanFormData)], {
            type: 'application/json'
        });

        //data에 담기
        data.append('data', jsonBlob);
        images.forEach((file) => data.append('images', file));

        console.log("🧾 formData 이미지 확인:");
        images.forEach((img, i) => console.log(`${i + 1}:`, img.name, img.size));

        for (let [key, value] of data.entries()) {
            if (value instanceof File) {
                console.log("📷 file field:", key, value.name);
            } else if (value instanceof Blob) {
                value.text().then((text) => {
                    console.log("📦 blob field:", key, text);
                });
            }
        }

        const result = await updateTradePost(postId,data);

        if (result) {
            alert('수정 성공!');
            router.push(`/tradePostRead/${postId}`);
        } else {
            alert('수정 실패');
        }
    };

    const handleDeliveryChange = (e) => {
        const isPostChecked = document.getElementById('post').checked;
        const isDirectChecked = document.getElementById('direct').checked;

        if (isPostChecked && isDirectChecked) {
            setDeliveryType('BOTH');
        } else if (isPostChecked) {
            setDeliveryType('PARCEL_DELIVERY');
        } else if (isDirectChecked) {
            setDeliveryType('DIRECT_TRADE');
        } else {
            setDeliveryType(''); // 선택 해제 시
        }

    };





    return (
        <form onSubmit={handleSubmit}>
            <div className="flex w-full justify-center h-230 bg-white">

                {/* 왼쪽 여백 공간 */}
                <div className="bg-white w-1/20 h-full p-1">
                    <h3>section 1</h3>
                </div>


                <div className="flex bg-white justify-center items-center w-18/20 h-200">

                    <div className="bg-white w-230 h-full flex-col">

                        {/* 거래 방식 선택*/}
                        <div className="bg-white h-15 flex justify-between p-1">

                            <div className="flex justify-center items-center">
                                <p className="text-black p-1 py-4 font-semibold text-base">판매 등록</p>
                            </div>


                            <div className="flex justify-center items-center gap-2">
                                <p className="text-black p-1 py-4 font-semibold text-sm">배송 방법</p>

                                <div className="flex justify-center items-center">
                                    <input
                                        type="checkbox"
                                        id="post"
                                        name="post1"
                                        value="택배거래"
                                        onChange={handleDeliveryChange}
                                    />
                                    <p className="text-gray-400 p-1 py-4 font-semibold text-xs">택배거래</p>
                                </div>

                                <div className="flex justify-center items-center">
                                    <input
                                        type="checkbox"
                                        id="direct"
                                        name="post2"
                                        value="직거래"
                                        onChange={handleDeliveryChange}
                                    />
                                    <p className="text-gray-400 p-1 py-4 font-semibold text-xs">직거래</p>
                                </div>

                            </div>
                        </div>

                        {/* 제목 */}
                        <div className="bg-white p-1">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full h-full bg-red-100 rounded-xs text-black p-1"
                                placeholder="상품명(제목)"
                            />
                        </div>

                        {/* 가격 */}
                        <div className="bg-white p-1">
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full h-full bg-red-100 rounded-xs text-black p-1"
                                placeholder="가격"
                            />
                        </div>

                        <div className="bg-white p-1">
                            <div className="bg-white flex justify-center items-center">
                                <input className="w-full h-full bg-red-100 rounded-xs text-black p-1" type="text"
                                       placeholder="키워드 등록"/>
                            </div>
                        </div>

                        <div className="bg-white p-1">
                            <p className="text-xs text-gray-400">카테고리 분류</p>
                            <div className="flex justify-center items-center h-30 bg-red-100 w-full rounded-xs p-1">

                            </div>
                        </div>


                        {/* 거래 장소 */}
                        <div className="bg-white p-1">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-400">거래 희망 장소</p>
                                <label
                                    onClick={() => setIsOpen(true)}
                                    className="text-xs text-gray-400 cursor-pointer hover:underline"
                                >
                                    장소 등록

                                </label>
                                {isOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-none">
                                        <div className="bg-white p-4 rounded-lg shadow-lg w-[530px] h-[540px] relative">
                                            <div>
                                                <h2 className="text-lg text-blacknp font-semibold mb-2">지도</h2>
                                            </div>


                                            <div className="bg-gray-200 w-[500px] h-[400px]">
                                                <KakaoMap
                                                    onSelectLocation={(addr) => {
                                                        setFormData(prev => ({...prev, locate: addr}));
                                                        setIsOpen(false); // 모달 닫기
                                                    }}
                                                />
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

                            <p className="w-full h-full bg-red-100 rounded-xs text-black p-1">
                                {formData.locate || "등록된 장소가 없습니다."}
                            </p>

                        </div>

                        {/* 사진 등록 */}
                        <div className="bg-white p-1">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-400">사진 등록</p>

                                {/* label로 클릭시 파일선택창 열리게 */}
                                <label htmlFor="imageUpload"
                                       className="text-xs text-gray-400 cursor-pointer hover:underline">
                                    사진 추가하기
                                </label>

                                {/* 실제 파일 선택 input은 숨김 */}
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {/* 미리보기 이미지 출력 */}
                            <div className="flex justify-start gap-2 items-center p-1">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div key={index}
                                         className="bg-gray-200 w-13 h-13 rounded-xs overflow-hidden flex items-center justify-center">
                                        {previewUrls[index] ? (
                                            <img src={previewUrls[index]} alt={`사진${index + 1}`}
                                                 className="w-full h-full object-cover"/>
                                        ) : (
                                            <span className="text-[8px] text-gray-500">사진{index + 1}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>


                        {/* 본문 */}
                        <div className="flex-col w-full p-1 bg-white">
                            <label  htmlFor="content" className="block text-gray-700 mb-2 text-sm font-semibold">
                                본문 등록
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full h-80 p-3 text-gray-800 bg-red-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                                placeholder="본문을 입력하세요..."
                            />
                        </div>

                        {/* 등록 버튼 */}
                        <div className="flex justify-end items-center gap-2 p-2">
                            <button
                                type="submit"
                                className="mt-3 w-25 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                            >
                                등록
                            </button>
                        </div>

                    </div>

                </div>

                {/* 우측 여백 공간 */}
                <div className="bg-gray-50 w-1/20 h-full">
                    <h3>section 3</h3>
                </div>


            </div>
        </form>
    );
}

