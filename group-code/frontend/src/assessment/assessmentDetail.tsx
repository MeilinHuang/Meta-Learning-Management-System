import React, { useEffect, useRef, useState } from 'react';
import AssessmentService from './AssessmentService';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  To,
  useLocation
} from 'react-router-dom';
//import { useDateSelect } from "react-ymd-date-select"
import Dropdown from 'react-dropdown';
import MessageModal from './messageModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Sidebar from 'common/Sidebar';
import { useSidebar } from 'content/SidebarContext';
import BreadCrumb from 'common/BreadCrumb';

// import { makeStyles } from "@material-ui/core/styles";

function formatDateTime(date: Date) {
  console.log(date)
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} - ${hours}:${minutes}`;
}

export default function AssessmentDetail() {
  const [showMessage, setShowMessage] = useState(false);
  const param = useParams();

  const dataFetchedRef = useRef(false);
  const [Items, setItems] = useState([
    {
      assessmentID: "",
      name: "",
      type: "",
      status: "",
      proportion: "",
      timeRange: "",
    },
    // {
    //   assessmentID: '1',
    //   name: 'quiz 1',
    //   type: 'quiz',
    //   status: 'open',
    //   proportion: '0.1',
    //   timeRange: '2022-11.1 to 2022-11.7'
    // },
    // {
    //   assessmentID: '2',
    //   name: 'quiz 2',
    //   type: 'quiz',
    //   status: 'open',
    //   proportion: '0.1',
    //   timeRange: '2022-11.18 to 2022-11.26'
    // },
    // {
    //   assessmentID: '3',
    //   name: 'quiz 3',
    //   type: 'quiz',
    //   status: 'not release',
    //   proportion: '0.1',
    //   timeRange: '2022-12.18 to 2022-12.26'
    // },
    // {
    //   name: 'assignment 1',
    //   type: 'assignment',
    //   status: 'open',
    //   proportion: '0.2',
    //   timeRange: '2022-11.18 to 2022-12.13'
    // },
    // {
    //   name: 'final exam',
    //   type: 'exam',
    //   status: 'not release',
    //   proportion: '0.5',
    //   timeRange: '2023-1.18 to 2023-1.18'
    // }
  ]);

  const [showDropdown, setShowDropdown] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }
  const { sidebarOpen, toggleSidebar, topicsShow, adminShow } = useSidebar();

  const location = useLocation()

  // const paths = [
  //   { name: "Assessment Overview", path: "/assessmentMain" },
  //   { name: `${param.topicName} Assessments`, path: `${location.pathname}`}
  // ]

  const navigate = useNavigate();

  // const currentPaths = location.state || [];
  // const updatedPaths = [...currentPaths, { name: `${param.topicName} Assessments`, path: `${location.pathname}` }];

  const routeChange = (path: To) => {
    //let path = `newPath`;
    navigate(path);
  };


  useEffect(() => {
    if (sidebarOpen === true) {
      toggleSidebar()
    }
  }, [location])

  useEffect(() => {
    // if (dataFetchedRef.current) return;
    // dataFetchedRef.current = true;
    console.log(param)
    const para = { topic_id: param.topicId }
    console.log(para);
    AssessmentService.assessmentDetail(para)
      .then(res => {
        console.log(res.data)
        const arr = []
        for (let index = 0; index < res.data.length; index++) {
          //const element = res.data[index];
          const item = {
            assessmentID: "",
            name: "",
            proportion: "",
            status: "",
            timeRange: "",
            type: ""
          }
          item["assessmentID"] = res.data[index].id
          item["name"] = res.data[index].name
          item["proportion"] = res.data[index].proportion
          item["status"] = res.data[index].status
          item["timeRange"] = res.data[index].timeRange
          item["type"] = res.data[index].type
          console.log(item)
          arr.push(item)
        }
        // const newData = [
        //   {
        //     assessmentID: '1',
        //     name: 'quiz 1',
        //     type: 'quiz',
        //     status: 'open',
        //     proportion: '0.1',
        //     timeRange: '2022-11.1 to 2022-11.7'
        //   },
        //   {
        //     assessmentID: '2',
        //     name: 'quiz 2',
        //     type: 'quiz',
        //     status: 'open',
        //     proportion: '0.1',
        //     timeRange: '2022-11.18 to 2022-11.26'
        //   },
        //   {
        //     assessmentID: '3',
        //     name: 'quiz 3',
        //     type: 'quiz',
        //     status: 'not release',
        //     proportion: '0.1',
        //     timeRange: '2022-12.18 to 2022-12.26'
        //   },
        //   {
        //     name: 'assignment 1',
        //     type: 'assignment',
        //     status: 'open',
        //     proportion: '0.2',
        //     timeRange: '2022-11.18 to 2022-12.13'
        //   },
        //   {
        //     name: 'final exam',
        //     type: 'exam',
        //     status: 'not release',
        //     proportion: '0.5',
        //     timeRange: '2023-1.18 to 2023-1.18'
        //   }
          //   {
          //     assessmentID: '1',
          //     name: 'quiz 1',
          //     type: 'quiz',
          //     status: 'open',
          //     proportion: '0.1',
          //     timeRange: '2022/11/1 to 2022/11/7'
          //   },
          //   {
          //     assessmentID: '2',
          //     name: 'quiz 2',
          //     type: 'quiz',
          //     status: 'open',
          //     proportion: '0.1',
          //     timeRange: '2022/11/18 to 2022/11/26'
          //   }
        // ]

        // newData.map((elem) => {
        //   arr.push(elem)
        // })
        setItems(arr)
      })
  }, []);
  return (
    <div className='flex flex-row'>
      <div className="z-50 md:fixed md:top-16 md:bottom-0 md:flex md:flex-col">
        {/* <Sidebar isOpened={sidebarOpen}></Sidebar> */}
        <Sidebar></Sidebar>
        {/* </div> */}
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className={`w-full top-16 flex flex-col md:w-auto px-4 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto py-10">
              <div
                className='w-max rounded-md flex flex-col'>
                <h1 className="text-3xl font-semibold text-gray-900">{param.topicName}</h1>
                {/* <BreadCrumb currName={param.topicName||""} currPath={location.pathname}></BreadCrumb> */}
                <BreadCrumb></BreadCrumb>

              </div>
              {/* hover effect on both button and text */}
              {/* <div
                className='w-max rounded-md flex items-center cursor-pointer hover:bg-gray-100'
                onClick={() => {
                  navigate(-1)
                }}>
                <ArrowLeftIcon
                  className="w-6 h-6"
                />
                <h1 className="ml-4 text-xl font-semibold text-gray-900">
                  {param.topicName}
                </h1>
              </div> */}
              {/* hover effect only on back button */}
              {/* <div
                className='w-max rounded-md flex items-center cursor-pointer'
                onClick={() => {
                  navigate(-1)
                }}>
                <ArrowLeftIcon
                  className="w-6 h-6 hover:bg-gray-100"
                />
                <h1 className="ml-4 text-xl font-semibold text-gray-900">
                  {param.topicName}
                </h1>
              </div> */}
              {/* no hover effect */}
              {/* <div
                className='w-max rounded-md flex items-center cursor-pointer'
                onClick={() => {
                  navigate(-1)
                }}>
                <ArrowLeftIcon
                  className="w-6 h-6"
                />
                <h1 className="ml-4 text-xl font-semibold text-gray-900">
                  {param.topicName}
                </h1>
              </div> */}
            </div>
            {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                <Link to="/assessmentMain">Back To assessmentMain</Link>
              </button>
            </div> */}
          </div>

          {/* Specific Topic Assessment Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="min-w-full overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full text-sm text-left divide-y divide-gray-300 text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="w-20 px-10 py-3.5 text-sm font-semibold text-gray-900"
                        >
                          Proportion
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                        >
                          Time Range
                        </th>
                        <th
                          scope="col"
                          className="w-10 px-10 py-3.5 text-sm font-semibold text-gray-900"
                        >
                          <span className="sr-only">Record</span>
                        </th>
                        <th
                          scope="col"
                          className="w-10 px-10 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          <span className="sr-only">Start</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {Items.map((item) => (
                        <tr key={item.name} className="capitalize bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="whitespace-normal px-10 py-4 text-sm font-semibold text-gray-900 sm:pl-6">
                            {item.name}
                          </td>
                          <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                            {item.type}
                          </td>
                          <td className={`${item.status === "open" ? "text-green-700" : "text-red-600"} whitespace-normal px-10 py-4 text-sm text-gray-500`}>
                            {item.status}
                          </td>
                          <td className="text-center whitespace-normal px-10 py-4 text-sm text-gray-500">
                            {item.proportion}
                          </td>
                          <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                            {item.timeRange}
                          </td>
                          {/* <td className="text-center whitespace-normal px-3 py-4 text-sm text-gray-500">
                            {formatDateTime(item.start)}
                          </td> */}
                          {/* /*<td className="text-center whitespace-normal px-3 py-4 text-sm text-gray-500"> */}
                          {/* {item.due.toLocaleString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              weekday: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).replaceAll(',', '')} */}
                          {/* {formatDateTime(item.due).toString()} */}
                          {/* </td> */}
                          <td className="whitespace-normal px-10 py-4 text-sm text-gray-500 font-semibold">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                if (item.type == 'exam' || item.type == 'quiz') {
                                  routeChange(
                                    '/assessmentAttemptsList/' +
                                    param.enrollId +
                                    '/' +
                                    param.topicName +
                                    '/' +
                                    param.topicId +
                                    '/' +
                                    item.name +
                                    '/' +
                                    item.assessmentID +
                                    '/' +
                                    'a'
                                  );
                                }
                                if (item.type == 'assignment' || item.type == 'essay') {
                                  routeChange(
                                    '/assessmentAttemptsList/' +
                                    param.enrollId +
                                    '/' +
                                    param.topicName +
                                    '/' +
                                    param.topicId +
                                    '/' +
                                    item.name +
                                    '/' +
                                    item.assessmentID +
                                    '/' +
                                    'b'
                                  );
                                }
                              }}
                            >
                              Record
                            </button>
                          </td>
                          <td className="text-center whitespace-normal px-10 py-4 text-sm text-gray-500 font-semibold">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                if (item.status != 'open') {
                                  setShowMessage(true);
                                } else {
                                  if (item.type == 'exam' || item.type == 'quiz') {
                                    routeChange(
                                      '/assessmentAttempt/' +
                                      param.enrollId +
                                      '/' +
                                      param.topicName +
                                      '/' +
                                      param.topicId +
                                      '/' +
                                      item.name +
                                      '/' +
                                      item.assessmentID
                                    );
                                  }
                                  if (item.type == 'assignment' || item.type == 'essay') {
                                    routeChange(
                                      '/assessmentSubmit/' +
                                      param.enrollId +
                                      '/' +
                                      param.topicName +
                                      '/' +
                                      param.topicId +
                                      '/' +
                                      item.name +
                                      '/' +
                                      item.assessmentID
                                    );
                                  }
                                }
                              }}
                            >
                              Start
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <MessageModal
                    show={showMessage}
                    close={() => setShowMessage(false)}
                    message={"The section is not open"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
