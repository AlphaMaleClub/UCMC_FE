/*
    이 파일은 라우팅 되는 페이지마다 user의 권한을 체크해서 권한이 없는유저가 실수로 페이지에 들어와 상호작용을 막고자
    만든 훅 입니다. 모든 page.js에 추가하여 사용되면 되겠습니다. 
*/

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAccessGuard({ requireLogin }) {

  const router = useRouter();

  useEffect(() => {

    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = !!accessToken;

    if (requireLogin && !isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }

    if (!requireLogin && isLoggedIn) {
      alert("이미 로그인된 상태입니다.");
      router.push("/");
    }
    
  }, [requireLogin, router]);

}