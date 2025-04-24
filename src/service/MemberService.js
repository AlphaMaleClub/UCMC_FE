import {axiosDefaultRequest} from "./AxiosConfig"

export const signup = async (signupForm) => {
    
        const res = await axiosDefaultRequest.post("/api/signup", signupForm);
        return res.status === 200 || res.status === 201
}