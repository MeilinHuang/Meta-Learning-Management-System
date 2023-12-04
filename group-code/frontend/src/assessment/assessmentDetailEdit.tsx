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
import AssessmentEditModal from './components/assessmentEditModal';

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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    },
    // {
    //   assessmentID: '1',
    //   name: 'quiz 1',
    //   type: 'quiz',
    //   status: 'close',
    //   proportion: '10%',
    //   timeRange: '2022-11.1 to 2022-11.7'
    // },
    // {
    //   assessmentID: '2',
    //   name: 'quiz 2',
    //   type: 'quiz',
    //   status: 'open',
    //   proportion: '10%',
    //   timeRange: '2022-11.18 to 2022-11.26'
    // }
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
    if (deleteAssessmentId != '') {
      const para = { assessment_id: deleteAssessmentId };
      console.log(para);
      AssessmentService.deleteAssessment(para).then((res) => {
        console.log(res.data);
        alert('success');
        window.location.reload();
      });
    }
  }, [deleteAssessmentId]);

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
                  setIsAddModalOpen(true)
                }}
              >
                Add New Assessment
              </button>
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
                                setIsEditModalOpen(true)
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
        </div>
      </div>
      <AssessmentEditModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        id={param.topicId}
        modalType="add"
      />
      <AssessmentEditModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        modalType="edit"
        assessmentId={assessmentId}
      />
    </div >
  );
}
