import { Fragment, useEffect, useState } from 'react';
import {
    Bars3BottomLeftIcon,
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    UsersIcon,
    XMarkIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AccountService from '../account/AccountService';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from 'content/SidebarContext';
import AssessmentIcon from '../assets/check-list.png'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

// export default function Sidebar({ isOpened }: { isOpened: boolean }) {
export default function Sidebar() {
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    // const [topicsShow, setTopicsShow] = useState(true);
    // const [materialShow, setMaterialShow] = useState(false);
    // const [conversationShow, setConversationShow] = useState(false);
    // const [usersShow, setUsersShow] = useState(false);
    // const [adminShow, setAdminShow] = useState(false);
    const [friendsList, setFriendsList] = useState<any[]>([]);
    // const [usersList, setUsersList] = useState<any[]>([]);
    const [addAdmin, setAddAdmin] = useState(false);
    // const [assessmentShow, setAssessmentShow] = useState(false);
    const [deleteAdmin, setDeleteAdmin] = useState(false);
    const [selectedList, setSelectedUsersList] = useState<number[]>([]);
    const [adminList, setAdminList] = useState<any[]>([]);
    const [nonAdminList, setNonAdminList] = useState<any[]>([]);
    const [detail1, setDetail1] = useState(false);
    const [detail2, setDetail2] = useState(false);
    const location = useLocation();

    // const handleSidebarToggleButton = () => {
    //     setSidebarOpen(!sidebarOpen)
    // }

    const {
        sidebarOpen,
        toggleSidebar,
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
        setResultList } = useSidebar();

    const navigate = useNavigate()
    const routeChange = (path: To) => {
        //let path = `newPath`;
        navigate(path);
    };
    return (
        <>
            <div>
                {
                    sidebarOpen
                        ?
                        <>
                            {localStorage.getItem("admin") === null &&
                                <div className="flex flex-1 flex-col overflow-y-auto border-r-2 pt-5 h-screen top-16 left-0 fixed w-60 bg-white">
                                    <div className="flex flex-1 flex-col space-y-10 px-2 pb-4">
                                        <button>
                                            <div className={
                                                topicsShow
                                                    ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                    : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                onClick={() => {
                                                    setTopicsShow(true);
                                                    setAdminShow(false);
                                                    setConversationShow(false);
                                                    setUsersShow(false);
                                                    setMaterialShow(false);
                                                    routeChange("/adminuser")
                                                }}
                                            >
                                                <HomeIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                Dashboard
                                            </div>
                                        </button>
                                        <button>
                                            <div className={
                                                conversationShow
                                                    ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                    : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                onClick={() => {
                                                    const param = { id: localStorage.getItem('user_id') };

                                                    AccountService.getConversations(param)
                                                        .then((response) => {
                                                            console.log('users got: ');
                                                            console.log(response.data);
                                                            localStorage.setItem('friends', response.data);
                                                            console.log(response.data.length);
                                                            setFriendsList(response.data.friends);
                                                        })
                                                        .catch((error) => {
                                                            console.log('error');
                                                        });
                                                    setTopicsShow(false);
                                                    setAdminShow(false);
                                                    setConversationShow(true);
                                                    setUsersShow(false);
                                                    setMaterialShow(false);
                                                    routeChange("/adminuser")
                                                }}
                                            >
                                                <ChatBubbleBottomCenterTextIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                Message
                                            </div>
                                        </button>
                                        <button>
                                            <div className={
                                                usersShow
                                                    ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                    : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                onClick={() => {
                                                    AccountService.loadUsers({ search: '@' })
                                                        .then((response) => {
                                                            // console.log('users got: ');
                                                            // console.log(response.data);
                                                            // let i = 0;
                                                            // console.log(response.data.length);
                                                            setUsersList(response.data);
                                                        })
                                                        .catch((error) => {
                                                            console.error('error');
                                                        });
                                                    setTopicsShow(false);
                                                    setAdminShow(false);
                                                    setConversationShow(false);
                                                    setUsersShow(true);
                                                    setMaterialShow(false);
                                                    routeChange("/adminuser")
                                                }}
                                            >
                                                <UsersIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                Users
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            }
                            {localStorage.getItem("admin") === "true" &&
                                (
                                    <div className="flex flex-1 flex-col overflow-y-auto border-r-2 pt-5 h-screen top-16 left-0 fixed w-60 bg-white">
                                        <div className="flex flex-1 flex-col space-y-10 px-2 pb-4">
                                            <button>
                                                <div className={
                                                    topicsShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        setTopicsShow(true);
                                                        setAdminShow(false);
                                                        setConversationShow(false);
                                                        setUsersShow(false);
                                                        setMaterialShow(false);
                                                        routeChange("/adminuser")
                                                    }}
                                                >
                                                    <HomeIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Dashboard
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    materialShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        setTopicsShow(false);
                                                        setAdminShow(false);
                                                        setConversationShow(false);
                                                        setUsersShow(false);
                                                        setMaterialShow(true);
                                                        routeChange("/adminuser")
                                                    }}
                                                >
                                                    <FolderIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Resources
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    adminShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        AccountService.loadUsers({ search: '@' })
                                                            .then((response) => {
                                                                // console.log('users got: ');
                                                                // console.log(response.data);
                                                                // let i = 0;
                                                                // console.log(response.data.length);
                                                                setUsersList(response.data);
                                                            })
                                                            .catch((error) => {
                                                                console.error('error');
                                                            });
                                                        setTopicsShow(false);
                                                        setAdminShow(true);
                                                        setConversationShow(false);
                                                        setUsersShow(false);
                                                        setMaterialShow(false);
                                                        routeChange("/adminuser")
                                                    }}
                                                >
                                                    <ManageAccountsOutlinedIcon sx={{ height: 32, width: 32, stroke: "white", strokeWidth: 0.5, marginRight: 1 }} className='flex-shrink-0' aria-hidden="true" />
                                                    Admin
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    conversationShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        const param = { id: localStorage.getItem('user_id') };

                                                        AccountService.getConversations(param)
                                                            .then((response) => {
                                                                console.log('users got: ');
                                                                console.log(response.data);
                                                                localStorage.setItem('friends', response.data);
                                                                console.log(response.data.length);
                                                                setFriendsList(response.data.friends);
                                                            })
                                                            .catch((error) => {
                                                                console.log('error');
                                                            });
                                                        setTopicsShow(false);
                                                        setAdminShow(false);
                                                        setConversationShow(true);
                                                        setUsersShow(false);
                                                        setMaterialShow(false);
                                                        routeChange("/adminuser")
                                                    }}
                                                >
                                                    <ChatBubbleBottomCenterTextIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Message
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    usersShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        AccountService.loadUsers({ search: '@' })
                                                            .then((response) => {
                                                                // console.log('users got: ');
                                                                // console.log(response.data);
                                                                // let i = 0;
                                                                // console.log(response.data.length);
                                                                setUsersList(response.data);
                                                            })
                                                            .catch((error) => {
                                                                console.error('error');
                                                            });
                                                        setTopicsShow(false);
                                                        setAdminShow(false);
                                                        setConversationShow(false);
                                                        setUsersShow(true);
                                                        setMaterialShow(false);
                                                        routeChange("/adminuser")
                                                    }}
                                                >
                                                    <UsersIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Users
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                            {localStorage.getItem("admin") === "false" &&
                                (
                                    <div className="flex flex-1 flex-col overflow-y-auto border-r-2 pt-5 h-screen top-16 left-0 fixed w-60 bg-white">
                                        <div className="flex flex-1 flex-col space-y-10 px-2 pb-4">
                                            <button>
                                                <div className={
                                                    topicsShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        setTopicsShow(true);
                                                        setDeadlineShow(false);
                                                        setConversationShow(false);
                                                        setResultShow(false)
                                                        setUsersShow(false)
                                                        routeChange("/user")
                                                    }}
                                                >
                                                    <HomeIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Dashboard
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    deadlineShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        setTopicsShow(false);
                                                        setDeadlineShow(true);
                                                        setConversationShow(false);
                                                        setResultShow(false)
                                                        setUsersShow(false)
                                                        routeChange("/user")
                                                    }}
                                                >
                                                    <CalendarIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Deadlines
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    conversationShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        const param = { id: localStorage.getItem('user_id') };

                                                        AccountService.getConversations(param)
                                                            .then((response) => {
                                                                console.log('users got: ');
                                                                console.log(response.data);
                                                                localStorage.setItem('friends', response.data);
                                                                console.log(response.data.length);
                                                                setConversationList(response.data.friends);
                                                            })
                                                            .catch((error) => {
                                                                console.log('error');
                                                            });
                                                        setTopicsShow(false);
                                                        setDeadlineShow(false);
                                                        setConversationShow(true);
                                                        setResultShow(false);
                                                        setUsersShow(false)
                                                        routeChange("/user")
                                                    }}
                                                >
                                                    <ChatBubbleBottomCenterTextIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Message
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    resultShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        setTopicsShow(false);
                                                        setDeadlineShow(false);
                                                        setConversationShow(false);
                                                        setResultShow(true);
                                                        setUsersShow(false)
                                                        routeChange("/user")
                                                    }}
                                                >
                                                    <ChartBarIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Results
                                                </div>
                                            </button>
                                            <button>
                                                <div className={
                                                    usersShow
                                                        ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'
                                                        : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 text-sm font-medium rounded-md'}
                                                    onClick={() => {
                                                        setTopicsShow(false);
                                                        setDeadlineShow(false);
                                                        setConversationShow(false);
                                                        setResultShow(false);
                                                        setUsersShow(true);
                                                        routeChange('/user');
                                                    }}
                                                >
                                                    <UsersIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                                    Users
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                        :
                        <>
                            {localStorage.getItem("admin") === null &&
                                <div className="flex flex-1 flex-col overflow-y-auto border-r-2 pt-5 h-screen top-16 left-0 fixed w-16 bg-white">
                                    <div className="flex-1 flex-col space-y-10 px-2 pb-4">
                                        <button className={
                                            topicsShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(true);
                                                setAdminShow(false);
                                                setConversationShow(false);
                                                setUsersShow(false);
                                                setMaterialShow(false);
                                                routeChange("/adminuser")
                                            }}>
                                            <HomeIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            conversationShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                const param = { id: localStorage.getItem('user_id') };

                                                AccountService.getConversations(param)
                                                    .then((response) => {
                                                        console.log('users got: ');
                                                        console.log(response.data);
                                                        localStorage.setItem('friends', response.data);
                                                        console.log(response.data.length);
                                                        setFriendsList(response.data.friends);
                                                    })
                                                    .catch((error) => {
                                                        console.log('error');
                                                    });
                                                setTopicsShow(false);
                                                setAdminShow(false);
                                                setConversationShow(true);
                                                setUsersShow(false);
                                                setMaterialShow(false);
                                                routeChange("/adminuser")
                                            }}>
                                            <ChatBubbleBottomCenterTextIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            usersShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(false);
                                                setAdminShow(false);
                                                setConversationShow(false);
                                                setUsersShow(true);
                                                setMaterialShow(false);
                                                routeChange("/adminuser")
                                            }}>
                                            <UsersIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            }
                            {localStorage.getItem("admin") === "true" &&
                                <div className="flex flex-1 flex-col overflow-y-auto border-r-2 pt-5 h-screen top-16 left-0 fixed w-16 bg-white">
                                    <div className="flex-1 flex-col space-y-10 px-2 pb-4">
                                        <button className={
                                            topicsShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(true);
                                                setAdminShow(false);
                                                setConversationShow(false);
                                                setUsersShow(false);
                                                setMaterialShow(false);
                                                routeChange("/adminuser")
                                            }}>
                                            <HomeIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            materialShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(false);
                                                setAdminShow(false);
                                                setConversationShow(false);
                                                setUsersShow(false);
                                                setMaterialShow(true);
                                                routeChange("/adminuser")
                                            }}>
                                            <FolderIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            adminShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center px-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center px-2 py-1 rounded-md'}
                                            onClick={() => {
                                                AccountService.loadUsers({ search: '@' })
                                                    .then((response) => {
                                                        // console.log('users got: ');
                                                        // console.log(response.data);
                                                        // let i = 0;
                                                        // console.log(response.data.length);
                                                        setUsersList(response.data);
                                                    })
                                                    .catch((error) => {
                                                        console.error('error');
                                                    });
                                                setTopicsShow(false);
                                                setAdminShow(true);
                                                setConversationShow(false);
                                                setUsersShow(false);
                                                setMaterialShow(false);
                                                routeChange("/adminuser")
                                            }}>
                                            <ManageAccountsOutlinedIcon sx={{ height: 32, width: 32, stroke: "white", strokeWidth: 0.5 }} className='flex-shrink-0' aria-hidden="true" />

                                        </button>
                                        <button className={
                                            conversationShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                const param = { id: localStorage.getItem('user_id') };

                                                AccountService.getConversations(param)
                                                    .then((response) => {
                                                        console.log('users got: ');
                                                        console.log(response.data);
                                                        localStorage.setItem('friends', response.data);
                                                        console.log(response.data.length);
                                                        setFriendsList(response.data.friends);
                                                    })
                                                    .catch((error) => {
                                                        console.log('error');
                                                    });
                                                setTopicsShow(false);
                                                setAdminShow(false);
                                                setConversationShow(true);
                                                setUsersShow(false);
                                                setMaterialShow(false);
                                                routeChange("/adminuser")
                                            }}>
                                            <ChatBubbleBottomCenterTextIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            usersShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(false);
                                                setAdminShow(false);
                                                setConversationShow(false);
                                                setUsersShow(true);
                                                setMaterialShow(false);
                                                routeChange("/adminuser")
                                            }}>
                                            <UsersIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            }
                            {localStorage.getItem("admin") === "false" &&
                                <div className="flex flex-1 flex-col overflow-y-auto border-r-2 pt-5 h-screen top-16 left-0 fixed w-16 bg-white">
                                    <div className="flex-1 flex-col space-y-10 px-2 pb-4">
                                        <button className={
                                            topicsShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(true);
                                                setDeadlineShow(false);
                                                setConversationShow(false);
                                                setResultShow(false);
                                                setUsersShow(false)
                                                routeChange("/user")
                                            }}>
                                            <HomeIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            deadlineShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(false);
                                                setDeadlineShow(true);
                                                setConversationShow(false);
                                                setResultShow(false);
                                                setUsersShow(false)
                                                routeChange("/user")
                                            }}>
                                            <CalendarIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            conversationShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                const param = { id: localStorage.getItem('user_id') };

                                                AccountService.getConversations(param)
                                                    .then((response) => {
                                                        console.log('users got: ');
                                                        console.log(response.data);
                                                        localStorage.setItem('friends', response.data);
                                                        console.log(response.data.length);
                                                        setConversationList(response.data.friends);
                                                    })
                                                    .catch((error) => {
                                                        console.log('error');
                                                    });
                                                setTopicsShow(false);
                                                setDeadlineShow(false);
                                                setConversationShow(true);
                                                setResultShow(false);
                                                setUsersShow(false)
                                                routeChange("/user")
                                            }}>
                                            <ChatBubbleBottomCenterTextIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            resultShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(false);
                                                setDeadlineShow(false);
                                                setConversationShow(false);
                                                setResultShow(true);
                                                setUsersShow(false)
                                                routeChange("/user")
                                            }}>
                                            <ChartBarIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                        <button className={
                                            usersShow
                                                ? 'bg-slate-200 text-indigo-700 group flex flex-row items-center pl-2 py-1 text-sm font-medium rounded-md'
                                                : 'bg-white text-black hover:bg-slate-200 group flex flex-row items-center pl-2 py-1 text-sm font-medium rounded-md'}
                                            onClick={() => {
                                                setTopicsShow(false);
                                                setDeadlineShow(false);
                                                setConversationShow(false);
                                                setResultShow(false);
                                                setUsersShow(true);
                                                routeChange('/user');
                                            }}>
                                            <UsersIcon className='h-8 w-8 flex-shrink-0 mr-2' aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            }
                        </>
                }

                <div className='h-screen flex items-start'>
                    <button className='rounded-r-lg border-2 border-slate-200 bg-white hover:bg-indigo-700' onClick={toggleSidebar}>
                        <ChevronDoubleRightIcon className={`h-6 w-4 hover:text-white ${sidebarOpen ? 'ml-60' : 'ml-16'}`}></ChevronDoubleRightIcon>
                    </button>
                </div>

            </div>

        </>
    )
}