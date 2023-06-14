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

export default function VEmail() {
  const [errorMessage, setErrorMessage] = useState('');
  const [sendOTPBlock, setSendOTP] = useState(true);
  const [inputOTPBlock, setInputOTP] = useState(false);
  const [userInputOTP, setUserOTP] = useState('');

  const handleInputOTP = (event: ChangeEvent<HTMLInputElement>) => {
    setUserOTP(event.target.value);
  }
  const sendOrInput = () => {
    if (sendOTPBlock) {
      setSendOTP(false);
    } else {
      setInputOTP(true);
    }
  };
  return (
    <>
      <div
      className={
        sendOTPBlock
        ? 'overflow-hidden bg-white shadow sm:rounded-lg'
        : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
      }
      >
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Verify Email
            </h2>
            <button
              type="submit"
              className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
              onClick={() => {
                if (true) {
                  const param = {id: localStorage.getItem("user_id")};
                  AccountService.vEmail(param)
                    .then((response: any) => {
                      console.log(response)
                      setErrorMessage(
                        'Email Sent'
                      );
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              }}
            >
              Send Email
            </button>
            <button
              className="mt-6 basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
              onClick={sendOrInput}
            >
              Input Code
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          inputOTPBlock
            ? 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
            : 'overflow-hidden bg-white shadow sm:rounded-lg'
        }
      >
        <dt className="text-sm font-medium text-gray-500">
          Input Code
        </dt>
        <input
          className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
          placeholder="enter OTP code sent to email."
          onChange={handleInputOTP}
        ></input>
        <button
          className="mt-6 items-center flex basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
          onClick={() => {
            const param = {
              id: localStorage.getItem("user_id"),
              inputOtp: userInputOTP
            };
            AccountService.inputOtp(param)
              .then((response) => {
                console.log(response.data);
                console.log('here');
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          Confirm Code
        </button>
      </div>
    </>
  );
}
