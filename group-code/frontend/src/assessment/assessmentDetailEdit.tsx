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
import MessageModal from './messageModal';

import Sidebar from 'common/Sidebar';
import { useSidebar } from 'content/SidebarContext';
import { capitalise } from 'content/contentHelpers';
import BreadCrumb from 'common/BreadCrumb';
import { Form, Modal } from 'react-bootstrap';


export default function AssessmentDetailEdit() {
    const navigate = useNavigate();
    const routeChange = (path: To) => {
        navigate(path);
    };
    const { sidebarOpen, toggleSidebar } = useSidebar();
    const location = useLocation()
    useEffect(() => {
        if (sidebarOpen === true) {
            toggleSidebar()
        }
    }, [location])

    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const param = useParams();
    const [showMessage, setShowMessage] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);
    const [showMessage3, setShowMessage3] = useState(false);
    const [mesg, setMesg] = useState("");
    const [assessmentId, setAssessmentId] = useState("")
    const [modifyAddName, setModifyAddName] = useState("")
    const [modifyAddType, setModifyAddType] = useState("")
    const [modifyAddStatus, setModifyAddStatus] = useState("")
    const [modifyAddProportion, setModifyAddProportion] = useState("")
    const [modifyAddTimerange, setModifyAddTimerange] = useState("")
    // const [modifyAddStart, setModifyAddStart] = useState("")
    // const [modifyAddDue, setModifyAddDue] = useState("")

    const [modifyEditName, setModifyEditName] = useState("")
    const [modifyEditType, setModifyEditType] = useState("")
    const [modifyEditStatus, setModifyEditStatus] = useState("")
    const [modifyEditProportion, setModifyEditProportion] = useState("")
    const [modifyEditTimerange, setModifyEditTimerange] = useState("")
    // const [modifyEditStart, setModifyEditStart] = useState("")
    // const [modifyEditDue, setModifyEditDue] = useState("")

    const [deleteAssessmentId, setDeleteAssessmentId] = useState("")

    const handleChangeAddName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyAddName(event.target.value);
    };
    const handleChangeAddType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const lowercaseValue = event.target.value.toLowerCase();
        setModifyAddType(lowercaseValue);
    };
    const handleChangeAddStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyAddStatus(event.target.value);
    };
    const handleChangeAddProportion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyAddProportion(event.target.value);
    };
    const handleChangeAddTimerange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyAddTimerange(event.target.value);
    };
    // const handleChangeAddStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setModifyAddStart(event.target.value);
    // };
    // const handleChangeAddDue = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setModifyAddDue(event.target.value);
    // };

    const handleChangeEditName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyEditName(event.target.value);
    };
    const handleChangeEditType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const lowercaseValue = event.target.value.toLowerCase();
        setModifyEditType(lowercaseValue);
    };
    const handleChangeEditStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyEditStatus(event.target.value);
    };
    const handleChangeEditProportion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyEditProportion(event.target.value);
    };
    const handleChangeEditTimerange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModifyEditTimerange(event.target.value);
    };
    // const handleChangeEditStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setModifyEditStart(event.target.value);
    // };
    // const handleChangeEditDue = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setModifyEditDue(event.target.value);
    // };


    const [Items, setItems] = useState([
        {
            assessmentID: "",
            name: "",
            proportion: "",
            status: "",
            timeRange: "",
            // start: "",
            // due: "",
            type: ""
        }
    ]);

    useEffect(() => {
        const itemToEdit = Items.find((elem) => elem.assessmentID === assessmentId)
        if (itemToEdit !== undefined) {
            setModifyEditName(itemToEdit.name)
            setModifyEditType(itemToEdit.type)
            setModifyEditStatus(itemToEdit.status)
            setModifyEditProportion(itemToEdit.proportion)
            setModifyEditTimerange(itemToEdit.timeRange)
            // setModifyEditStart(itemToEdit.start)
            // setModifyEditDue(itemToEdit.due)
        }
    }, [assessmentId])

    useEffect(() => {
        if (deleteAssessmentId != "") {
            const para = { assessment_id: deleteAssessmentId }
            console.log(para)
            AssessmentService.deleteAssessment(para)
                .then((res) => {
                    console.log(res.data)
                    alert("success")
                    window.location.reload();
                })
        }
    }, [deleteAssessmentId])

    useEffect(() => {
        console.log(param)
        const para = { topic_id: param.topicId }
        console.log(para);
        AssessmentService.assessmentDetail(para)
            .then(res => {
                console.log("data")
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
                        // start: "",
                        // due: "",
                        type: ""
                    }
                    item["assessmentID"] = res.data[index].id
                    item["name"] = res.data[index].name
                    item["proportion"] = res.data[index].proportion
                    item["status"] = res.data[index].status
                    item["timeRange"] = res.data[index].timeRange
                    // item["start"] = res.data[index].start
                    // item["due"] = res.data[index].due
                    item["type"] = res.data[index].type
                    console.log("Assessment Edit Detail Page: ", item)
                    arr.push(item)
                }
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
                            <h1 className="text-xl font-semibold text-gray-900">
                                {param.topicName}
                            </h1>
                            {/* <BreadCrumb currName={param.topicName||""} currPath={location.pathname}></BreadCrumb> */}
                            <BreadCrumb></BreadCrumb>
                            {/* <p className="mt-2 text-sm text-gray-700">
                                A list of all assessment in {param.topicName}
                            </p> */}
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                className="mr-2 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                onClick={() => {
                                    setAdd(!add)
                                }}
                            >
                                {/* {add ? "Add New Assessment" : "Close"} */}
                                Add New Assessment
                            </button>
                            {/* <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                            >
                                <Link to="/assessmentOverviewEdit">Back To Topic Overview</Link>
                            </button> */}
                        </div>
                    </div>
                    {/* Assessment Detail Edit Table */}
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
                                                    className="w-10 px-10 py-3.5 text-sm font-semibold text-gray-900"
                                                >
                                                    Proportion
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                                                >
                                                    Time range
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                                                >
                                                    Start
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                                                >
                                                    Due
                                                </th> */}
                                                <th
                                                    scope="col"
                                                    className="px-10 py-3.5 text-sm font-semibold text-gray-900"
                                                >
                                                    <span className="sr-only">Action</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {Items.map((item) => (
                                                <tr key={item.name}>
                                                    <td className="capitalize whitespace-normal px-10 py-4 text-sm font-semibold text-gray-900 sm:pl-6">
                                                        {item.name}
                                                    </td>
                                                    <td className="capitalize whitespace-normal px-10 py-4 text-sm text-gray-500">
                                                        {item.type}
                                                    </td>
                                                    <td className={`${item.status === "open" ? "text-green-700" : "text-red-600"} capitalize whitespace-normal px-10 py-4 text-sm text-gray-500`}>
                                                        {item.status}
                                                    </td>
                                                    <td className="text-center whitespace-normal px-10 py-4 text-sm text-gray-500">
                                                        {item.proportion}
                                                    </td>
                                                    <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                                                        {item.timeRange}
                                                    </td>
                                                    {/* <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                                                        {item.start}
                                                    </td>
                                                    <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                                                        {item.due}
                                                    </td> */}
                                                    <td className="flex flex-row justify-between whitespace-normal px-10 py-4 text-sm text-gray-500 font-semibold">
                                                        <button
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            onClick={() => {
                                                                setEdit(!edit)
                                                                setAssessmentId(item.assessmentID)
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            onClick={() => {
                                                                if (item.status === "open") {
                                                                    setShowMessage2(true)
                                                                }
                                                                else {
                                                                    if (item.type === 'exam' || item.type === 'quiz') {
                                                                        routeChange(
                                                                            '/assessmentEditTestDetail/' +
                                                                            param.topicName +
                                                                            '/' +
                                                                            param.topicId +
                                                                            '/' +
                                                                            item.name +
                                                                            '/' +
                                                                            item.assessmentID
                                                                        );
                                                                    }
                                                                    if (item.type === 'assignment' || item.type === 'essay') {
                                                                        routeChange(
                                                                            '/assessmentAssignmentEditDetail/' +
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
                                                            Detail
                                                        </button>
                                                        <button
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            onClick={() => {
                                                                if (item.status === "open") {
                                                                    setShowMessage(true);
                                                                }
                                                                else {
                                                                    console.log("delete")
                                                                    setDeleteAssessmentId(item.assessmentID)
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            onClick={() => {
                                                                if (item.type === 'exam' || item.type === 'quiz') {
                                                                    routeChange(
                                                                        '/assessmentAttempsTestOverview/' +
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
                                                                if (item.type === 'assignment' || item.type === 'essay') {
                                                                    routeChange(
                                                                        '/assessmentAttempsTestOverview/' +
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
                                                            Mark
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {/* Delete Error */}
                                    <MessageModal
                                        show={showMessage}
                                        close={() => setShowMessage(false)}
                                        message={"The section is open you can not delete it."}
                                    />
                                    {/* Edit and Detail Error */}
                                    <MessageModal
                                        show={showMessage2}
                                        close={() => setShowMessage2(false)}
                                        message={"The section is open, you can not view the detail."}
                                    />
                                    <MessageModal
                                        show={showMessage3}
                                        close={() => setShowMessage3(false)}
                                        message={mesg}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {add && (
                            <div className="z-10 fixed inset-0 opacity-50 z-50"></div>
                        )}
                        <Modal
                            show={add}
                            onHide={() => { setAdd(!add) }}
                            className='z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md'
                        >
                            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left border-2 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                                <Modal.Header className='border-b-2 solid'>
                                    <Modal.Title className='text-lg font-bold'>Add New Assessment</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Name
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeAddName}
                                                placeholder='Enter assessment name'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Type
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeAddType}
                                                placeholder='Exam/Assignment/Quiz/Essay'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Proportion
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeAddProportion}
                                                placeholder='Enter proportion number e.g. 0.2'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Status
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeAddStatus}
                                                placeholder='Format: open/close'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Time range
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeAddTimerange}
                                                placeholder='Format: yyyy/mm/dd to yyyy/mm/dd'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Start
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeAddStart}
                                                placeholder='Format: yyyy/mm/dd to yyyy/mm/dd'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Due
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeAddDue}
                                                placeholder='Format: yyyy/mm/dd to yyyy/mm/dd'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div> */}
                                    {/* <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                </div> */}
                                </Modal.Body>
                                <Modal.Footer className='flex flex-row justify-around'>
                                    <button
                                        className="w-max max-auto rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                        onClick={() => (setAdd(!add))}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="w-max max-auto rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                        onClick={() => {
                                            const para = {
                                                topic_id: param.topicId,
                                                assessmentName: modifyAddName,
                                                type: modifyAddType,
                                                status: modifyAddStatus,
                                                proportion: modifyAddProportion,
                                                timeRange: modifyAddTimerange,
                                                // start: modifyAddStart,
                                                // due: modifyAddDue,
                                            }
                                            const regFloat = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
                                            const regStatus = ["open", "close"]
                                            const regType = ["exam", "quiz", "essay", "assignment"]
                                            if (modifyAddName === "") {
                                                setMesg("Assessment name should not be empty");
                                                setShowMessage3(true)
                                            }
                                            else if (regType.includes(modifyAddType) === false) {
                                                setMesg("Type should be exam/quiz/essay/assignment");
                                                setShowMessage3(true)
                                            }
                                            else if (regFloat.test(modifyAddProportion) === false) {
                                                setMesg("Proportion should be in float format");
                                                setShowMessage3(true)
                                            }
                                            else if (regStatus.includes(modifyAddStatus) === false) {
                                                setMesg("Status should be open/close");
                                                setShowMessage3(true)
                                            }
                                            else if (modifyAddTimerange === "") {
                                                setMesg("Time range cannot be empty")
                                                setShowMessage3(true)
                                            }
                                            // else if (modifyAddStart === "" || modifyAddDue === "") {
                                            //     setMesg("Start/Due time cannot be empty")
                                            //     setShowMessage3(true)
                                            // }
                                            else {
                                                AssessmentService.addNewAssessment(para)
                                                    .then((res) => {
                                                        console.log(res.data)
                                                        window.location.reload();
                                                    })
                                            }

                                        }}
                                    >
                                        Add
                                    </button>
                                </Modal.Footer>
                            </div>
                        </Modal>
                    </div>
                    <div>
                        {edit && (
                            <div className="z-10 fixed inset-0 opacity-50 z-50"></div>
                        )}
                        <Modal
                            show={edit}
                            onHide={() => { setEdit(!edit) }}
                            className='z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md'
                        >
                            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left border-2 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                                <Modal.Header className='border-b-2 solid'>
                                    <Modal.Title className='text-lg font-bold'>Edit Assessment</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Name
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeEditName}
                                                value={modifyEditName}
                                                placeholder='Enter assessment name'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Type
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                value={modifyEditType}
                                                onChange={handleChangeEditType}
                                                placeholder='Exam/Assignment/Quiz/Essay'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Status
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeEditStatus}
                                                value={modifyEditStatus}
                                                placeholder='Format: open/close'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Proportion
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                onChange={handleChangeEditProportion}
                                                value={modifyEditProportion}
                                                placeholder='Enter proportion number e.g. 0.2'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Time range
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                value={modifyEditTimerange}
                                                onChange={handleChangeEditTimerange}
                                                placeholder='Format: yyyy/mm/dd to yyyy/mm/dd'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Start
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                value={modifyEditStart}
                                                onChange={handleChangeEditStart}
                                                placeholder='Format: yyyy/mm/dd to yyyy/mm/dd'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                            Due
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <input
                                                type="text"
                                                value={modifyEditDue}
                                                onChange={handleChangeEditDue}
                                                placeholder='Format: yyyy/mm/dd to yyyy/mm/dd'
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div> */}
                                </Modal.Body>
                                <Modal.Footer className='flex flex-row justify-around'>
                                    <button
                                        className="w-max max-auto rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                        onClick={() => (setEdit(!edit))}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="w-max max-auto rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                        onClick={() => {
                                            const para = {
                                                assessment_id: assessmentId,
                                                assessmentName: modifyEditName,
                                                type: modifyEditType,
                                                status: modifyEditStatus,
                                                proportion: modifyEditProportion,
                                                timeRange: modifyEditTimerange,
                                                // start: modifyEditStart,
                                                // due: modifyEditDue
                                            }
                                            const regStatue = ["open", "close"]
                                            const regFloat = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
                                            if (regFloat.test(modifyEditProportion) === false) {
                                                setMesg("Proportion should be in float format");
                                                setShowMessage3(true)
                                            }
                                            else if (regStatue.includes(modifyEditStatus) === false) {
                                                setMesg("Status should be open/close");
                                                setShowMessage3(true)
                                            }
                                            else {
                                                AssessmentService.updateAssessmentArribute(para)
                                                    .then((res) => {
                                                        console.log(res.data)
                                                        window.location.reload();
                                                    })
                                            }

                                        }}
                                    >
                                        Edit
                                    </button>
                                </Modal.Footer>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div >
    );
}
