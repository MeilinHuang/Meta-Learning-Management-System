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
import MessageModal from './messageModal';

export default function AssessmentAttempsTestOverview() {
    const navigate = useNavigate();
    const routeChange = (path: To) => {
        //let path = `newPath`;
        navigate(path);
    };
    const param = useParams();
    const [Items, setItems] = useState([
        {
            assessmentID: '1',
            assessmentAttemptID: '1',
            assessmentName: 'abc',
            userId: '1',
            username: 'testuser',
            mark: '0',
            feedback: '',
        },
    ]);

    useEffect(() => {
        console.log(param)
        const para = { assessment_id: parseInt(param.assessmentId || "") }
        //console.log(para);
        AssessmentService.assessmentAttemptTestOverview(para)
            .then(res => {
                const arr = []
                for (let index = 0; index < res.data.length; index++) {
                    //console.log(res.data[index])
                    const item = {
                        assessmentID: '',
                        assessmentAttemptID: '',
                        assessmentName: '',
                        userId: '',
                        username: '',
                        mark: '',
                        feedback: '',
                    }
                    item["assessmentID"] = res.data[index].AssessmentAttempt.assessment_id
                    item["assessmentAttemptID"] = res.data[index].AssessmentAttempt.id
                    item["assessmentName"] = param.assessmentName || ""
                    item["userId"] = res.data[index].User.id
                    item["username"] = res.data[index].User.username
                    item["mark"] = res.data[index].AssessmentAttempt.mark
                    item["feedback"] = res.data[index].AssessmentAttempt.feedback
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
                        onClick={() => {
                            routeChange(
                                '/assessmentDetailEdit/' +
                                param.topicName +
                                '/' +
                                param.topicId
                            );
                        }}
                    >
                        Back To assessmentDetailEdit
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
                                            AssessmentName
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            AssessmentAttemptId
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            UserId
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Username
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Mark
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Feedback
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
                                                {item.assessmentName}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {item.assessmentAttemptID}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {item.userId}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item.username}
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
                                                                '/AssessmentTestMark/' +
                                                                param.topicName +
                                                                '/' +
                                                                param.topicId +
                                                                '/' +
                                                                item.assessmentName +
                                                                '/' +
                                                                item.assessmentID +
                                                                '/' +
                                                                item.assessmentAttemptID
                                                            );
                                                        }
                                                        if (param.type == 'b') {
                                                            routeChange(
                                                                '/AssessmentAssignmentMark/' +
                                                                param.topicName +
                                                                '/' +
                                                                param.topicId +
                                                                '/' +
                                                                item.assessmentName +
                                                                '/' +
                                                                item.assessmentID +
                                                                '/' +
                                                                item.assessmentAttemptID
                                                            );
                                                        }

                                                    }}
                                                >
                                                    action
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
