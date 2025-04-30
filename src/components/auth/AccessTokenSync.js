'use client';

/*
    해당 컴포넌트는 로직형 컴포넌트입니다.
    어떤 페이지로 가던간에 이게 실행됩니다.
    로그인 수행 이후에 원래 있던 곳으로 리디렉션 시키면 쿠키를 파싱시켜주는 로직이 필요하기에 이렇게 처리했습니다.
    아래의 accessToken을 재지정해주는 것은 문자열을 비우게 하고 과거에 만료시켜 끝내버리는 역할을 합니다
*/

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AccessTokenSync() {
  
  const pathname = usePathname();


  useEffect(() => {

    const cookieString = document.cookie;
    const existAccessToken = localStorage.getItem("accessToken");

    

    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (token) {

      localStorage.setItem("accessToken", token);
      
      
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    }

    
    localStorage.setItem("isAuthenticated", existAccessToken ? "true" : "false");
    
    



  }, [pathname]);

  return null; // 렌더링 안함
}