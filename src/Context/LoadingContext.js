import React, { useState, createContext } from 'react';
export const LoadingContext = createContext({});
export const LoadingProvider = ({ children }) => {
const [loading, setLoading] = useState(null);
return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
        {children}
        </LoadingContext.Provider>
        );
}