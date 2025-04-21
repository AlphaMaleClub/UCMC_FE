import { useState } from "react";

export default function Dropdown({ options, selected, onChange ,status}) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value) => {
        onChange(value);
        setOpen(false);
    };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
             {/*선택된 항목 */}
            <div
                onClick={() => setOpen(!open)}
                className=" p-1 border-1 border-gray-400 hover:font-bold cursor-pointer rounded-xl text-xs w-22 h-7 flex justify-center items-center"

            >
                {selected ? options[selected] : status }
            </div>

            {/* 드롭다운 목록 */}
            {open && (
                <div
                    className="absolute mt-1 border border-gray-400  rounded-xl  text-xs w-22 flex flex-col items-center bg-white shadow z-50"
                    style={{top: '100%', left: 0}}
                >
                    {Object.entries(options).map(([key, label]) => (
                        <div
                            key={key}
                            onClick={() => handleSelect(key)}
                            className="p-2 cursor-pointer hover:bg-gray-200 w-full h-full rounded-xl hover:font-bold border-gray-400 flex items-center justify-center"
                        >
                            {label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
