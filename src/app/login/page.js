"use client";
import Link from "next/link";
import { useState } from "react";




export default function Login (){

    const [ID, setID] = useState("");
    const [Password, setPassword] = useState("");

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className = "h-108 w-108 bg-red-100" >
                <form>
                    <input
                        type="ID"
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
                    
                </form>

                <p className="text-sm text-gray-700">입력한 ID: <strong>{ID}</strong></p>
                <p className="text-sm text-gray-700">입력한 비밀번호: <strong>{Password}</strong></p>
                
                <Link href = "/signup">회원가입</Link>
                

            </div>
        </div>
    )
}