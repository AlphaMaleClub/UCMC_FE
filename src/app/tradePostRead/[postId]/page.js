"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { deletePost, getPostInfoAndImages, bumpPost, updateOnlyStatusTradePost } from "@/service/tradeBoardService";
import AddressMapView from "@/components/ViewMapFromAddress";
import { useRouter } from 'next/navigation';
import Dropdown from "@/components/Dropdown";
import Link from 'next/link';
import CommentSection from '../../../components/comment/CommentSection';
import { countComments } from '../../../components/comment/CommentUtils';

export default function TradePostAdd() {
    const router = useRouter();
    const { postId } = useParams();
    const [data, setData] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // ✅ JWT에서 로그인 유저 ID 추출용

    //댓글
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const auth = localStorage.getItem('isAuthenticated') === 'true';
        setUser(storedUser);
        setIsAuthenticated(auth);
    }, []);

    const statusTextMap = {
        ON_SALE: "판매중",
        SOLD_OUT: "판매완료",
        RESERVED: "예약중",
    };

    const deliveryTypeTextMap = {
        PARCEL_DELIVERY: "택배 거래",
        DIRECT_TRADE: "직 거래",
        BOTH: "택배,직 거래",
    };

    const [status, setStatus] = useState(data?.status);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // ✅ JWT에서 userId 추출
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setCurrentUserId(payload.userId); // ⚠ 서버에서 어떤 키로 userId를 넣었는지 확인 필요
            } catch (e) {
                console.error("JWT 파싱 실패", e);
            }
        }
    }, []);

    const handleStatusChange = async (newStatus) => {
        try {
            console.log("선택된 상태:", newStatus);
            setStatus(newStatus);

            const result = await updateOnlyStatusTradePost(postId, newStatus);
            setData(result);

            alert("상태가 변경되었습니다!");
            window.location.reload();
        } catch (error) {
            console.error("상태 변경 실패:", error);
            alert("상태 변경에 실패했습니다.");
        }
    };

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const result = await getPostInfoAndImages(postId);
                setData(result);
                console.log(result);
            } catch (err) {
                console.error("게시글 불러오기 실패", err);
            }
        };

        fetchPost();
    }, [postId]);

    const handleBump = async () => {
        try {
            const result = await bumpPost(postId);
            alert(result.message);
            console.log("끌어올림 성공", result);
        } catch (err) {
            console.error("끌어올리기 실패", err);
        }
    };

    const handleDeletePost = async () => {
        try {
            const result = await deletePost(postId);
            router.push("/");
            alert("게시글을 삭제 했습니다.");
            console.log("삭제 성공", result);
        } catch (err) {
            console.log("삭제 실패", err);
        }
    };

    // 댓글

    const handleCommentSubmit = async (e, parentId) => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        e.preventDefault();
        if (!content.trim()) {
            return;
        }
        try {
            console.log("유저정보", user);
            const commentRequest = {
                author: user.id,
                content: content,
                postId: postId,
                parentId: parentId,
            }
            await api.post(`/api/posts/${postId}/comments`, commentRequest);
            setContent('');
            setReplyingToCommentId(null);

            // 댓글 추가 후 댓글 리스트 새로고침
            const commentsResponse = await axios.get(`/api/posts/${postId}/comments`);
            setComments(commentsResponse.data);
        } catch (error) {
            console.error('댓글 제출 오류:', error)
        }
    };

    const handleReplyButtonClick = (commentId) => {
        console.log("댓글 실행", replyingToCommentId);
        if (replyingToCommentId === commentId) {
            setReplyingToCommentId(null);
        } else {
            setReplyingToCommentId(commentId);
        }
    };
    // 댓글 삭제
    const handleDelete = async (commentId) => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await api.delete(`/api/posts/${postId}/comments/${commentId}`);
            // 댓글 삭제 후 댓글 리스트 새로고침
            const commentsResponse = await axios.get(`/api/posts/${postId}/comments`);
            setComments(commentsResponse.data);
        } catch (error) {
            alert("사용자 권한이 없습니다");
            console.error('댓글 삭제 오류:', error);
        }
    };

    // 채팅 시작

    const chatStart = async (commentAuthor) => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        try {
            console.log("채팅방 생성 작성자 , 상대", user.name)
            const createChatRoomResponse = await api.post('/api/chatroom', { memberName: user.name, opponentName: commentAuthor })
            navigate(`/chat/${createChatRoomResponse.data}`);
        } catch (error) {
            alert("사용자 권한이 없습니다");
            console.error('채팅방 생성 오류:', error);
        }
    }


    return (
        <div className="flex w-full justify-center h-full bg-white">
            {/* 왼쪽 여백 공간 */}
            <div className="bg-gray-50 w-1/20 h-full p-1">
                <h3>section 1</h3>
            </div>

            <div className="bg-white w-18/20 h-full flex flex-col items-center">
                <div className="bg-white w-230 h-full flex flex-col items-center gap-2">
                    <div className="bg-white h-5"></div>

                    <div className="bg-white w-full h-90 flex justify-between items-center">

                        <div className="bg-gray-100 w-100 h-90 rounded-xl">
                            {data?.productImages?.length > 0 && (
                                <img
                                    src={`${data.productImages[0].imageUrl}?v=${Date.now()}`}
                                    alt="대표 이미지"
                                    className="object-cover w-full h-full"
                                />
                            )}
                        </div>

                        <div className=" w-120 h-90 flex flex-col items-start text-black gap-2">
                            <div className="flex w-full justify-between items-center">
                                <p className="text-lg font-semibold">{data?.title}</p>

                                <div>
                                    <Dropdown
                                        status={statusTextMap[data?.status]}
                                        options={statusTextMap}
                                        selected={status}
                                        onChange={handleStatusChange}
                                    />
                                </div>
                            </div>


                            <p className="text-xl font-semibold">{data?.price?.toLocaleString()} 원</p>
                            <p className="text-sm font-semibold text-black">
                                배송 방식 : {deliveryTypeTextMap[data?.deliveryType] || "알 수 없음"}
                            </p>

                            <div className="flex justify-between items-center w-full h-22 gap-2">
                                <div className="flex justify-start items-center gap-2">
                                    <div className="rounded-full bg-gray-200 w-15 h-15 flex justify-center items-center">
                                        <p>판매자</p>
                                    </div>
                                    <p>{data?.nickName}</p>

                                </div>

                                {/* ✅ 로그인 했고, 작성자가 아닐 경우에만 표시 */}
                                {data && currentUserId !== null && currentUserId !== data.memberId && (
                                    <div className="flex justify-center items-center border-2 h-13 w-25 rounded-xl cursor-pointer border-gray-400 hover:font-bold">
                                        <p>채팅 하기</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-start w-full h-22 gap-2">
                                <div className="flex justify-between items-center w-full">
                                    <button>거래 위치</button>
                                    <label
                                        onClick={() => setIsOpen(true)}
                                        className="text-xs text-gray-400 cursor-pointer"
                                    >
                                        <p className="hover:font-bold hover:text-black text-xs text-gray-600">위치 확인</p>
                                    </label>
                                    {isOpen && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-none">
                                            <div className="bg-white p-4 rounded-lg shadow-lg w-[530px] h-[540px] relative">
                                                <div>
                                                    <h2 className="text-lg text-black font-semibold mb-2">지도</h2>
                                                </div>
                                                <div className="bg-gray-200 w-[500px] h-[400px]">
                                                    <AddressMapView address={data.locate} />
                                                </div>
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



                            {/*/!* 글쓴이일 경우에만 노출 *!/*/}
                            {/*{data && currentUserId === data.memberId && (*/}
                            <div className="bg-gray-100 rounded-xl w-full h-18 flex justify-center items-center">
                                <div className="w-1/4 h-full flex justify-center items-center text-sm">
                                    <button onClick={handleBump} className="hover:font-bold cursor-pointer">끌어 올리기</button>
                                </div>
                                <div className="w-1/4 h-full flex justify-center items-center text-sm hover:font-bold cursor-pointer">
                                    <Link href={`/tradePostEdit/${postId}`}>
                                        상품 수정
                                    </Link>
                                </div>
                                <div className="w-1/4 h-full flex justify-center items-center text-sm"></div>
                                <div className="w-1/4 h-full flex justify-center items-center text-sm">
                                    <button onClick={handleDeletePost} className="hover:font-bold cursor-pointer">게시글 삭제</button>
                                </div>
                            </div>
                            {/*)}*/}
                        </div>
                    </div>

                    <div className="w-full h-2 rounded-xl"></div>

                    <div className="w-full h-80 bg-red-100 rounded-xl flex justify-center items-center">
                        <div className="w-19/20 h-9/10 text-black text-sm">
                            <h3>{data?.content}</h3>
                        </div>
                    </div>

                    <div className="w-full " >
                        <h3 className="text-black mb-2">첨부 사진</h3>
                        <div className="flex flex-wrap gap-2 items-center p-1">
                            {data?.productImages?.length > 0 &&
                                data.productImages.map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className="bg-gray-300 w-20 h-20 rounded overflow-hidden cursor-pointer"
                                        onClick={() => setSelectedImage(img.imageUrl)}
                                    >
                                        <img
                                            src={`${img.imageUrl}?v=${Date.now()}`}
                                            alt={`이미지${idx}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}
                        </div>
                    


                        </div>

                        {selectedImage && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="absolute inset-0 bg-white opacity-90"></div>
                                <div className="relative bg-white border p-4 rounded max-w-[90%] max-h-[90%]">
                                    <img
                                        src={selectedImage}
                                        alt="확대 이미지"
                                        className="object-contain max-w-full max-h-[80vh]"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={() => setSelectedImage(null)}
                                            className="px-4 py-2 bg-red-400 text-white rounded hover:bg-gray-700"
                                        >
                                            닫기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

<div className="w-full">
                     <CommentSection
                            comments={comments}
                            isAuthenticated={isAuthenticated}
                            content={content}
                            setContent={setContent}
                            handleCommentSubmit={handleCommentSubmit}
                            handleReplyButtonClick={handleReplyButtonClick}
                            handleDelete={handleDelete}
                            setComments={setComments}
                            countComments={countComments}
                            navigate={router}
                            replyingToCommentId={replyingToCommentId}
                            chatStart={chatStart}
                        />
                     </div>
                    </div>
                     {/* 댓글섹션 */}
                     
                <div>

                    <div className="bg-white h-5"></div>
                </div>
            </div>

            {/* 우측 여백 공간 */}
            <div className="bg-gray-50 w-1/20 h-full">
                <h3>sectiondd 3</h3>
            </div>
        </div>
    );
}
