import React, { useState, useLayoutEffect } from "react";

export function useMapResizeEffect(mapRef: React.RefObject<HTMLDivElement>) {
  const [mapDimensions, setMapDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 100, height: 100 });

  useLayoutEffect(() => {
    if (mapRef && mapRef.current) {
      const dim = {
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
      };
      setMapDimensions(dim);
    }
    const handleResize = () => {
      if (mapRef && mapRef.current) {
        const dim = {
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetHeight,
        };
        setMapDimensions(dim);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mapRef]);
  return mapDimensions;
}

// export function useMapSizeEffect(mapRef: React.RefObject<HTMLDivElement>) {
//   const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

//   useEffect(() => {});
//   return mapDimensions;
// }
