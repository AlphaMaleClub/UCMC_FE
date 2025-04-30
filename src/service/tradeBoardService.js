import { axiosAuthRequest, axiosDefaultRequest } from "./AxiosConfig"



export const createTradePost = async (formData) => {
    const response = await axiosAuthRequest.post("api/trade-posts", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export const getTop10Post = async () => {
    const response = await axiosAuthRequest.get("http://localhost:8080/api/trade-posts/top10",{
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("fetch",response)

    return response.data
}

export const getAllPost = async (page, sort) => {
    const response = await axiosAuthRequest.get(`http://localhost:8080/api/trade-posts?page=${page}&sort=${sort}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("📡 응답 상태코드:", response.status);

    if (!response.status) {
        throw new Error("모든 게시글 조회 실패");
    }

    return response.data
};

export const getPostInfoAndImages = async (postId) => {
    const response = await axiosAuthRequest.get(`http://localhost:8080/api/trade-posts/${postId}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.status) {
        throw new Error("게시글 조회 실패");
    }

    return response.data
};

export const bumpPost = async (postId) => {
    try {
        const response = await axiosAuthRequest.put(`/api/trade-posts/${postId}/bump`);
        return response.data;

    } catch (err) {

        console.error("끌어올리기 실패:", err);
        throw new Error("끌어올리기 실패");
    }
};

export const deletePost = async (postId) => {
    const response = await axiosAuthRequest.delete(`http://localhost:8080/api/trade-posts/${postId}`, {
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.status) {
        throw new Error("게시글 삭제 실패");
    }

    return response.data
}

export const updateOnlyStatusTradePost = async (postId, status) => {
    const response = await axiosAuthRequest.put(
        `http://localhost:8080/api/trade-posts/${postId}/status`,
        { status }, // ← JSON body
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};

export const updateTradePost = async (postId, formData) => {
    const response = await axiosAuthRequest.put(
        `http://localhost:8080/api/trade-posts/${postId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};