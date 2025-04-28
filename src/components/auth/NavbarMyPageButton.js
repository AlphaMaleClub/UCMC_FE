"use client";

import  Link  from "next/link";
import {useEffect, useState} from "react";

export default function MyPageButton(){

    const [isLoggnedIn, SetisLoggnedIn] = useState(false);

    useEffect(()=>{
        const accessToken = localStorage.getItem("accessToken");

        SetisLoggnedIn(!!accessToken);

    },[]);

    return (
        <>
            {isLoggnedIn ? (
                <Link href = "/logout"> 마이페이지</Link>
            ) : (
                <></>
            )}
        </>
    );

}