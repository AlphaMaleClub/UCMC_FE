import React from "react";

function TradePostCard({ post }) {
    return (
        <div className="border rounded overflow-hidden shadow hover:shadow-md transition">
            <img
                src={post.thumbnailUrls[0]}
                alt={post.title}
                className="w-full h-32 object-cover"
            />
            <div className="p-2">
                <p className="text-sm text-gray-700 truncate">{post.title}</p>
                <p className="text-red-500 font-bold text-lg">
                    {post.price.toLocaleString()}원
                </p>
                <p className="text-xs text-gray-400">{post.createdAt}</p>
            </div>
        </div>
    );
}

export default TradePostCard;