export const createTradePost = async (formData) => {
    const response = await fetch("http://localhost:8080/api/Trade/createPost",{
        method: "POST",
        body: formData,
    })

    console.log("fetch",response)

    if (!response.ok) {
        throw new Error("게시글 작성 실패")
    }

    return await response.json()
}

export const getAllPost = async (page, sort) => {
    const response = await fetch(`http://localhost:8080/api/Trade/readAllPost?page=${page}&sort=${sort}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("📡 응답 상태코드:", response.status);

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
}

export const updateOnlyStatusTradePost = async (postId, status) => {
    const response = await fetch(`http://localhost:8080/api/Trade/updatePostStatus/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status })
    })

    if (!response.ok) {
        throw new Error("게시글 상태 변경 실패");
    }

    return await response.json();
}

export const updateTradePost = async (postId, formData) => {

    const response = await fetch(`http://localhost:8080/api/Trade/updatePost/${postId}`, {
        method: "PUT",

        body: formData // ✅ headers 생략 필수!
    });

    console.log("front 서비스 도착")
    console.log(postId)
    console.log(formData)
    console.log("fetch",response)

    if (!response.ok) {
        throw new Error(`수정 실패: ${response.status}`);
    }

    return await response.json();
};

export const getOnlyProductImage = async (postId) => {

    const response = await  fetch(`http://localhost:8080/api/Trade/getOnlyFirstImage/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("개별 이미지 조회 실패");
    }

    return await response.json();
}