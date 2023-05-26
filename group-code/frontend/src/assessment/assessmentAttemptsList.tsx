import React, { useEffect, useRef, useState } from 'react';
import AssessmentService from './AssessmentService';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    useNavigate,
    To
} from 'react-router-dom';
//import { useDateSelect } from "react-ymd-date-select"
import Dropdown from 'react-dropdown';
import MessageModal from './messageModal';

export default function AssessmentAttemptsList() {
    const navigate = useNavigate();
    const routeChange = (path: To) => {
        //let path = `newPath`;
        navigate(path);
    };
    const [showMessage, setShowMessage] = useState(false);
    const param = useParams();
    const [Items, setItems] = useState([
        {
            assessmentAttemptID: '1',
            mark: '80',
            feedback: 'great',
        }
    ]);

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
                setItems(arr)
            })
    }, []);
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {param.topicName}
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all assessment in {param.topicName}
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Link to="/assessmentMain">Back To assessmentMain</Link>
                    </button>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            AttemptId
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            mark
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            feedback
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {Items.map((item) => (
                                        <tr key={item.assessmentAttemptID}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {item.assessmentAttemptID}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item.mark}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item.feedback}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
    );
}
