import { createContext, useState } from 'react';

export const CreditContext = createContext(null);

export const CreditContextProvider = ({ children }) => {
  const [isProductStatus, setIsProductStatus] = useState(false);
  const [keyInfo, setKeyInfo] = useState();
  const [creditCount, setCreditCount] = useState(1000);

  return (
    <CreditContext.Provider
      value={{
        isProductStatus,
        setIsProductStatus,
        keyInfo,
        setKeyInfo,
        creditCount,
        setCreditCount,
      }}>
      {children}
    </CreditContext.Provider>
  );
};
