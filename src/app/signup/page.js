// 백에서 Oauth2.0 정보 있으면 가져오고 없으면 그냥 전부 공란으로 처리할 것. 
"use client";
import "../globals.css";
import useAccessGuard from "@/hooks/useAccessGuard";
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/service/MemberService"

export default function Signup () {

    useAccessGuard( {requireLogin: false});

    const router = useRouter();

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        
        try{

            await signup(Form);

            router.push("/login");

        }catch(err){

            router.push("/");
            
        }

    };

    const searchParams = useSearchParams();
    const defaultProvier = searchParams.get("provider") || "none";
    const defaultAccountId = searchParams.get("accountId") || "";
    const defalutnickname = searchParams.get("nickname")|| "";
    const defaultEmail = searchParams.get("email") || "";
    const defaultName = searchParams.get("realName") || "";

    /*

        private String provider;
        private String accountId;
        private String nickname;
        private String password;
        private String email; <- 이거 본인인증해야함 나중에 추가할 것 

    */

    const [Form, setForm] = useState({
        
        provider: defaultProvier,
        accountId: defaultAccountId,
        password: "",
        nickname: defalutnickname,
        name: defaultName,
        email: defaultEmail,

    });

    return(

        <div className="flex justify-center items-center min-h-screen">
            <div className = "h-108 w-108 bg-red-100" >
                <form onSubmit = {handleSubmit}>
                    <input
                        type="text"
                        placeholder="accountId"
                        className="block w-full p-2 border"
                        value ={Form.accountId}
                        onChange={(e) => setForm({...Form, accountId: e.target.value})}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="block w-full p-2 border"
                        value ={Form.password}
                        onChange={(e) => setForm({...Form, password: e.target.value})}
                    />

                    <input
                        type="text"
                        placeholder="실명"
                        className="block w-full p-2 border"
                        value ={Form.name}
                        onChange={(e) => setForm({...Form, name: e.target.value})}
                    />

                    <input
                        type="text"
                        placeholder="닉네임(가명)"
                        className="block w-full p-2 border"
                        value ={Form.nickname}
                        onChange={(e) => setForm({...Form, nickname: e.target.value})}
                    />
                    <input
                        type="email"
                        placeholder="이메일"
                        className="block w-full p-2 border"
                        value ={Form.email}
                        onChange={(e) => setForm({...Form, email: e.target.value})}
                    />
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white">
                        가입하기
                    </button>
                </form>
                
            </div>
        </div>
    )
    
}