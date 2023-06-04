import { Verify } from 'crypto';
import React, { ChangeEvent, MouseEventHandler, FC, useState } from 'react';
import { isPropertySignature } from 'typescript';
import AccountService from './AccountService';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';
// import nodemailer from 'nodemailer';
import { constants } from 'http2';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [haveEmail, setHaveEmail] = useState(true);
  const [verified, setVerified] = useState(true);
  const [password, setPassword] = useState('');
  const [havePassword, setHavePassword] = useState(true);
  const [confirmPs, setConfirmPs] = useState('');
  const [haveConfirmPs, setHaveConfirmPs] = useState(true);
  const [same, setSame] = useState(true);
  const [name, setName] = useState('');
  const [haveName, setHaveName] = useState(true);
  const [userName, setUserName] = useState('');
  const [haveUserName, setHaveUserName] = useState(true);
  const [code, setCode] = useState(0);
  const [verificationCode, setVerificationCode] = useState(''); 
  const [SubmitVerificationCode, setSubmitVerificationCode] = useState(''); 
  const [verifucationBox, setVerifucationBox] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (event.target.value != '') {
      setHaveEmail(true);
      if (!event.target.value.includes('@') || !event.target.value.includes('.com')) {
        setVerified(false);
      } else {
        setVerified(true)
      }
    } else {
      setHaveEmail(false);
    }
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (event.target.value != '' && event.target.value.length >= 6) {
      setHavePassword(true);
    } else {
      setHavePassword(false);
    }
    if (event.target.value == confirmPs) {
      setSame(true);
    } else {
      setSame(false);
    }
  };

  const handleChangeConfirmPassword = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPs(event.target.value);
    if (event.target.value != '') {
      setHaveConfirmPs(true);
    } else {
      setHaveConfirmPs(false);
    }
    if (event.target.value == password) {
      setSame(true);
    } else {
      setSame(false);
    }
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (event.target.value != '') {
      setHaveName(true);
    } else {
      setHaveName(false);
    }
  };

  const handleChangeUserName = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    if (event.target.value != '') {
      setHaveUserName(true);
    } else {
      setHaveUserName(false);
    }
  };

  // const verifyEmailFunc = () => {
  //   const random = Math.floor(Math.random() * 9000) + 1000;
  //   setVerificationCode(random.toString())
  //   if (haveEmail) {
  //     const transporter = nodemailer.createTransport({
  //         sendmail: true,
  //         newline: 'unix',
  //         path: '/usr/sbin/sendmail'
  //     });
  //     transporter.sendMail({
  //         from: 'metalmsserviceteam@outlook.com',
  //         to: email,
  //         subject: 'verification code',
  //         text: random.toString()
  //     }, (err, info) => {
  //         console.log(info.envelope);
  //         console.log(info.messageId);
  //     });
  //     setVerifucationBox(true)
  //   }
    
  // };

  // const submitVerificationCode = () => {
  //   if (SubmitVerificationCode == verificationCode) {
  //     setVerified(true);
  //     setVerifucationBox(false);
  //   }
  // }
  

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
            Sign up by your email
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="Username"
                  className={
                    haveUserName
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {haveUserName ? 'User Name*' : 'Please enter a user name*'}
                </label>
                <div className="mt-1">
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    //autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Unique name to log in"
                    onChange={handleChangeUserName}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={
                    verified
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {verified
                    ? 'Email*'
                    : 'Please enter an valid email address*'}
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

                  {/* <button
                    type="submit"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    id="verifyEmail"
                    // onClick={}
                  >
                    Verify
                  </button> */}
                </div>
              </div>

              {/* {email != '' ? (
                <div className="flex items-start justify-start">
                  <div className="text-sm">
                    <label
                      className={verified ? ' text-green-600' : ' text-red-600'}
                    >
                      {verified ? 'verified' : 'unverified'}
                    </label>
                  </div>
                </div>
              ) : (
                ''
              )} */}

              
            
              

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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className={
                    same && haveConfirmPs
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {same && haveConfirmPs
                    ? 'Confirm Password*'
                    : 'Please type same password again*'}
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChangeConfirmPassword}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className={
                    haveName
                      ? 'block text-sm font-medium text-gray-700'
                      : 'block text-sm font-medium text-red-700'
                  }
                >
                  {haveName ? 'Name*' : 'Please enter a name*'}
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChangeName}
                  />
                </div>
              </div>

              

            </form>

            <div className="mt-6">
              <div className="text-center text-sm font-medium text-red-500">
                {errorMessage}
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                  onClick={() => {
                    console.log(email)
                    if (userName == '') {
                      setHaveUserName(false);
                    }
                    if (email == '' || verified != true || !email.includes('@') || !email.includes('.com')) {
                      setVerified(false);
                    }
                    if (password == '') {
                      setHavePassword(false);
                    }
                    if (confirmPs == '') {
                      setHaveConfirmPs(false);
                    }
                    if (confirmPs != password) {
                      setSame(false);
                    }
                    if (name == '') {
                      setHaveName(false);
                    }
                    
                    if (
                      haveEmail &&
                      haveName &&
                      havePassword &&
                      haveUserName &&
                      same &&
                      haveConfirmPs &&
                      verified
                    ) {
                      //establish an account for this user

                      const param = {
                        username: userName,
                        password: password,
                        email: email,
                        full_name: name
                      };
                      // console.log('hello1');
                      AccountService.register(param)
                        .then((response: any) => {
                          localStorage.setItem(
                            'access_token',
                            response.data.access_token
                          );
                          localStorage.setItem(
                            'token_type',
                            response.data.token_type
                          );
                          localStorage.setItem(
                            'user_name',
                            response.data.user_name
                          );
                          localStorage.setItem('email', response.data.email);
                          localStorage.setItem(
                            'user_id',
                            response.data.user_id
                          );
                          localStorage.setItem(
                            'full_name',
                            response.data.full_name
                          );
                          localStorage.setItem(
                            'intro',
                            response.data.introduction
                          );
                          if(response.data.admin == true) {
                            localStorage.setItem(
                            'userAddress',
                            "/adminuser"
                          )
                            
                          } else {
                            localStorage.setItem(
                            'userAddress',
                            "/user")
                          }
                          if (response.data.user_id != 1) {
                            setCode(200);
                          } else {
                            setCode(201);

                          }

                        })
                        .catch((error: any) => {
                          console.log('get error.response');
                          if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                            setCode(error.response.status);
                            if (error.response.status == 500) {
                              setErrorMessage(error.response.data.detail);
                            } else {
                              setErrorMessage(error.response.data.detail);
                            }
                          }
                        });
                    }
                  }}
                >
                  Sign up
                </button>

                {code == 200 ? <Navigate to="/user"></Navigate> : ""}
                {code == 201 ? <Navigate to="/adminuser"></Navigate> : ""}

                <div className="mt-6 flex items-start justify-center text-gray-500">
                  -----already have an account? try login in----
                </div>

                <Link to="/login">
                  <button
                    type="submit"
                    className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                  >
                    log in
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
