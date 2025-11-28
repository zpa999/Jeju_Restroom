import React, { useEffect, useRef } from 'react';

const ToiletMap = ({ toilets }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const currentInfoWindowRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const initializeMap = () => {
            if (!window.kakao || !window.kakao.maps) return;

            window.kakao.maps.load(() => {
                const kakao = window.kakao;

                if (!mapInstanceRef.current) {
                    const container = mapRef.current;
                    const options = {
                        center: new kakao.maps.LatLng(33.4996, 126.5312),
                        level: 9
                    };
                    mapInstanceRef.current = new kakao.maps.Map(container, options);
                }

                const map = mapInstanceRef.current;

                markersRef.current.forEach(marker => marker.setMap(null));
                markersRef.current = [];

                toilets.forEach((toilet) => {
                    const lat = parseFloat(toilet.laCrdnt);
                    const lng = parseFloat(toilet.loCrdnt);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        const markerPosition = new kakao.maps.LatLng(lat, lng);

                        let markerColor = '#4285F4';
                        if (toilet.seNm && toilet.seNm.includes('개방')) {
                            markerColor = '#34A853';
                        }

                        const markerImageSrc = `data:image/svg+xml;base64,${btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
                                <path d="M15 0C8.373 0 3 5.373 3 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z" 
                                      fill="${markerColor}" stroke="white" stroke-width="2"/>
                                <circle cx="15" cy="12" r="4" fill="white"/>
                            </svg>
                        `)}`;

                        const markerImageSize = new kakao.maps.Size(30, 40);
                        const markerImageOption = { offset: new kakao.maps.Point(15, 40) };
                        const markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);

                        const marker = new kakao.maps.Marker({
                            position: markerPosition,
                            image: markerImage
                        });
                        marker.setMap(map);

                        // Prepare photo gallery HTML (only 2 photos) - photo is an ARRAY
                        let photoGalleryHTML = '';
                        if (toilet.photo && Array.isArray(toilet.photo) && toilet.photo.length > 0) {
                            const photos = toilet.photo.slice(0, 2);
                            const photoItems = photos.map(url =>
                                `<img src="${url}" 
                                     alt="화장실 사진" 
                                     style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; cursor: pointer;"
                                     onclick="window.open('${url}', '_blank')"
                                     onerror="this.style.display='none'">`
                            ).join('');

                            photoGalleryHTML = `
                                <div style="margin-bottom: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                                    ${photoItems}
                                </div>
                            `;
                        }

                        const infowindow = new kakao.maps.InfoWindow({
                            content: `
                                <div style="padding: 16px; min-width: 340px; max-width: 380px; position: relative;">
                                    <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" 
                                            style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999; padding: 0; width: 28px; height: 28px; line-height: 24px; border-radius: 50%; transition: all 0.2s;"
                                            onmouseover="this.style.backgroundColor='#f0f0f0'; this.style.color='#333';"
                                            onmouseout="this.style.backgroundColor='transparent'; this.style.color='#999';"
                                            title="닫기">
                                        ×
                                    </button>
                                    <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #4285F4; padding-bottom: 10px; padding-right: 35px;">
                                        ${toilet.toiletNm}
                                    </h3>
                                    ${photoGalleryHTML}
                                    <div style="margin-bottom: 10px;">
                                        <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                                            📍 ${toilet.rnAdres || toilet.lnmAdres}
                                        </p>
                                    </div>
                                    <div style="font-size: 13px; color: #555; line-height: 2;">
                                        <div style="margin-bottom: 5px;">🏷️ <strong>종류:</strong> ${toilet.seNm}</div>
                                        <div style="margin-bottom: 5px;">🕒 <strong>운영시간:</strong> ${toilet.opnTimeInfo}</div>
                                        <div style="margin-bottom: 5px;">📞 <strong>전화:</strong> ${toilet.telno || '없음'}</div>
                                        <div>🏢 <strong>관리:</strong> ${toilet.mngrInsttNm}</div>
                                    </div>
                                </div>
                            `
                        });

                        kakao.maps.event.addListener(marker, 'click', function () {
                            if (currentInfoWindowRef.current === infowindow) {
                                infowindow.close();
                                currentInfoWindowRef.current = null;
                            } else {
                                if (currentInfoWindowRef.current) {
                                    currentInfoWindowRef.current.close();
                                }
                                infowindow.open(map, marker);
                                currentInfoWindowRef.current = infowindow;
                            }
                        });

                        markersRef.current.push(marker);
                    }
                });
            });
        };

        if (window.kakao && window.kakao.maps) {
            initializeMap();
        } else {
            const checkKakao = setInterval(() => {
                if (window.kakao && window.kakao.maps) {
                    clearInterval(checkKakao);
                    initializeMap();
                }
            }, 100);

            return () => clearInterval(checkKakao);
        }

    }, [toilets]);

    return (
        <div
            ref={mapRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        />
    );
};

export default ToiletMap;
