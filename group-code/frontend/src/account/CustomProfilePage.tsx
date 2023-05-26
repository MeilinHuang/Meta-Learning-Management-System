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

export default function CustomProfilePage(props: any) {
  const [sendBlock, setSendBlock] = useState(false);
  const [user, setUser] = useState({
    id: '',
    username: '',
    full_name: '',
    email: '',
    introduction: ''
  });
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

  useEffect(() => {
    console.log(id);
    AccountService.getOneUser({ id: id }).then((response) => {
      setUser(response.data.user);
      console.log(response.data);
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
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.full_name}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.email}
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Introduction
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user.introduction}
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
