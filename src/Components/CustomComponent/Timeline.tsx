import React from "react";
const Timeline = () => {
    const viewEdit=()=>{

    }
  return (
    <>
      <div>
        <div className="w-[12vw] ml-7 p-1 bg-black rounded-lg flex">
          <div>
            <h2 className="text-lg font-bold text-white">B45</h2>
            <p className="text-[0.6rem] tracking-tighter text-white">
              Suncatcher
            </p>
            <p className="text-xs tracking-tighter text-white mt-2">GPS Cordinates:</p>
            <p className="text-xs tracking-tighter text-white">38 21.806   144 44.959</p>
          </div>
          <div className="text-xs tracking-tighter text-white">
            <p className="bg-gray-300 text-black  cursor-pointer" onClick={viewEdit}>View/edit</p>
            <p className="mt-1">ID:#4645</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timeline;
