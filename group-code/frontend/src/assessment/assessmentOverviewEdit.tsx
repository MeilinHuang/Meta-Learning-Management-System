import React, { useEffect, useState } from 'react';
import AssessmentService from './AssessmentService';
import { BrowserRouter as Router, Routes, Route, Link, To, useNavigate } from 'react-router-dom';
import MessageModal from './messageModal';

export default function AssessmentOverviewEdit() {
    const navigate = useNavigate();
    const routeChange = (path: To) => {
        //let path = `newPath`;
        navigate(path);
    };
    const [showMessage, setShowMessage] = useState(false);
    const [topics, setTopics] = useState([
        {
            id: '1',
            topic_name: 'c++',
            description: 'This is a topic for c++',
        },

    ]);

    const [searchedTopics, setsearchedTopics] = useState([
        {
            id: '1',
            topic_name: 'c++',
            description: 'This is a topic for c++',
        },

    ]);

    const [name, setName] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleClick = () => {
        //go search service function here
        const re = new RegExp("^.*" + name + ".*$", 'i')

        if (name == "") {
            setsearchedTopics(topics)
        }
        else {
            const arr = []
            for (let index = 0; index < topics.length; index++) {
                if (topics[index].topic_name.match(re)) {
                    const item = {
                        id: "",
                        topic_name: "",
                        description: "",
                    }
                    item["id"] = topics[index].id
                    item["topic_name"] = topics[index].topic_name
                    item["description"] = topics[index].description
                    arr.push(item)
                }
            }
            setsearchedTopics(arr)
        }
    };

    useEffect(() => {
        //use this to handle change
        const token = localStorage.getItem('access_token');
        const param = { token: token }
        //console.log(param)
        AssessmentService.assessmentOverviewEdit(param)
            .then(res => {
                //console.log(res.data)
                const arr = []
                for (let index = 0; index < res.data.length; index++) {
                    //const element = res.data[index];
                    const item = {
                        id: "",
                        topic_name: "",
                        description: "",
                    }
                    item["id"] = res.data[index].id
                    item["topic_name"] = res.data[index].topic_name
                    item["description"] = res.data[index].description
                    console.log(item)
                    arr.push(item)
                }
                //console.log(arr)
                setTopics(arr)
                setsearchedTopics(arr)
            });

    }, []);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Topic</h1>
                    <p className="mt-2 text-sm text-gray-700">Topic overview</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <input
                        type="text"
                        placeholder="Search by topic name"
                        onChange={handleChange}
                    />
                    <button
                        onClick={handleClick}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Search
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
                                            Id
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Topic
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Description
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            detail
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {searchedTopics.map((topic) => (
                                        <tr key={topic.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {topic.id}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {topic.topic_name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {topic.description}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <a
                                                    href="#"
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {/* <Link to="/assessmentMain">Detail</Link> */}
                                                    {/* <Link to={'/assessmentDetailEdit/' + topic.topic_name + '/' + topic.id}>
                                                        Detail
                                                    </Link> */}
                                                    <button
                                                        onClick={() => {
                                                            const para = {
                                                                token: localStorage.getItem('access_token'),
                                                                topic_id: topic.id
                                                            }
                                                            console.log(para)
                                                            AssessmentService.checkAssessmentPermission(para)
                                                                .then((res) => {
                                                                    console.log(res.data)
                                                                    if (res.data == true) {
                                                                        routeChange(
                                                                            '/assessmentDetailEdit/' +
                                                                            topic.topic_name +
                                                                            '/' +
                                                                            topic.id
                                                                        )
                                                                    }
                                                                    else {
                                                                        setShowMessage(true)
                                                                    }
                                                                })
                                                        }}
                                                    >
                                                        Detail
                                                    </button>
                                                    <span className="sr-only">, {topic.topic_name}</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <MessageModal
                    show={showMessage}
                    close={() => setShowMessage(false)}
                    message={"You do not have permission to access editor page"}
                />
            </div>
        </div>
    );
}

