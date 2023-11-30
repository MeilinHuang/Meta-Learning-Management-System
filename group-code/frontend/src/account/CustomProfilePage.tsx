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
import forumStaffImg from '../Icons/forumStaff.png';
import defaultImg from '../default.jpg';

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

  const [activityStatus, setActivityStatus] = useState({
    status: 'Offline',
    delta: -1,
    details: ''
  });

  const [statusColour, setStatusColour] = useState(' bg-gray-500');
  const [mutualRoles, setMutualRoles] = useState<{ [key: string]: any }>({});
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
    if (role == 'Creator') {
      return teacherImg;
    } else if (role == 'Student') {
      return studentImg;
    } else if (role == 'Forum Staff') {
      return forumStaffImg;
    } else {
      return memberImg;
    }
  };

  const loadMutualRoles = () => {
    const res = [];
    let i = 0;
    const keys = Object.keys(mutualRoles);
    while (i < keys.length) {
      const topics = mutualRoles[keys[i]];
      let roleName = keys[i];
      if (roleName == null || roleName == 'null') {
        roleName = 'Member';
      }
      const roleText = `${roleName} in ${topics.join(', ')}.`;
      res.push(
        <div className="px-1 flex">
          <img className="h-7 w-7" src={roleToImg(keys[i])} alt="" />
          <dd className="mt-1.5 text-sm text-gray-900 sm:col-span-2 sm:mt-0 ml-2">
            {roleText}
          </dd>
        </div>
      );
      i += 1;
    }
    return res;
  };

  const loadOneRole = () => {
    const keys = Object.keys(mutualRoles);
    if (keys.includes('Creator')) {
      return 'Creator';
    } else if (keys.includes('Forum Staff')) {
      return 'Forum Staff';
    } else if (keys.includes('Student')) {
      return 'Student';
    } else if (keys.length > 0) {
      return 'Member';
    }
    return 'User';
  };

  useEffect(() => {
    console.log(id);
    AccountService.getOneUser({
      id: id,
      access_token: localStorage.getItem('access_token')
    }).then((response) => {
      setUser(response.data.user);
      // console.log(response.data);
    });

    AccountService.mutualTopicRoles({
      id2: id,
      access_token: localStorage.getItem('access_token')
    }).then((response) => {
      setMutualRoles(response.data);
    });

    AccountService.activityStatus({
      id: id
    }).then((response) => {
      console.log(response.data);
      setActivityStatus(response.data);
      if (response.data) {
        if (response.data.status == 'Online') {
          setStatusColour(' bg-green-500');
        } else if (response.data.status == 'Away') {
          setStatusColour(' bg-orange-500');
        } else {
          setStatusColour(' bg-gray-500');
        }
      }
      console.log(statusColour);
    });
  }, []);

  const getProfilePic = () => {
    const dp = user.profilePic;
    if (dp != '' && dp != null) {
      return dp;
    }
    return defaultImg;
  };

  return (
    <div>
      <main className="">
        <div className=" py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="ml-4 mt-4">
              <div className="bg-indigo-100 shadow sm:rounded-t-lg w-full flex flex-col items-center mb-1">
                <div
                  className={'w-full h-4 shadow sm:rounded-t-lg' + statusColour}
                ></div>
                <img
                  className="h-12 w-12 rounded-full mt-4 justify-center"
                  src={getProfilePic()}
                  alt=""
                />
                <div className="justify-center font-medium text-lg">
                  {user?.username}
                </div>
                <div className="justify-center font-thin text-sm text-indigo-600 mb-2">
                  {loadOneRole()}
                </div>
              </div>
            </div>
            <div className="divide-solid flex">
              <dl>
                <div
                  className={
                    user.full_name != ''
                      ? 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
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
                <div
                  className={
                    user.email != ''
                      ? 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
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

                <div
                  className={
                    user.introduction != ''
                      ? 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
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
                <div
                  className={
                    Object.keys(mutualRoles).length != 0
                      ? 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
                      : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                  }
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Mutual Roles
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex">
                    {loadMutualRoles()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Activity status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex">
                    {activityStatus.status}
                  </dd>
                </div>
                <div
                  className={
                    activityStatus.details != ''
                      ? 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
                      : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                  }
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Recent Activity
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex">
                    {activityStatus.details}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-row-reverse">
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

                      console.log(
                        `/details/${response.data.conversation_name}`
                      );
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
