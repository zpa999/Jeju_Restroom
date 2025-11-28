import React from 'react';

const RestroomList = ({ toilets, onClick }) => {
    return (
        <div className="h-full overflow-y-auto p-4">
            <h2 className="text-xl font-bold mb-4">화장실 목록 ({toilets.length})</h2>
            <ul className="list-none p-0 m-0">
                {toilets.map((toilet, index) => (
                    <li
                        key={index}
                        className="border-b border-gray-200 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => onClick && onClick(toilet)}
                    >
                        <h3 className="m-0 mb-1 text-base font-semibold text-gray-800">{toilet.toiletNm}</h3>
                        <p className="m-0 text-sm text-gray-500">{toilet.rnAdres || toilet.lnmAdres}</p>
                        <div className="mt-1 text-sm text-gray-600 flex items-center gap-3">
                            <span>🕒 {toilet.opnTimeInfo}</span>
                            <span>📞 {toilet.telno || '-'}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestroomList;
