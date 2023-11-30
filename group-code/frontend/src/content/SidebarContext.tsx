// SidebarContext.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';

const DEFAULT_STATE = {
    sidebarOpen: false,
    topicsShow: true,
    adminShow: false,
    materialShow: false,
    conversationShow: false,
    usersShow: false,
    resultShow: false,
    deadlineShow: false,
    assessmentShow: false,
}
interface SidebarContextType {
    sidebarOpen: boolean;
    // setSidebarOpen: (show: boolean) => void;
    toggleSidebar: () => void;
    resetSidebarState: () => void;
    assessmentClick: () => void;
    topicsShow: boolean;
    setTopicsShow: (show: boolean) => void;
    adminShow: boolean;
    setAdminShow: (show: boolean) => void;
    materialShow: boolean;
    setMaterialShow: (show: boolean) => void;
    conversationShow: boolean;
    setConversationShow: (show: boolean) => void;
    usersShow: boolean;
    setUsersShow: (show: boolean) => void;
    resultShow: boolean;
    setResultShow: (show: boolean) => void;
    deadlineShow: boolean;
    setDeadlineShow: (show: boolean) => void;
    assessmentShow: boolean;
    setAssessmentShow: (show: boolean) => void;
    conversationList: any[];
    setConversationList: (show: any[]) => void;
    usersList: any[];
    setUsersList: (show: any[]) => void;
    deadlineList: any[];
    setDeadlineList: (show: any[]) => void;
    resultList: any[];
    setResultList: (show: any[]) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [topicsShow, setTopicsShow] = useState(true);
    const [adminShow, setAdminShow] = useState(false);
    const [materialShow, setMaterialShow] = useState(false);
    const [conversationShow, setConversationShow] = useState(false);
    const [usersShow, setUsersShow] = useState(false);
    const [resultShow, setResultShow] = useState(false);
    const [deadlineShow, setDeadlineShow] = useState(false);
    const [assessmentShow, setAssessmentShow] = useState(false);
    const [conversationList, setConversationList] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [deadlineList, setDeadlineList] = useState<any[]>([]);
    const [resultList, setResultList] = useState<any[]>([]);

    const [sidebarState, setSidebarState] = useState(DEFAULT_STATE);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const resetSidebarState = () => {
        setSidebarState(DEFAULT_STATE);
    };

    const assessmentClick = () => {
        setAssessmentShow(false)
        setTopicsShow(false)
        setAdminShow(false)
        setMaterialShow(false)
        setConversationShow(false)
        setUsersShow(false)
        setResultShow(false)
        setDeadlineShow(false)
    }

    return (
        <SidebarContext.Provider
            value={{
                sidebarOpen,
                toggleSidebar,
                resetSidebarState,
                assessmentClick,
                topicsShow,
                setTopicsShow,
                adminShow,
                setAdminShow,
                materialShow,
                setMaterialShow,
                conversationShow,
                setConversationShow,
                usersShow,
                setUsersShow,
                resultShow,
                setResultShow,
                deadlineShow,
                setDeadlineShow,
                assessmentShow,
                setAssessmentShow,
                conversationList,
                setConversationList,
                usersList,
                setUsersList,
                deadlineList,
                setDeadlineList,
                resultList,
                setResultList
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = (): SidebarContextType => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
