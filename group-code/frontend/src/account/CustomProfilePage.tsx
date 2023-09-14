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

  const roleToImg = (role: String) => {
      if (role == "Creator") {
        return teacherImg
      } else if (role == "Student") {
        return studentImg
      } else {
        return memberImg;
      }

  }

  const loadMutalRoles = () => {
    const res = [];
    let i = 0;
    var keys = Object.keys(mutalRoles);
    while (i < keys.length) {
      var topics = mutalRoles[keys[i]];
      let j = 0;
      while (j < topics.length) {
        res.push(
          <div className="px-1 justify-center">
            <img
              className="h-7 w-7"
              src={roleToImg(keys[i])}
              alt=""
            />
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {topics[j]}
            </dd>
          </div>
        );
        topics[j]
        j += 1;
      }
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
  }, []);

  return (
    <div>
      <main className="">
        <div className=" py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {user?.username}'s Profile
              </h3>
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
