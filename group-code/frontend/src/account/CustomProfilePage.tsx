import { Verify } from 'crypto';
import React, {
  ChangeEvent,
  MouseEventHandler,
  FC,
  useState,
  useEffect
} from 'react';
import { isPropertySignature } from 'typescript';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate
} from 'react-router-dom';
import AccountService from './AccountService';
import { format } from 'date-fns';

import { PaperClipIcon } from '@heroicons/react/20/solid';
import { parseDateString } from 'react-ymd-date-select/dist/cjs/date-string';
import { parse } from 'path';
import memberImg from '../Icons/member.png';
import studentImg from '../Icons/student.png';
import teacherImg from '../Icons/teacher.png';
import forumStaffImg from '../Icons/forumStaff.png'

export default function CustomProfilePage(props: any) {
  const [sendBlock, setSendBlock] = useState(false);
  const [user, setUser] = useState({
    id: '',
    username: '',
    full_name: '',
    email: '',
    introduction: '',
    profilePic: ''
  });

  const [activityStatus, setActivityStatus] = useState({status:'Offline', delta:-1});
  const [statusColour, setStatusColour] = useState(" text-gray-500")
  const [mutalRoles, setMutalRoles] = useState({});
  const { id } = useParams(); // :id 是这个id
  const [conversation_name, setConversation_name] = useState('');
  const navigate = useNavigate();

  const sendOrProfile = () => {
    if (sendBlock) {
      setSendBlock(false);
    } else {
      setSendBlock(true);
    }
  };

  const roleToImg = (role: string) => {
      if (role == "Creator") {
        return teacherImg;
      } else if (role == "Student") {
        return studentImg;
      } else if (role == "Forum Staff") {
        return forumStaffImg;
      } else {
        return memberImg;
      }

  }

  const loadMutalRoles = () => {
    const res = [];
    let i = 0;
    const keys = Object.keys(mutalRoles);
    while (i < keys.length) {
      const topics = mutalRoles[keys[i]];
      let roleName = keys[i]
      if (roleName == null || roleName == "null") {
        roleName = "Member"
      }
      const roleText = `${roleName} in ${topics.join(', ')}.`; 
      res.push(
        <div className="px-1 flex">
          <img
            className="h-7 w-7"
            src={roleToImg(keys[i])}
            alt=""
          />
          <dd className="mt-1.5 text-sm text-gray-900 sm:col-span-2 sm:mt-0 ml-2">
            {roleText}
          </dd>
        </div>
      );
      i += 1;
    }
    return res;
  };


  useEffect(() => {
    console.log(id);
    AccountService.getOneUser({ 
      id: id,
      access_token: localStorage.getItem('access_token') 
    }).then((response) => {
      setUser(response.data.user);
      console.log(response.data);
    });

    AccountService.mutalTopicsRoless({
      id2: id,
      access_token: localStorage.getItem('access_token') 
    }).then((response) => {
      setMutalRoles(response.data);
    });

    AccountService.activityStatus({
      id: id
    }).then((response) => {
      setActivityStatus(response.data);
      if (response.data) {
        if (response.data.status == "Online") {
          setStatusColour(" bg-green-500");
        } else if (response.data.status == "Away") {
          setStatusColour(" bg-orange-500");
        } else {
          setStatusColour(" bg-gray-500");
        }
      }
    })
  }, []);


  return (
    <div>
      <main className="">
        <div className=" py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="px-4 py-5 sm:px-6">
              <div className ="flex">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {user?.username}'s Profile
                </h3>
                <dd className={"w-4 h-4 rounded-full ml-2 mt-1" + statusColour}></dd>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className={
                  (user.full_name != "")
                  ? "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                }
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.full_name}
                  </dd>
                </div>
                <div className={
                  (user.email != "")
                  ? "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                }
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.email}
                  </dd>
                </div>

                <div className={
                  (user.introduction != "")
                  ? "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                }
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Introduction
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.introduction}
                  </dd>
                </div>
                <div className={
                  (user.profilePic != "")
                  ? "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                }
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Profile Picture
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={user.profilePic}
                      alt=""
                    />
                  </dd>
                </div>
                <div className={
                  (Object.keys(mutalRoles).length != 0)
                  ? "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                }
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Mutal Roles
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex">
                    
                    {loadMutalRoles()}
        
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
>
                  <dt className="text-sm font-medium text-gray-500">
                    Activity status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex">
                    <dd>
                      {activityStatus.status}
                    </dd>
                  </dd>
                </div>
              </dl>
            </div>
            <div className='flex flex-row-reverse'>
              <button
              className="mt-6 flex basis-1/8 justify-center rounded-md border border-transparent bg-indigo-300 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
              onClick={() => {
                sendOrProfile();
                const param = {
                  sender: localStorage.getItem('user_name'),
                  sender_id: parseInt(
                    localStorage.getItem('user_id') as string
                  ),
                  receiver: user.username,
                  receiver_id: user.id
                };
                AccountService.createConversation(param)
                  .then((response: any) => {
                    console.log(response);
                    setConversation_name(response.data.conversation_name);

                    console.log(`/details/${response.data.conversation_name}`);
                    navigate(`/details/${response.data.conversation_name}`);
                  })
                  .catch((error: any) => {
                    console.log(error);
                  });
              }}
              >
                leave message
              </button>
            </div>
            
            {/* /End replace */}
          </div>
        </div>
      </main>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg"></div>
    </div>
  );
}
