"use client";
import React from 'react';

// 메인 댓글 작성 폼
const CommentSection = ({
    comments,
    isAuthenticated,
    content,
    setContent,
    handleCommentSubmit,
    handleReplyButtonClick,
    handleDelete,
    setComments,
    countComments,
    navigate,
    replyingToCommentId,
    chatStart
}) => {
    return (
        <div className="max-w-2xl mx-auto mt-8 text-black">
            {/* 댓글 입력창 */}
            <div className="mt-6">
                {isAuthenticated ? (
                    <form onSubmit={(e) => handleCommentSubmit(e, null)}>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                            placeholder="댓글을 입력해주세요"
                            rows="3"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                            <button className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-black rounded-xl transition duration-200">댓글 작성</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-400 resize-none"
                            placeholder="댓글 작성에 로그인이 필요합니다. 로그인해주세요"
                            rows="3"
                            disabled
                        ></textarea>
                        <div className="flex justify-end mt-2">
                            <button
                                className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-black rounded-xl transition duration-200"
                                onClick={() => navigate.push('/login')}
                            >
                                로그인
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* 댓글 목록 */}
            <div className="mt-4">
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-bold mb-4 text-black">댓글 {countComments(comments)}</h3>
                    <div className="mr-3 space-y-4">
                        {comments.map((comment) => (
                            <CommentNode
                                key={comment.id}
                                comment={comment}
                                depth={0}
                                handleReplyButtonClick={handleReplyButtonClick}
                                handleDelete={handleDelete}
                                isAuthenticated={isAuthenticated}
                                handleCommentSubmit={handleCommentSubmit}
                                content={content}
                                setContent={setContent}
                                setComments={setComments}
                                replyingToCommentId={replyingToCommentId}
                                chatStart={chatStart}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

//대댓글 작성폼
const CommentNode = ({
    comment,
    depth,
    handleReplyButtonClick,
    handleDelete,
    isAuthenticated,
    handleCommentSubmit,
    content,
    setContent,
    setComments,
    replyingToCommentId,
    chatStart
}) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    return (
        <div className="bg-white text-black" style={{ marginLeft: `${depth * 1.5}rem` }}>
            <div className="flex items-center space-x-3 justify-between mb-2">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-black flex items-center justify-center text-sm font-medium">
                        {comment.author.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(comment.createTime).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex justify-end relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h.01M12 12h.01M19 12h.01"
                            />
                        </svg>
                    </button>
                    
                    {dropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                            <div className="py-1">
                                <button
                                    className="flex items-center px-4 py-2 w-full text-left text-sm hover:bg-gray-100"
                                    onClick={() => {
                                        handleReplyButtonClick(comment.id);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                    </svg>
                                    답글 달기
                                </button>

                                <button
                                    className="flex items-center px-4 py-2 w-full text-left text-sm hover:bg-gray-100"
                                    onClick={() => {
                                        chatStart(comment.author);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    1:1 채팅
                                </button>

                                <div className="border-t my-1"></div>

                                <button
                                    className="flex items-center px-4 py-2 w-full text-left text-sm text-red-500 hover:bg-gray-100"
                                    onClick={() => {
                                        handleDelete(comment.id);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    삭제하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <p className="ml-11 text-black">{comment.content}</p>

            {/* 대댓글 입력창 */}
            {replyingToCommentId === comment.id && (
                <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="mt-4 ml-11">
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                        placeholder="대댓글을 입력해주세요"
                        rows="3"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2 gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition duration-200"
                            onClick={() => handleReplyButtonClick(comment.id)}
                        >
                            취소
                        </button>

                        <button className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-black rounded-xl transition duration-200">대댓글 작성</button>
                    </div>
                </form>
            )}

            {/* 대댓글 목록 */}
            {comment.children?.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.children.map((child) => (
                        <CommentNode
                            key={child.id}
                            comment={child}
                            depth={depth + 1}
                            handleReplyButtonClick={handleReplyButtonClick}
                            handleDelete={handleDelete}
                            isAuthenticated={isAuthenticated}
                            handleCommentSubmit={handleCommentSubmit}
                            content={content}
                            setContent={setContent}
                            setComments={setComments}
                            replyingToCommentId={replyingToCommentId}
                            chatStart={chatStart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;