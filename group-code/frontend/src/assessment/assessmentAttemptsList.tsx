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
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import BreadCrumb from 'common/BreadCrumb';
import Sidebar from 'common/Sidebar';
import { useSidebar } from 'content/SidebarContext';

export default function AssessmentAttemptsList() {

    const navigate = useNavigate();

    const [showMessage, setShowMessage] = useState(false);
    const param = useParams();
    const [Items, setItems] = useState([
        {
            assessmentAttemptID: '',
            mark: '',
            feedback: '',
        }
    ]);

    const { sidebarOpen } = useSidebar()

    const location = useLocation()

    // const currentPaths = location.state || [];
    // const updatedPaths = [...currentPaths, { name: `${param.assessmentName}`, path: `${location.pathname}` }];

    const routeChange = (path: To) => {
        //let path = `newPath`;
        navigate(path);
    };

    // const paths = [
    //     { name: "Assessment Overview", path: "/assessmentMain" },
    //     { name: `${param.topicName} Assessments`, path: `${location.pathname}` }
    // ]

    useEffect(() => {
        // if (dataFetchedRef.current) return;
        // dataFetchedRef.current = true;
        console.log(param)
        const para = { enroll_id: param.enrollId, assessment_id: param.assessmentId }
        console.log(para);
        AssessmentService.getAttemptList(para)
            .then(res => {
                console.log(res.data)
                const arr = []
                for (let index = 0; index < res.data.length; index++) {
                    //const element = res.data[index];
                    const item = {
                        assessmentAttemptID: "",
                        mark: "",
                        feedback: "",
                    }
                    item["assessmentAttemptID"] = res.data[index].id
                    item["mark"] = res.data[index].mark
                    item["feedback"] = res.data[index].feedback
                    arr.push(item)
                }
                const newData = {
                    assessmentAttemptID: '1',
                    mark: '80',
                    feedback: 'great',
                }
                arr.push(newData)
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
                                <h1 className="text-3xl font-semibold text-gray-900">{param.assessmentName}</h1>
                                <BreadCrumb></BreadCrumb>
                            </div>
                            {/* <div
                        className='w-max rounded-md flex items-center cursor-pointer hover:bg-gray-100'
                        onClick={() => {
                            navigate(-1)
                        }}>
                        <ArrowLeftIcon
                            className="w-6 h-6"
                        />
                        <h1 className="ml-4 text-xl font-semibold text-gray-900">
                            {param.topicName + ' ' + param.assessmentName}
                        </h1>
                    </div> */}
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                            >
                                <Link to="/assessmentMain">Assessment Overview</Link>
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full text-sm text-left divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="w-10 py-3.5 px-10 text-sm font-semibold text-gray-900 sm:pl-6"
                                                >
                                                    Attempt
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-10 py-3.5 px-10 text-sm font-semibold text-gray-900"
                                                >
                                                    Mark
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                                                >
                                                    Feedback
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-10 px-10 py-3.5 text-sm font-semibold text-gray-900"
                                                >
                                                    <span className="sr-only">Action</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {Items.map((item, index) => (
                                                <tr key={item.assessmentAttemptID} className='capitalize'>
                                                    <td className="text-center whitespace-normal px-10 py-4 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {item.assessmentAttemptID}
                                                    </td>
                                                    <td className="text-center whitespace-normal px-10 py-4 text-sm text-gray-500">
                                                        {item.mark}
                                                    </td>
                                                    <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                                                        {item.feedback}
                                                    </td>
                                                    <td className="whitespace-normal px-10 py-4 text-sm text-gray-500 font-semibold">
                                                        <button
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            onClick={() => {

                                                                if (param.type == 'a') {
                                                                    routeChange(
                                                                        '/assessmentAttemptDetail/' +
                                                                        param.enrollId +
                                                                        '/' +
                                                                        param.topicName +
                                                                        '/' +
                                                                        param.topicId +
                                                                        '/' +
                                                                        param.assessmentName +
                                                                        '/' +
                                                                        param.assessmentId +
                                                                        '/' +
                                                                        'a' +
                                                                        '/' +
                                                                        item.assessmentAttemptID
                                                                    );
                                                                }
                                                                if (param.type == 'b') {
                                                                    console.log("here b!")
                                                                    routeChange(
                                                                        '/assessmentAssignmentAttemptDetail/' +
                                                                        param.enrollId +
                                                                        '/' +
                                                                        param.topicName +
                                                                        '/' +
                                                                        param.topicId +
                                                                        '/' +
                                                                        param.assessmentName +
                                                                        '/' +
                                                                        param.assessmentId +
                                                                        '/' +
                                                                        'b' +
                                                                        '/' +
                                                                        item.assessmentAttemptID
                                                                    );

                                                                }

                                                            }}
                                                        >
                                                            Detail
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
