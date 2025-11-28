import React, { useState, useMemo } from 'react';
import useToiletData from './hooks/useToiletData';
import ToiletMap from './components/MapContainer';

function App() {
  const { toilets, loading, error } = useToiletData();
  const [showPublic, setShowPublic] = useState(true); // 공중화장실
  const [showOpen, setShowOpen] = useState(true); // 개방화장실

  // Filter toilets based on selected types
  const filteredToilets = useMemo(() => {
    // If both are unchecked, show nothing
    if (!showPublic && !showOpen) return [];

    // If both are checked, show all
    if (showPublic && showOpen) return toilets;

    // Otherwise filter by type
    return toilets.filter(toilet => {
      if (showPublic && toilet.seNm && toilet.seNm.includes('공중')) return true;
      if (showOpen && toilet.seNm && toilet.seNm.includes('개방')) return true;
      return false;
    });
  }, [toilets, showPublic, showOpen]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-500">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-500">
        데이터 로드 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      {/* Filter Panel */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h3 className="text-sm font-bold mb-3 text-gray-700">화장실 종류</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showPublic}
              onChange={(e) => setShowPublic(e.target.checked)}
              className="mr-2 w-4 h-4 cursor-pointer"
            />
            <span className="text-sm flex items-center">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#4285F4' }}></span>
              공중화장실
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOpen}
              onChange={(e) => setShowOpen(e.target.checked)}
              className="mr-2 w-4 h-4 cursor-pointer"
            />
            <span className="text-sm flex items-center">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#34A853' }}></span>
              개방화장실
            </span>
          </label>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            표시 중: <span className="font-bold text-gray-700">{filteredToilets.length}</span>개
          </p>
        </div>
      </div>

      <ToiletMap toilets={filteredToilets} />
    </div>
  );
}

export default App;
