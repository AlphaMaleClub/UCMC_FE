"use client";

import  Link  from "next/link";
import {useEffect, useState} from "react";
import { logout } from "@/service/MemberService";
import { useRouter } from "next/navigation";

export default function AuthButton(){


    const router = useRouter();
    const [isLoggnedIn, SetisLoggnedIn] = useState(false);
    const logoutHandle = async() => {
        
        const isLoggedOutSuccess = await logout();   
        
        if(isLoggedOutSuccess){
            
            alert("로그아웃 성공");
            SetisLoggnedIn(false);
            router.push("/");
            
        }else{
            alert("실패");
        }
        
    }

    useEffect(()=>{

        const accessToken = localStorage.getItem("accessToken");
        SetisLoggnedIn(!!accessToken);

    },[]);
    
    return (

        <>
            {isLoggnedIn ? (
                <button onClick={logoutHandle}> 로그아웃</button>
            ) : (
                <Link href = "/login"> 로그인 </Link>
            )}
        </>
        
    );


}