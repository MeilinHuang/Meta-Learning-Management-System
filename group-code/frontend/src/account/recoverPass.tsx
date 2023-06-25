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
import { match } from 'assert';

export default function recoverPass() {
  const [errorMessage, setErrorMessage] = useState('');
  const [userInputOTP, setUserOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRep, setNewPasswordRep] = useState('');
  const handleInputOTP = (event: ChangeEvent<HTMLInputElement>) => {
    setUserOTP(event.target.value);
  };
  const [rClass, setrClass] = useState("text-center text-sm font-medium text-black");
  const [username, setUsername] = useState('');

  const handleChangeId = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleNewPasswordRep = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPasswordRep(event.target.value);
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
          Account Recovery
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-black-500 text-align:left">
                  Please enter your username, then click the button below to receive an email to the associated email.
              </p>
              <div className="mt-5 sm:flex sm:items-center">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Username"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  onChange={handleChangeId}
                />
              </div>
              <button
                type="submit"
                className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                onClick={() => {
                  const param = {id: username};
                  AccountService.vEmail(param)
                  .then((response: any) => {
                    console.log(response)
                    if (response.data.message != 'success') {
                      setErrorMessage(
                        'Username doesn\'t exist.'
                      );
                      setrClass('text-center text-sm font-medium text-red-500');
                    } else {
                      setErrorMessage(
                        'Email Sent.'
                      );
                      setrClass('text-center text-sm font-medium text-black');
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                }}
              >
                Send Code
              </button>
              <div className="py-4">
                <p className="text-sm text-black-500 text-align:left">
                  Please enter the code from your email and your new password below.
                </p>
              </div>
              <div>
                <div className="mt-6">
                  <input
                    placeholder="Enter Code"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleInputOTP}
                  ></input>
                  <input className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="New Password"
                    required
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleNewPassword}
                  ></input>
                  
                  <input className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Repeat New Password"
                    required
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleNewPasswordRep}
                  ></input>
                </div>
                
              </div>
              <button
                  className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                  onClick={() => {
                    if (newPassword == newPasswordRep) {
                      const param = {
                        username: username,
                        inputOtp: userInputOTP,
                        newPassword: newPassword
                      };
                      AccountService.recoverPass(param)
                      .then((response) => {
                        if (response.data.message == "true") {
                          localStorage.setItem(
                            'vEmail',
                            response.data.vEmail
                          );
                          setrClass('text-center text-sm font-medium text-green-500');
                          setErrorMessage(
                            'Password Changed, please Login.'
                          );
                        } else {
                          setrClass('text-center text-sm font-medium text-red-500');
                          setErrorMessage(
                            'Invalid Entry.'
                          );
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    } else {
                      setErrorMessage(
                        'Passwords don\'t match.'
                      );
                      setrClass('text-center text-sm font-medium text-red-500');
                    }
                  }}
                >
                  Confirm
                </button>
              <div className="py-4">
                <div className={rClass}>
                  {errorMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
