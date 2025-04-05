'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

export default function AddressMapView({ address }) {
    const [loaded, setLoaded] = useState(false)

    const markerRef = useRef(null)

    useEffect(() => {

        if (window.kakao && window.kakao.maps) {

            window.kakao.maps.load(() => {


                const container = document.getElementById('map')
                if (!container) return

                container.innerHTML = '' // 지도가 겹치는 현상 방지

                const geocoder = new window.kakao.maps.services.Geocoder()

                geocoder.addressSearch(address, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const lat = parseFloat(result[0].y)
                        const lng = parseFloat(result[0].x)
                        const coords = new window.kakao.maps.LatLng(lat, lng)

                        const map = new window.kakao.maps.Map(container, {
                            center: coords,
                            level: 3
                        })

                        const marker = new window.kakao.maps.Marker({
                            map,
                            position: coords
                        })

                        markerRef.current = marker
                    } else {
                        alert('주소로 좌표를 찾을 수 없습니다.')
                    }
                })
            })
        }
    }, [loaded, address])

    return (
        <>
            <Script
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services`}
                strategy="afterInteractive"
                onLoad={() => setLoaded(true)}
            />
            <div id="map" style={{width: '100%', height: '400px'}}/>
        </>
    )
}
