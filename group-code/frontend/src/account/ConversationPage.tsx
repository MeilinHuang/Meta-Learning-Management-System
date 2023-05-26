import React, { ChangeEvent, useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link,
    useParams
} from 'react-router-dom';
import AccountService from './AccountService';

import { format } from 'date-fns';
import BadWords from 'bad-words';


export default function ConversationPage(props: any) {
    const [conversation, setConversation] = useState({id: "undefined", conversation_name: "undefined"});
    const [messagList, setMessageList] = useState([]);
    const {id} = useParams();// :id 是这个id
    const [message, setMessage] = useState("");
    const [other, setOther] = useState<string[]>([]);
    const [othername, setOtherName] = useState("");
    const [addUser, setAddUser] = useState(false);
    const [newAddUser, setNewAddUser] = useState("");
    const [usersList, setUsersList] = useState<any[]>([]);

    useEffect(() => {
        if (id != undefined){
            const ids = id.split("_");
            console.log(ids)
            setOtherName(ids.join(' '))
            console.log(ids.join(' '))
        }

        console.log(id) 
        AccountService.getOneConversation({"conversation_name": id})
        .then((response) => {
            setConversation(response.data.conversation);
            setMessageList(response.data.mlist);
            console.log(response.data);

        });

        AccountService.loadUsers()
        .then((response) => {
            console.log('users got: ');
            console.log(response.data);
            // let i = 0;
            console.log(response.data.length);
            setUsersList(response.data);
        })
        .catch((error) => {
            console.log('error');
        });


        
    }, []);



    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const AddUser = () => {
        AccountService.addUserToConversation({"username": newAddUser, "conversation_id":conversation.id})
        .then((response)=>{
            console.log(response.data)
            
        })
        setAddUser(false)
    }

    const handleNewUserChange = (event: ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value)
        setNewAddUser(event.target.value);
        
    }

    const getUsers = (idss: any) => {
        console.log(idss)
        const idsss = idss.split("_");
        const newidss = idss.replace(/_/g, ' ')
        const newidsss = newidss.replace(localStorage.getItem("user_name"), '')
        return newidsss
    }

    return (
        <div className='justify-center gap-4 '>

            <main>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                        <div className="flex justify-between">
                            <Link
                                to={
                                    localStorage.getItem('admin') == 'true' ? '/adminuser' : '/user'
                                }
                                >
                                <span className="inline-flex rounded-md shadow">
                                    <a
                                    href=""
                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-400 hover:bg-gray-50"
                                    >
                                    Back
                                    </a>
                                </span>
                            </Link>
                            <h1 className="text-2xl font-semibold text-gray-900">{getUsers(id)}</h1>
                            <div>
                                <button
                                className={addUser ? "hidden" :'bg-neutral-200  text-neutral-600 h-10 w-10 font-mono text-2xl rounded-md border-solid border-slate-300 hover:bg-neutral-300'}
                                onClick={()=>{
                                    console.log("Add")
                                    setAddUser(true)
                                }}
                                >
                                    +
                                </button>
                                <div className={addUser ? "flex flex-row" : "hidden"}
                                >
                                    
                                    <select id="dropdown" value={newAddUser} onChange={handleNewUserChange}>
                                        {usersList.map((item)=>(
                                            <option value={item.username}>{item.username}</option>
                                        ))}
                                    </select>
                                    <Link
                                    to={
                                        localStorage.getItem('admin') == 'true' ? '/adminuser' : '/user'
                                    }
                                    >
                                        <button
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-400 hover:bg-gray-50"
                                        onClick={()=>{
                                            console.log("Add")
                                            setAddUser(false)
                                            AddUser()
                                        }}
                                        >
                                            apply
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                    {/* Replace with your content */}
                    <div className="py-4">
                        <div className="rounded-lg border-4 border-dashed border-gray-200 ">
                            <div className={"bg-indigo-50 px-3 py-3 sm:grid sm:gap-1 sm:px-2"}>
                                {messagList.map((oneMessage: any, index: number)=>(
                                    <dt key={index}
                                    className={"flex flex-row flex-m-1"}
                                    >
                                        <div>
                                            <div className={'text-indigo-600 text-s'}
                                            >{oneMessage.sender_name}</div>
                                            <div className='text-slate-400 text-2xs'
                                            >{oneMessage.time_created}</div>
                                            <div className='bg-indigo-300 max-w-xl break-words rounded-md p-1'
                                            >{oneMessage.content}</div>
                                            
                                        </div>
                                        
                                    </dt>
                                        
                                    
                                ))}
                            </div>
                            <div 
                                className='flex flex-row gap-4 m-3'
                            >
                                <input 
                                    value={message}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    onChange={handleMessageChange}
                                >
                                </input>
                                <div className='flex flex-col gap-4'>
                                    
                                </div>
                                <button
                                    className='inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-400 hover:bg-gray-50 border-dashed border-gray-200'
                                    onClick={() => {
                                        console.log(message);
                                        const now = new Date();
                                        const nowStr = format(now, "yyyy-MM-dd HH:mm:ss");
                                        const filter = new BadWords();
                                        const param = {"conversation_id": conversation.id, "content": filter.clean(message), "sender_name": localStorage.getItem("user_name"), "time_created": nowStr} 
                                        console.log(filter.clean(message))
                                        AccountService.sendMessage(param)
                                        .then((response:any)=>{
                                            console.log(response.data);
                                            AccountService.getOneConversation({"conversation_name": id})
                                            .then((response) => {
                                                setConversation(response.data.conversation);
                                                setMessageList(response.data.mlist);
                                                console.log(response.data);
                                            });

                                            setMessage("");
                                        })
                                        
                                    }}
                                >
                                    send
                                </button>
                            </div>

                        </div>
                    </div>
                    {/* /End replace */}
                    </div>
                </div>
            </main>

            
            

        </div>
    );
} 
