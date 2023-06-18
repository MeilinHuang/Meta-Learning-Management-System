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

export default function VEmail() {
  const [errorMessage, setErrorMessage] = useState('Email Not Sent.');
  const [userInputOTP, setUserOTP] = useState('');
  const handleInputOTP = (event: ChangeEvent<HTMLInputElement>) => {
    setUserOTP(event.target.value);
  };
  const [rClass, setrClass] = useState("text-left text-sm font-medium text-black");

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
          Verify Email
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-black-500 text-align:left">
                Click the button below to receive an email containing your code.
              </p>
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
                          'Email Sent.'
                        );
                        setrClass('text-left text-sm font-medium text-black');
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }}
              >
                Send Code
              </button>
              <div className="py-4">
                <p className="text-sm text-black-500 text-align:left">
                  Please enter the code from your email below.
                </p>
              </div>
              <div className={rClass}>
                {errorMessage}
              </div>
              <div className="flex gap-4">
                <div className="mt-6">
                  <input
                    className="text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                    placeholder="Enter Code"
                    onChange={handleInputOTP}
                  ></input>
                </div>
                <button
                  className="mt-6 items-center flex basis-1/8 justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
                  onClick={() => {
                    const param = {
                      id: localStorage.getItem("user_id"),
                      inputOtp: userInputOTP
                    };
                    AccountService.inputOtp(param)
                      .then((response) => {
                        if (response.data.message == "true") {
                          localStorage.setItem(
                            'vEmail',
                            response.data.vEmail
                          );
                          setrClass('text-left text-sm font-medium text-green-500');
                          setErrorMessage(
                            'Email Verified.'
                          );
                        } else {
                          setrClass('text-left text-sm font-medium text-red-500');
                          setErrorMessage(
                            'Invalid Entry.'
                          );
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  Confirm Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
