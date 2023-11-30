import { Fragment, useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    useNavigate,
    To
} from 'react-router-dom';
// import { CheckIcon } from '@heroicons/react/24/outline';
import AssessmentService from './AssessmentService';
import axios from 'axios';


export default function AssessmentAssignmentEditDetail() {
    const param = useParams();
    const navigate = useNavigate();
    const routeChange = (path: To) => {
        //let path = `newPath`;
        navigate(path);
    };
    const [edit, setEdit] = useState(true)
    const [isActive, setIsActive] = useState('-1');
    const [problemDesc, setproblemDesc] = useState({
        problemDesc: 'This assignment has several purposes:\nTo explore C++’s value - semantics.\nTo stress the notion of abstraction as a mechanism for managing data and providing functionality\nwithout revealing the implementation.\nTo become more familiar with C++\'s type system.\nTo gain familiarity with the C++ standard library',
        fileName: "example.txt",
        fileCollectionId: 1
    });

    const [newDescription, setNewDescription] = useState('')
    const [newFilename, setNewFilename] = useState('')

    const handleChangeNewDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewDescription(event.target.value);
    };
    const handleChangeNewFilename = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewFilename(event.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // prevent the page from reloading
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        console.log(e.currentTarget.file.files[0])
        const file = e.currentTarget.file.files[0]
        formData.append('file', file);
        formData.append("data", JSON.stringify({
            "assessment_id": param.assessmentId,
            "description": newDescription,
            "filename": newFilename
        }));

        axios({
            method: 'POST',
            url: API_URL + '/assessment/assignment/update',
            data: formData,
        })
            .then((res) => {
                console.log(res.data);
                alert("edit successfully")
                // routeChange(
                //     '/assessmentDetail/' +
                //     param.enrollId +
                //     '/' +
                //     param.topicName +
                //     '/' +
                //     param.topicId
                // );
                window.location.reload();
            })

    }

    const [contentShow, setcontentShow] = useState('Description');
    const API_URL = ' http://127.0.0.1:8000';

    useEffect(() => {
        console.log(param)
        const para = {
            assessment_id: param.assessmentId
        }
        AssessmentService.renderAssignment(para)
            .then((res) => {
                console.log(res.data)
                console.log(res.data.length)
                if (res.data.length != 0) {
                    console.log(res.data[0])
                    //console.log(res.data.id)
                    const result = {
                        problemDesc: '',
                        fileName: "",
                        fileCollectionId: 0
                    }
                    result.problemDesc = res.data[0].description
                    result.fileName = res.data[0].filename
                    result.fileCollectionId = res.data[0].id
                    setproblemDesc(result)
                }
            })
    }, [])

    return (
        <>
            <div>
                {/* Static sidebar for desktop */}
                <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <h3>{param.topicName + ' ' + param.assessmentName}</h3>
                        </div>
                        <div className="mt-5 flex flex-grow flex-col">
                            <nav className="flex-1 space-y-1 px-2 pb-4">

                                <div
                                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                    style={{
                                        backgroundColor:
                                            'Description' == isActive ? 'green' : ''
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setIsActive('Description');
                                            //console.log('selectProblemID: ' + isActive);
                                            setcontentShow('Description');
                                            //console.log(problemDesc.problemDesc)
                                        }}
                                    >
                                        Description
                                    </button>
                                </div>

                                <div
                                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                    style={{
                                        backgroundColor:
                                            'Submit' == isActive ? 'green' : ''
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setIsActive('Submit');
                                            //console.log('selectProblemID: ' + isActive);
                                            setcontentShow('Submit');
                                        }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="md:pl-64">
                    <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
                        <main className="flex-1">
                            <div className="py-6">
                                <div className="px-4 sm:px-6 md:px-0">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {contentShow}
                                    </div>
                                </div>
                                <div className="px-4 sm:px-6 md:px-0">
                                    {/* Replace with your content */}
                                    <div className="py-4">
                                        <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
                                            <div className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            </div>
                                            <div className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {contentShow == 'Description' &&
                                                    <div className="relative flex items-start">
                                                        <div className="ml-3 text-sm">
                                                            {/* put file here */}
                                                            <div
                                                                className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6"
                                                                style={{ whiteSpace: "pre-wrap" }}
                                                            >
                                                                {problemDesc.problemDesc}
                                                            </div>

                                                        </div>
                                                        <div>
                                                            <div
                                                                className="flex h-5 items-center"
                                                                style={{ whiteSpace: "pre-wrap" }}
                                                            >
                                                                <h2 color='#7FFFD4'>
                                                                    {problemDesc.fileName}
                                                                </h2>
                                                            </div>
                                                            <button
                                                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                onClick={() => {
                                                                    console.log(problemDesc.fileCollectionId)
                                                                    const para = { filecollection_id: problemDesc.fileCollectionId }
                                                                    AssessmentService.downloadInstruction(para)
                                                                        .then((response) => {
                                                                            //need modify
                                                                            console.log(response.data)
                                                                            console.log(response.headers)
                                                                            console.log(response.headers.filename)
                                                                            console.log(response.headers["content-disposition"])
                                                                            const filename: string = response.headers.filename!
                                                                            console.log(filename)
                                                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                                                            const link = document.createElement('a');
                                                                            link.href = url;
                                                                            link.setAttribute('download', filename);
                                                                            document.body.appendChild(link);
                                                                            link.click();
                                                                            URL.revokeObjectURL(link.href)
                                                                            document.body.removeChild(link)
                                                                        })

                                                                }}
                                                            >
                                                                Download
                                                            </button>
                                                            <button
                                                                className='className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"'
                                                                onClick={() => {
                                                                    setEdit(!edit)
                                                                }}
                                                            >
                                                                {edit ? "Edit " : "Close"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                                {contentShow == 'Submit' && (
                                                    <div></div>
                                                )
                                                }
                                            </div>
                                            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0"
                                                style={{ display: edit ? 'none' : 'block' }}
                                            >
                                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                        Description
                                                    </label>
                                                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                        <input
                                                            type="text"
                                                            onChange={handleChangeNewDescription}
                                                            placeholder='description for this assessment'
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                        Filename
                                                    </label>
                                                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                        <input
                                                            type="text"
                                                            onChange={handleChangeNewFilename}
                                                            placeholder='attached FileName'
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex h-5 items-center">
                                                    <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                                                        <label>
                                                            <input type="file" name='file' />
                                                        </label>
                                                        <input type="submit" className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" />
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {/* /End replace */}
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={() => {
                                        routeChange(
                                            '/assessmentDetailEdit/' +
                                            param.topicName +
                                            '/' +
                                            param.topicId
                                        )
                                    }}
                                >
                                    Back
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div >
        </>
    );
}