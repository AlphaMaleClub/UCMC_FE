import {axiosDefaultRequest, axiosAuthRequest} from "./AxiosConfig"


export const signup = async (signupForm) => {
    
        const res = await axiosDefaultRequest.post("/api/signup", signupForm);

}

export const login = async (username, password) => {

    const res = await axiosDefaultRequest.post("/api/login",{username, password},{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        transformRequest: [(data) => {
          return Object.entries(data).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
        }],
      });

}

export const logout = async () => {

    const res = await axiosAuthRequest.post("/api/logout");
      
    if(res?.status == 200 || res?.status == 201){
      
      localStorage.removeItem("accessToken");

      return true;

    }else{

      return false;

    }

    

}