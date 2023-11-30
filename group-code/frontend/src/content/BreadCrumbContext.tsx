// BreadcrumbContext.js
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface BreadcrumbContextType {
    breadcrumbHistory: { name: string; path: string }[];
    setBreadcrumbHistory: (show: { name: string; path: string }[]) => void;
    updateBreadcrumb: (show: { name: string; path: string }[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<({ children: ReactNode })> = ({children}) => {
    const [breadcrumbHistory, setBreadcrumbHistory] = useState([
        { name: "", path: "" }
    ]);

    const updateBreadcrumb = (newBreadcrumb: {name: string, path:string}[]) => {
        setBreadcrumbHistory(newBreadcrumb);
    };

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbHistory, setBreadcrumbHistory, updateBreadcrumb }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
    }
    return context;
};
