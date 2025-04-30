"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/service/MemberService"
import useAccessGuard from "@/hooks/useAccessGuard";



export default function Login (){
    useAccessGuard({requireLogin: false}); //로그인상태인데 들어오면 튕김

    const [ID, setID] = useState("");
    const [Password, setPassword] = useState("");
    const [isLogined, SetisLogined] = useState("");
    const router = useRouter();


    const handleSubmit = async (e) => {

        e.preventDefault();
        
        try{

            await login(ID, Password);
            
            alert("로그인 성공했습니다.");
            SetisLogined(true)
            
            localStorage.setItem("isAuthenticated", isLogined ? "true" : "false");

            router.push("/")

        }catch(err){

            alert("실패함");

        }
        

    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className = "h-108 w-108 bg-red-100" >
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="ID"
                        className="block w-full p-2 border"
                        value ={ID}
                        onChange={(e) => setID(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="block w-full p-2 border"
                        value ={Password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white">
                        로그인
                    </button>

                </form>

                <p className="text-sm text-gray-700">입력한 ID: <strong>{ID}</strong></p>
                <p className="text-sm text-gray-700">입력한 비밀번호: <strong>{Password}</strong></p>
                
                <Link href = "/signup">회원가입</Link>
                

            </div>
        </div>
    )
}