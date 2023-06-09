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
  const [code, setCode] = useState(-1);
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
                  .catch((error: any) => {
                    if (error.response) {
                      console.log(error.response.data);
                      console.log(error.response.status);
                      console.log(error.response.headers);
                      setCode(error.response.status);
                      if (error.response.status == 401) {
                        setErrorMessage(
                          'Email not sent'
                        );
                      } else {
                        setErrorMessage(error.response.data.detail);
                      }
                    }
                  });
              }
            }}
          >
            Send Email
          </button>
        </div>
      </div>
    </>
  );
}
