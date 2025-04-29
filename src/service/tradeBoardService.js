import { axiosAuthRequest, axiosDefaultRequest } from "./AxiosConfig"



export const createTradePost = async (formData) => {
    const response = await axiosAuthRequest.post("api/Trade/createPost", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export const getAllPostAndImage = async (page) => {
    const response = await fetch(`http://localhost:8080/api/Trade/readAllPost?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("모든 게시글 조회 실패");
    }

    return await response.json();
};

export const getPostInfoAndImages = async (postId) => {
    const response = await fetch(`http://localhost:8080/api/Trade/readPost/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("게시글 조회 실패");
    }

    return await response.json();
};

export const bumpPost = async (postId) => {
    const response = await fetch(`http://localhost:8080/api/Trade/bumpPost/${postId}`, {
        method: "PUT" ,
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("끌어올리기 실패");
    }

    return await response.json();

}

export const deletePost = async (postId) => {
    const response = await fetch(`http://localhost:8080/api/Trade/deletePost/${postId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        throw new Error("게시글 삭제 실패");
    }

    return await response.json();
};