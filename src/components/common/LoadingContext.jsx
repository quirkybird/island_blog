// LoadingContext.js
import React, { createContext, useState, useContext } from "react";

// 创建 LoadingContext
const LoadingContext = createContext();

// 提供 Loading 状态和操作的方法
export const useLoading = () => useContext(LoadingContext);

// 创建 LoadingProvider
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
