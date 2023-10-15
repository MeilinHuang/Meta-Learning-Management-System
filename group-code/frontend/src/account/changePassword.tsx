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

export default function ChangePassword() {
  const [username, setUserName] = useState('');
  const [haveName, setHaveName] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [haveOldPassword, setHaveOldPassword] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [haveNewPassword, setHaveNewPassword] = useState(true);
  const [confirmNewPs, setNewConfirmPs] = useState('');
  const [same, setSame] = useState(true);
  const [haveNewConfirmPs, setHaveNewConfirmPs] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState(-1);

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    //alert("New Email value: " + event.target.value);
    setUserName(event.target.value);
    if (event.target.value != '') {
      setHaveName(true);
    } else {
      setHaveName(false);
    }
  };

  const handleChangeOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
    if (event.target.value != '') {
      setHaveOldPassword(true);
    } else {
      setHaveOldPassword(false);
    }
  };

  const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    if (event.target.value != '') {
      setHaveNewPassword(true);
    } else {
      setHaveNewPassword(false);
    }
  };

  const handleChangeConfirmNewPassword = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setNewConfirmPs(event.target.value);
    if (event.target.value != '') {
      setHaveNewConfirmPs(true);
    } else {
      setHaveNewConfirmPs(false);
    }
    if (event.target.value == newPassword) {
      setSame(true);
    } else {
      setSame(false);
    }
  };

  return (
    <>
      
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Change password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              

              <div>
                <label
                  htmlFor="password"
                  className={
                    haveOldPassword
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {haveOldPassword ? 'Password*' : 'Please enter a password*'}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChangeOldPassword}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className={
                    haveNewPassword
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  New Password*
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChangeNewPassword}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className={
                    same && haveNewConfirmPs
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {same && haveNewConfirmPs
                    ? 'Confirm New Password*'
                    : 'Please type same new password again*'}
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChangeConfirmNewPassword}
                  />
                </div>
              </div>

              
            </form>

            <div className="mt-6">
              <div>
                <div className="text-center text-sm font-medium text-red-500">
                  {errorMessage}
                </div>
                <button
                  type="submit"
                  className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                  onClick={() => {
                    if (same && oldPassword != '') {
                      const param = { username: localStorage.getItem("user_name"), password: oldPassword, newpassword: newPassword };
                      AccountService.changePw(param)
                        .then((response: any) => {
                          console.log(response)
                          setErrorMessage(
                            'Password Changing Successed'
                          );
                        })
                        .catch((error: any) => {
                          if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                            setCode(error.response.status);
                            if (error.response.status == 401) {
                              setErrorMessage(
                                'Old Password invalid, Please check again'
                              );
                            } else {
                              setErrorMessage(error.response.data.detail);
                            }
                          }
                        });
                    }
                  }}
                >
                  apply
                </button>

                
              </div>

              <div className="mt-6 flex items-start justify-center text-gray-500">
                {/* -----does not have an account? try register---- */}
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
