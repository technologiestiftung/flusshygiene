import React, { createContext, useContext, useState } from 'react';

// interface IContextProps {
//   [key: string]: any;
//   children?: any;
//   isHidden?: boolean;
//   toggleBanner?: (event: React.ChangeEvent) => void;
// }

export const BannerContext = createContext([true]);
export const useBanner = () => useContext(BannerContext);
export const BannerProvider = ({ children }) => {
  const [isHidden /*, setIsHidden*/] = useState(false);
  // const toggleBanner = () => {
  //   setIsHidden((prevState) => {
  //     return !prevState;
  //   });
  // };
  return (
    <BannerContext.Provider value={[isHidden]}>
      <div className={`banner ${isHidden === true ? 'is-hidden' : ''}`}>
        {children}
      </div>
    </BannerContext.Provider>
  );
};
