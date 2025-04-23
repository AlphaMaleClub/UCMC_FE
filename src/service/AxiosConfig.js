import axios from "axios";
const API_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";

//먼저 요청 보내는 코드임.(LocalStorage 에서 보냄)
//여기서 날라가는건 AccessToken
const axiosDefaultInstance = axios.create({
    baseURL: API_ORIGIN,
    headers: {
        "Content-Type": "application/json",
    },
})

//refreshToken 갱신하는 코드
const refreshAccessToken = async() => {
    const response = await axios.post("/api/refreshToken", {}, {
        withCredentials: true,
    });
    return response.data.accessToken
};


// accessToken을 요청할 때 요청을 가로채서(인터셉트) 로딩해서 DefaultInstance의 header에 추가한다.
axiosDefaultInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


/* 
    accessToken을 요청하고 받은 반환값(response)을 가로채서(인터셉트)
    해당 오류가 accessToken만료로 인한 반환값이면 refreshToken을 통해 다시 accessToken을 발급받고 자동으로 그걸 요청에 넣어서 보냄
    그리고 그 요청에서 실패한다면 세션만료로 인한 로그아웃 처리하기. 
*/
axiosDefaultInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) { //옵셔널 체이닝으로 확인
        originalRequest._retry = true;
        try {

          const newAccessToken = await refreshAccessToken();
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosDefaultInstance(originalRequest);
          
        } catch (err) {
          localStorage.removeItem("accessToken");
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login";
          throw err;
        }
      }
  
      return Promise.reject(error);
    }
  );





// const autoRefreshTokenAndreTry = async (originalRequest) => {
//     try {
//       const newAccessToken = await refreshAccessToken();
//       localStorage.setItem("accessToken", newAccessToken);
//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//       return axiosDefaultInstance(originalRequest);
//     } catch (error) {
//       localStorage.removeItem("accessToken");
//       alert("세션이 만료되었습니다. 다시 로그인해주세요.");
//       window.location.href = "/login";
//       throw error;
//     }
//   };
  






