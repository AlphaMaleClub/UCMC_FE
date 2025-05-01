import { axiosAuthRequest, axiosDefaultRequest } from "./AxiosConfig"

export const createTradePost = async (formData) => {
    try {
        const response = await axiosAuthRequest.post("api/trade-posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;

    } catch (error) {
        console.error("글 작성 실패",error);
        throw new Error("글 작성 실패")
    }
}

export const getTop10Post = async () => {
    try {
        const response = await axiosAuthRequest.get("http://localhost:8080/api/trade-posts/top10")
        return response.data

    } catch (error) {
        console.error("Top 10 불러오기 실패",error)
        throw new Error("Top 10 불러오기 실패");
    }
}

export const getAllPost = async (page, sort) => {
    try {
        const response = await axiosAuthRequest.get(`http://localhost:8080/api/trade-posts?page=${page}&sort=${sort}`);
        return response.data;

    } catch (error) {
        console.error("모든게시글 조회 실패",error)
        throw new Error("모든 게시글 조회 실패");
    }

};

export const getPostInfoAndImages = async (postId) => {
    try {
        const response = await axiosAuthRequest.get(`http://localhost:8080/api/trade-posts/${postId}`);
        return response.data

    } catch (error) {
        console.error("게시글 조회 실패",error)
        throw new Error("게시글 조회 실패");
    }
};

export const bumpPost = async (postId) => {
    try {
        const response = await axiosAuthRequest.put(`/api/trade-posts/${postId}/bump`);
        return response.data;

    } catch (error) {
        console.error("끌어올리기 실패:", error);
        throw new Error("끌어올리기 실패");
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await axiosAuthRequest.delete(`http://localhost:8080/api/trade-posts/${postId}`);
        return response.data

    } catch (error) {
        console.error("게시글 삭제 실패",error)
        throw new Error("게시글 삭제 실패");
    }
}

export const updateOnlyStatusTradePost = async (postId, status) => {
    try {
        const response = await axiosAuthRequest.put(
            `http://localhost:8080/api/trade-posts/${postId}/status`,
            { status }, // ← JSON body
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        return response.data;

    } catch (error) {
        console.error("Status 수정 실패",error)
        throw new Error("Status 수정 실패")
    }
};

export const updateTradePost = async (postId, formData) => {
    try {
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

    } catch (error) {
        console.error("게시글 수정 실패",error)
        throw new Error("게시글 수정 실패")
    }
};