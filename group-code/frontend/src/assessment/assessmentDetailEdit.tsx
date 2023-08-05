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
import AssessmentEditModal from './components/assessmentEditModal';

export default function AssessmentDetailEdit() {
  const navigate = useNavigate();
  const routeChange = (path: To) => {
    navigate(path);
  };
  const [add, setAdd] = useState(true);
  const [edit, setEdit] = useState(true);
  const param = useParams();
  const [showMessage, setShowMessage] = useState(false);
  const [showMessage2, setShowMessage2] = useState(false);
  const [showMessage3, setShowMessage3] = useState(false);
  const [mesg, setMesg] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [modifyAddName, setModifyAddName] = useState('');
  const [modifyAddType, setModifyAddType] = useState('');
  const [modifyAddStatus, setModifyAddStatus] = useState('');
  const [modifyAddProportion, setModifyAddProportion] = useState('');
  const [modifyAddTimeRange, setModifyAddTimeRange] = useState('');

  const [modifyEditStatus, setModifyEditStatus] = useState('');
  const [modifyEditProportion, setModifyEditProportion] = useState('');
  const [modifyEditTimeRange, setModifyEditTimeRange] = useState('');

  const [deleteAssessmentId, setDeleteAssessmentId] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleChangeAddName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyAddName(event.target.value);
  };
  const handleChangeAddType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyAddType(event.target.value);
  };
  const handleChangeAddStatus = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModifyAddStatus(event.target.value);
  };
  const handleChangeAddProportion = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModifyAddProportion(event.target.value);
  };
  const handleChangeAddTimeRange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModifyAddTimeRange(event.target.value);
  };

  const handleChangeEditStatus = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModifyEditStatus(event.target.value);
  };
  const handleChangeEditProportion = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModifyEditProportion(event.target.value);
  };
  const handleChangeEditTimeRange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModifyEditTimeRange(event.target.value);
  };

  const [Items, setItems] = useState([
    {
      assessmentID: '1',
      name: 'quiz 1',
      type: 'quiz',
      status: 'close',
      proportion: '10%',
      timeRange: '2022-11.1 to 2022-11.7'
    },
    {
      assessmentID: '2',
      name: 'quiz 2',
      type: 'quiz',
      status: 'open',
      proportion: '10%',
      timeRange: '2022-11.18 to 2022-11.26'
    }
  ]);

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
    console.log(param);
    const para = { topic_id: param.topicId };
    console.log(para);
    AssessmentService.assessmentDetail(para).then((res) => {
      console.log(res.data);
      const arr = [];
      for (let index = 0; index < res.data.length; index++) {
        //const element = res.data[index];
        const item = {
          assessmentID: '',
          name: '',
          proportion: '',
          status: '',
          timeRange: '',
          type: ''
        };
        item['assessmentID'] = res.data[index].id;
        item['name'] = res.data[index].name;
        item['proportion'] = res.data[index].proportion;
        item['status'] = res.data[index].status;
        item['timeRange'] = res.data[index].timeRange;
        item['type'] = res.data[index].type;
        console.log(item);
        arr.push(item);
      }
      setItems(arr);
    });
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
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => {
              setIsAddModalOpen(true);
            }}
          >
            {add ? 'Add ' : 'Close'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Link to="/assessmentOverviewEdit">
              Back To assessmentOverviewEdit
            </Link>
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Proportion
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Timerange
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
                    <tr key={item.name}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.status}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.proportion}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.timeRange}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            if (item.status == 'open') {
                              setShowMessage2(true);
                            } else {
                              setAssessmentId(item.assessmentID);
                              setIsEditModalOpen(true);
                            }
                          }}
                        >
                          Edit
                        </button>
                        <span> </span>
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            if (item.status == 'open') {
                              setShowMessage2(true);
                            } else {
                              if (item.type == 'exam' || item.type == 'quiz') {
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
                              if (
                                item.type == 'assignment' ||
                                item.type == 'essay'
                              ) {
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
                        <span> </span>
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            if (item.status == 'open') {
                              setShowMessage(true);
                            } else {
                              console.log('delete');
                              setDeleteAssessmentId(item.assessmentID);
                            }
                          }}
                        >
                          Delete
                        </button>
                        <span> </span>
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            if (item.type == 'exam' || item.type == 'quiz') {
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
                            if (
                              item.type == 'assignment' ||
                              item.type == 'essay'
                            ) {
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
              <MessageModal
                show={showMessage}
                close={() => setShowMessage(false)}
                message={'The section is open you can not delete it'}
              />

              <MessageModal
                show={showMessage2}
                close={() => setShowMessage2(false)}
                message={'The section is open you can not edit it'}
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
      <div
        className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0"
        style={{ display: add ? 'none' : 'block' }}
      >
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            Name
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeAddName}
              placeholder="Fill assessment name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            Type
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeAddType}
              placeholder="exam/assignment/quiz/essay  care the case"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            Proportion
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeAddProportion}
              placeholder="type float ex: 0.2"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            Status
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeAddStatus}
              placeholder="Format: open/close"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            TimeRange
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeAddTimeRange}
              placeholder="Format: yyyy/mm/dd to yyyy/mm/dd"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => {
              const para = {
                topic_id: param.topicId,
                type: modifyAddType,
                assessmentName: modifyAddName,
                proportion: modifyAddProportion,
                status: modifyAddStatus,
                timeRange: modifyAddTimeRange
              };
              const regFloat = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
              const regStatus = ['open', 'close'];
              const regType = ['exam', 'quiz', 'essay', 'assignment'];
              if (regFloat.test(modifyAddProportion) == false) {
                setMesg('proportion should be in float format');
                setShowMessage3(true);
              } else if (modifyAddName == '') {
                setMesg('assessment name should not be null');
                setShowMessage3(true);
              } else if (regStatus.includes(modifyAddStatus) == false) {
                setMesg('status should be open/close');
                setShowMessage3(true);
              } else if (regType.includes(modifyAddType) == false) {
                setMesg('type should be exam/quiz/essay/assignment');
                setShowMessage3(true);
              } else {
                AssessmentService.addNewAssessment(para).then((res) => {
                  console.log(res.data);
                  window.location.reload();
                });
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
      <div
        className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0"
        style={{ display: edit ? 'none' : 'block' }}
      >
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            Proportion
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeEditProportion}
              placeholder="type float ex: 0.2"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            Status
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeEditStatus}
              placeholder="Format: open/close"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            TimeRange
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <input
              type="text"
              onChange={handleChangeEditTimeRange}
              placeholder="Format: yyyy/mm/dd to yyyy/mm/dd"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => {
              //{topicName: 'Topic 7', topicId: '7'}
              const para = {
                assessment_id: assessmentId,
                proportion: modifyEditProportion,
                status: modifyEditStatus,
                timeRange: modifyEditTimeRange
              };
              const regStatue = ['open', 'close'];
              const regFloat = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
              if (regFloat.test(modifyEditProportion) == false) {
                setMesg('proportion should be in float format');
                setShowMessage3(true);
              } else if (regStatue.includes(modifyEditStatus) == false) {
                setMesg('status should be open/close');
                setShowMessage3(true);
              } else {
                AssessmentService.updateAssessmentArribute(para).then((res) => {
                  console.log(res.data);
                  window.location.reload();
                });
              }
            }}
          >
            Edit
          </button>
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
    </div>
  );
}
