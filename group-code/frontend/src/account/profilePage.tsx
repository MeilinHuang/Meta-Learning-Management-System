import { Verify } from 'crypto';
import React, { ChangeEvent, MouseEventHandler, FC, useState } from 'react';
import { isPropertySignature } from 'typescript';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';
import AccountService from './AccountService';

import { PaperClipIcon } from '@heroicons/react/20/solid';

export default function ProfilePage() {
  const [profileBlock, setProfileBlock] = useState(true);
  const [editBlock, setEditBlock] = useState(false);
  const [emailStr, setEmailStr] = useState('Email address');
  const [mfaStr, setMfaStr] = useState( () => {
    if (localStorage.getItem('mfa') == 'email') {
      return 'Disable MFA'
    } 
    return 'Enable MFA'
  });

  const [new_full_name, setNew_full_name] = useState(
    localStorage.getItem('full_name')
  );
  const [new_intro, setNew_intro] = useState(localStorage.getItem('intro'));

  const handleChangeFullName = (event: ChangeEvent<HTMLInputElement>) => {
    //alert("New Email value: " + event.target.value);
    setNew_full_name(event.target.value);
  };

  const handleChangeIntro = (event: ChangeEvent<HTMLInputElement>) => {
    setNew_intro(event.target.value);
  };

  const editOrProfile = () => {
    if (profileBlock) {
      setProfileBlock(false);
    } else {
      setProfileBlock(true);
    }
  };


  const checkvEmail = () => {
    if (localStorage.getItem('vEmail')?.includes('@')) {
      setEmailStr('Email address (Verified)')
      return false;
    } else {
      return true;
    }
  };

  const [isEmailVerified, setIsEmailV] = useState(checkvEmail);

  return (
    <div>
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
        <div className="flex flex-1 justify-between px-4">
          <div className="flex flex-1">
            <Link
              to={
                localStorage.getItem('admin') == 'true' ? '/adminuser' : '/user'
              }
            >
              <span className="inline-flex rounded-md shadow">
                <a
                  href=""
                  className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-primary hover:bg-gray-50"
                >
                  Back
                </a>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div
      className={
        profileBlock
          ? 'overflow-hidden bg-white shadow sm:rounded-lg'
          : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
      }
      >
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Your Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details
          </p>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">user name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {localStorage.getItem('user_name')}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {localStorage.getItem('full_name')}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {emailStr}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {localStorage.getItem('email')}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Introduction
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {localStorage.getItem('intro')}
              </dd>
            </div>
          </dl>
        </div>
        <div
        className='flex flex-row-reverse gap-4 pb-4 px-4'
        >
          <button
            className="mt-6 basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
            onClick={editOrProfile}
          >
            Edit
          </button>
          <Link to="/pwchang"
          >
          <button
            className="mt-6 basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
            onClick={editOrProfile}
          >
            Change Password
          </button>
          </Link>
          <Link to="/updatePicture"
          >
          <button
            className="mt-6 basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
            onClick={editOrProfile}
          >
            Change Profile Picture
          </button>
          </Link>
          <button
            className={
              !isEmailVerified
              ? 'mt-6 basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3'
              : 'hidden'
            }
            onClick={() => {
              const param = {
                token: localStorage.getItem('access_token'),
                id: localStorage.getItem('user_name'),
                mfa: 'email'
              };
              if (localStorage.getItem('mfa') == 'email') {
                param.mfa = ''
              };
              AccountService.setMFA(param)
                .then((response) => {
                  if (response.data.message == "true") {
                    if (localStorage.getItem('mfa') == 'email') {
                      setMfaStr('Enable MFA')
                      localStorage.setItem('mfa', '')
                    } else {
                      setMfaStr('Disable MFA')
                      localStorage.setItem('mfa', 'email')
                    }
                  } 
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            {mfaStr}
          </button>
          <Link to="/vEmail"
          >
          <button
            className={
              isEmailVerified
              ? 'mt-6 basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3'
              : 'hidden'
            }
          >
            Verify Email
          </button>
          </Link>
          <Link to="/privacySettings"
          >
          <button
            className='mt-6 basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3'
          >
            Privacy Settings
          </button>
          </Link>
        </div>
      </div>

      <div
        className={
          profileBlock
            ? 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
            : 'overflow-hidden bg-white shadow sm:rounded-lg'
        }
      >
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Change Your Profile
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                New full name
              </dt>
              <input
                className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                placeholder="enter new full name"
                onChange={handleChangeFullName}
              ></input>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                New Introduction
              </dt>
              <input
                className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                placeholder="enter new introduction"
                onChange={handleChangeIntro}
              ></input>
            </div>

            <div className="flex flex-row-reverse gap-4">
              
              <button
                className="mt-6 items-center flex basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                onClick={() => {
                  const param = {
                    token: localStorage.getItem('access_token'),
                    username: localStorage.getItem('user_name'),
                    full_name: new_full_name,
                    introduction: new_intro
                  };
                  if (new_intro != null) {
                    localStorage.setItem('intro', new_intro);
                  }
                  if (new_full_name != null) {
                    localStorage.setItem('full_name', new_full_name);
                  }
                  AccountService.editProfile(param)
                    .then((response) => {
                      if (new_intro != null) {
                        localStorage.setItem('intro', response.data.introduction);
                      }
                      if (new_full_name != null) {
                        localStorage.setItem('full_name', response.data.full_name);
                      }
                      console.log(response.data);
                      console.log('here');
                    })
                    .catch((error) => {
                      console.log(error);
                    });

                  setProfileBlock(true);
                  setEditBlock(false);
                  window.location.reload();
                }}
              >
                apply
              </button>
              
              
              <button
                className="mt-6 items-center flex basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                onClick={editOrProfile}
              >
                cancel
              </button>
              
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
