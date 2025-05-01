'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

export default function KakaoMap({ onSelectLocation }) {
    const [loaded, setLoaded] = useState(false)
    const markerRef = useRef(null)
    const [coords, setCoords] = useState(null)

    useEffect(() => {
        // 페이지르 떠날시 sessionStorage 삭제
        // beforeunload는 새로고침이 아니라 페이지를 떠나는 자체 만으로도 적용됨
        window.addEventListener('beforeunload', () => {
            sessionStorage.removeItem('selectedCoords')
        })

        //리턴을 하는이유 리스너를 정리 하기 위함,
        //컴포넌트가 언마운트되거나 재실행되기 전에 실행되는 정리 함수
        return () => {
            window.removeEventListener('beforeunload', () => {
                sessionStorage.removeItem('selectedCoords')
            })
        }
    }, [])

    useEffect(() => {

        // 카카오 맵 api가 정상적으로 로드 되었는지 확인하는 조건
        if (!window.kakao || !window.kakao.maps) return

        // 콜백함수 load가 된 후에 아래의 내용을 실행 하라는 것
        window.kakao.maps.load(() => {

            // id가 map이라는 것에 그려질 것이라고 설정
            const container = document.getElementById('map')
            if (!container) return

            // 콘테이너 안의 내용을 지움 왜냐하면 모달을 닫았다가 열면 지도가 깨지거나 겹칠 수 있기에 초기화를 함.
            container.innerHTML = ''

            // sessionStorage에서 좌표 가져오기
            const saved = sessionStorage.getItem('selectedCoords')

            if (saved) {
                const { lat, lng } = JSON.parse(saved)
                createMap(lat, lng)
                setCoords(new window.kakao.maps.LatLng(lat, lng))
            } else {

                //  navigator.geolocation.getCurrentPosition를 통해서 현재 위치 가져오기 (브라우저 지원)
                // 자바스크립트의 표준 api, 브라우저에 내장된 web api
                navigator.geolocation.getCurrentPosition(

                    //position = 콜백 함수 이름
                    (position) => {

                        // 작업이 끝난 후 실행 될 코드
                        const lat = position.coords.latitude
                        const lng = position.coords.longitude
                        createMap(lat, lng)
                        setCoords(new window.kakao.maps.LatLng(lat, lng))
                    },
                    () => {
                        createMap(33.450701, 126.570667)
                        setCoords(new window.kakao.maps.LatLng(33.450701, 126.570667))
                    }
                )
            }

            function createMap(lat, lng) {

                // 지도의 중심 좌표 설정
                const map = new window.kakao.maps.Map(container, {
                    center: new window.kakao.maps.LatLng(lat, lng),
                    level: 3
                })
                // 마커의 설정
                const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(lat, lng),
                    map: map,
                    draggable: true
                })

                //useRef를 사용하면 랜더링과 상관없이 값이 유지됨.
                //drag를 한 이후의 값을 유지 하기 위함
                markerRef.current = marker

                // 마커 드래그가 끝났을 때의 이벤트 리스너
                window.kakao.maps.event.addListener(marker, 'dragend', () => {

                    // 드래그가 끝난 후의 최종 위치를 가져온다.
                    const pos = marker.getPosition()

                    // 주소 변환기 (지오 코더를 생성한다)
                    const geocoder = new window.kakao.maps.services.Geocoder()

                    // 지오 코더를 이용하여 실질적으로 좌표 -> 주소로 변경을 해준다.
                    geocoder.coord2Address(pos.getLng(), pos.getLat(), (result, status) => {
                        if (status === window.kakao.maps.services.Status.OK) {

                            const address = result[0].address.address_name

                            // 좌표 저장
                            const lat = pos.getLat()
                            const lng = pos.getLng()
                            setCoords(new window.kakao.maps.LatLng(lat, lng))
                            sessionStorage.setItem('selectedCoords', JSON.stringify({ lat, lng }))
                        }
                    })
                })
            }
        })
    }, [loaded])

    // 등록 버튼 클릭 시
    const handleRegister = () => {
        const marker = markerRef.current
        if (!marker) return

        const geocoder = new window.kakao.maps.services.Geocoder()
        const pos = marker.getPosition()

        geocoder.coord2Address(pos.getLng(), pos.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {

                const address = result[0].address.address_name
                onSelectLocation(address)

                // 저장
                const lat = pos.getLat()
                const lng = pos.getLng()
                setCoords(new window.kakao.maps.LatLng(lat, lng))
                sessionStorage.setItem('selectedCoords', JSON.stringify({ lat, lng }))
            } else {
                alert('주소를 찾을 수 없습니다.')
            }
        })
    }

    return (
        <>
            <Script
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services`}
                strategy="afterInteractive"
                onLoad={() => setLoaded(true)}
            />

            <div id="map" style={{ width: '100%', height: '400px' }} />

            <div className="flex justify-end items-center gap-2 p-2">
                <button
                    type="button"
                    onClick={handleRegister}
                    className="mt-3 w-25 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                >
                    등록
                </button>
            </div>
        </>
    )
}
