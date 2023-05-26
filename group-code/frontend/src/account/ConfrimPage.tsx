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

export default function ConfirmPage() {
  const [username, setUserName] = useState('');
  const [haveName, setHaveName] = useState(true);
  const [password, setPassword] = useState('');
  const [havePassword, setHavePassword] = useState(true);
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

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (event.target.value != '') {
      setHavePassword(true);
    } else {
      setHavePassword(false);
    }
  };

  return (
    <>
      {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-gray-50">
          <body class="h-full">
          ```
        */}
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Comfirm your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className={
                    haveName
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {haveName
                    ? 'User Name*'
                    : 'Please enter your account user name'}
                </label>
                <div className="mt-5 sm:flex sm:items-center">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChangeEmail}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={
                    havePassword
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {havePassword ? 'Password*' : 'Please enter a password*'}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChangePassword}
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
                  className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                  onClick={() => {
                    if (username != '' && password != '') {
                      const param = { username: username, password: password };
                      AccountService.login(param)
                        .then((response: any) => {
                          localStorage.clear()
                          console.log(response)
                          // console.log(response.data.access_token);
                          // console.log(response.data.user_name);
                          // console.log(response.data.email);
                          // console.log(response.data.user_id);
                          // console.log(response.data)
                          
                          
                          
                          if (response.data.user_id != 1) {
                            setCode(200);
                          } else {
                            setCode(201);

                          }
                        })
                        .catch((error: any) => {
                          if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                            setCode(error.response.status);
                            if (error.response.status == 401) {
                              setErrorMessage(
                                'Username or Password invalid, Please check again'
                              );
                            } else {
                              setErrorMessage(error.response.data.detail);
                            }
                          }
                        });
                    }
                  }}
                >
                  Log in
                </button>

                {code == 200 ? <Navigate to="/user"></Navigate> : ""}
                {code == 201 ? <Navigate to="/adminuser"></Navigate> : ""}
              </div>

              <div className="mt-6 flex items-start justify-center text-gray-500">
                {/* -----does not have an account? try register---- */}
              </div>

              <div>
                <Link to="/register">
                  <button
                    type="submit"
                    className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                  >
                    register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
