import axios from "axios";
const API_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

//accessToken을 동적으로 로딩해서 DefaultInstance의 header에 추가한다.
axiosDefaultInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//refreshToken 갱신하는 코드
const refreshAccessToken = async() => {
    const response = await axios.post("/api/refreshToken", {}, {
        withCredentials: true,
    });
    return response.data.accesstoken
};

//먼저 요청 보내는 코드임.(LocalStorage 에서 보냄)
//여기서 날라가는건 AccessToken
const axiosDefaultInstance = axios.create({
    baseURL: API_ORIGIN,
    headers: {
        "Content-Type": "application/json",
    },
})






