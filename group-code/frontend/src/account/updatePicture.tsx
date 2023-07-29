import React, { ChangeEvent, useState} from 'react';
import AccountService from './AccountService';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

export default function UpdatePicture() {
  const [username, setusername] = useState(localStorage.getItem('user_name'));
  const [errorMessage, setErrorMessage] = useState('');
  const [rClass, setrClass] = useState("py-4 text-center text-sm font-medium text-black");
  const [dataUrl, setDataUrl] = useState('')
  
  const uploadPicture = () => {
    if (dataUrl && username) {
      const param = {
        id: localStorage.getItem("user_name"),
        token: localStorage.getItem("access_token"),
        image: dataUrl
      }
      AccountService.putPicture(param)
        .then((response: any) => {
          console.log(response)
          setErrorMessage(
            'Picture updated.'
          );
          localStorage.setItem('profilePic', dataUrl);
          setrClass('py-4 text-center text-sm font-medium text-green-500');
        })
        .catch((error) => {
          setErrorMessage('Image failed to upload')

          setrClass('py-4 text-center text-sm font-medium text-red-500');
          console.log(error);
        });
    }
  };
  
  function handleFileSelect(e: any) {
    const file = e.target.files.item(0);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      const dataUrl = reader.result as string;
      setDataUrl(dataUrl);
    });
  }

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
            Update Profile Picture
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <p className="text-sm text-black-500 text-align:left mb-4">
              Please select your new profile picture below. Supported image types are JPEG, PNG, and WEBP.
            </p>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Select Image</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    handleFileSelect(e);
                  }}
                />
              
              </label>
            </div>
            <button
              type="submit"
              className={
                (dataUrl == '')
                ? 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                : "mt-6 flex w-full justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-3"
              }
                onClick={uploadPicture}
            >
              Update Profile Picture
            </button>
            <div className={rClass}>
              {errorMessage}
              {errorMessage == 'Picture updated.' ? <Navigate to="/profile#"></Navigate> : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
