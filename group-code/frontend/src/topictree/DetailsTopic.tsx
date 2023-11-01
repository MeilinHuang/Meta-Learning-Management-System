import {
  useEnrolInTopicMutation,
  useUnenrolInTopicMutation
} from 'features/api/apiSlice';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Node, Edge } from 'reactflow';
import { classNames, topicStatus, getButtonColors } from './topicTreeHelpers';

type DetailTopicProps = {
  selectedTopic: Node;
  setSelection: (
    node: Node | string | null,
    edge: Edge | string | null
  ) => void;
  forceUpdate: boolean;
  setForceUpdate: (update: boolean) => void;
  isSuperuser: boolean;
  currTopicData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  currPathTopicNames: Array<string>;
};

export default function DetailsTopic(props: DetailTopicProps) {
  const navigate = useNavigate();

  const [
    enrolInTopic,
    { data: topicEnrolData, isSuccess: isSuccessTopicEnrol }
  ] = useEnrolInTopicMutation();

  const [
    unenrolInTopic,
    { data: topicUnenrolData, isSuccess: isSuccessTopicUnenrol }
  ] = useUnenrolInTopicMutation();

  const [prereqSets, setPrereqSets] = useState<Array<any>>([]);

  useEffect(() => {
    if (props.isSuperuser) {
      setPrereqSets(props.selectedTopic.data.prereqSets);
    } else {
      const newPrereqSets = [];
      for (const set of props.selectedTopic.data.prereqSets) {
        const choicesNew = set.choices.filter((c: any) => !c.archived);
        if (choicesNew.length > 0) {
          newPrereqSets.push({ ...set, choices: choicesNew });
        }
      }
      setPrereqSets(newPrereqSets);
    }
  }, [props.selectedTopic, props.isSuperuser]);

  return (
    <>
      {props.currTopicData.isFetching && <h2> Loading ... </h2>}
      {props.currTopicData.error && (
        <h2>
          {' '}
          An error occured when getting information on{' '}
          <b>{props.selectedTopic.data.label}</b>. Please contact your admin.
        </h2>
      )}
      {props.currTopicData.isSuccess && props.currTopicData.data && (
        <div>
          <div className="flex flex-col items-center">
            {props.currTopicData.data.image_url && (
              <img
                className="w-12 h-12 mb-3 rounded-full shadow-lg"
                src={props.currTopicData.data.image_url}
                alt={`Topic image for ${props.currTopicData.data.title}`}
              />
            )}
            <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
              Currently Viewing: <b>{props.currTopicData.data.title}</b>
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white w-full rounded-lg shadow-xl">
              {(props.selectedTopic.type === 'nodeStudentInProgressView' ||
                props.selectedTopic.type === 'nodeStudentCompletedView' ||
                props.selectedTopic.type === 'nodeAcademicView') && (
                <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                  <p className="text-gray-600">Topic Page</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/topic/${props.selectedTopic.id}/preparation`);
                    }}
                    className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                    style={{
                      backgroundColor: `${
                        getButtonColors(
                          props.selectedTopic.data.status,
                          props.selectedTopic.data.archived
                        ).backgroundColor
                      }`,
                      color: `${
                        getButtonColors(
                          props.selectedTopic.data.status,
                          props.selectedTopic.data.archived
                        ).textColor
                      }`
                    }}
                  >
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm font-medium">
                        Navigate to Topic page
                      </span>
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 8.71423C0 8.47852 0.094421 8.25246 0.262491 8.08578C0.430562 7.91911 0.658514 7.82547 0.896201 7.82547H13.9388L8.29808 2.23337C8.12979 2.06648 8.03525 1.84013 8.03525 1.60412C8.03525 1.36811 8.12979 1.14176 8.29808 0.974875C8.46636 0.807989 8.6946 0.714233 8.93259 0.714233C9.17057 0.714233 9.39882 0.807989 9.5671 0.974875L16.7367 8.08499C16.8202 8.16755 16.8864 8.26562 16.9316 8.3736C16.9767 8.48158 17 8.59733 17 8.71423C17 8.83114 16.9767 8.94689 16.9316 9.05487C16.8864 9.16284 16.8202 9.26092 16.7367 9.34348L9.5671 16.4536C9.39882 16.6205 9.17057 16.7142 8.93259 16.7142C8.6946 16.7142 8.46636 16.6205 8.29808 16.4536C8.12979 16.2867 8.03525 16.0604 8.03525 15.8243C8.03525 15.5883 8.12979 15.362 8.29808 15.1951L13.9388 9.603H0.896201C0.658514 9.603 0.430562 9.50936 0.262491 9.34268C0.094421 9.17601 0 8.94995 0 8.71423Z"
                          fill={`${
                            getButtonColors(
                              props.selectedTopic.data.status,
                              props.selectedTopic.data.archived
                            ).textColor
                          }`}
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              )}
              <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p className="text-gray-600">Description</p>
                {!props.currTopicData.data.description ||
                props.currTopicData.data.description === '' ? (
                  <p>No Description provided</p>
                ) : (
                  <p>{props.currTopicData.data.description}</p>
                )}
              </div>
              {topicStatus(props.selectedTopic) && (
                <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                  <p className="text-gray-600">Topic Status</p>
                  <p>{topicStatus(props.selectedTopic)}</p>
                  {props.selectedTopic.type === 'nodeStudentAvailableView' && (
                    <button
                      type="button"
                      onClick={() => {
                        enrolInTopic({
                          user_id: Number(localStorage.getItem('user_id')),
                          topic_id: Number(props.selectedTopic.id)
                        });
                        props.setForceUpdate(!props.forceUpdate);
                        props.setSelection(props.selectedTopic, null);
                      }}
                      className="flex break-inside rounded-xl px-2 py-2 my-2 w-full bg-green-500 dark:bg-green-500 text-white"
                    >
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium text-white">
                          Enroll in topic
                        </span>
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 8.71423C0 8.47852 0.094421 8.25246 0.262491 8.08578C0.430562 7.91911 0.658514 7.82547 0.896201 7.82547H13.9388L8.29808 2.23337C8.12979 2.06648 8.03525 1.84013 8.03525 1.60412C8.03525 1.36811 8.12979 1.14176 8.29808 0.974875C8.46636 0.807989 8.6946 0.714233 8.93259 0.714233C9.17057 0.714233 9.39882 0.807989 9.5671 0.974875L16.7367 8.08499C16.8202 8.16755 16.8864 8.26562 16.9316 8.3736C16.9767 8.48158 17 8.59733 17 8.71423C17 8.83114 16.9767 8.94689 16.9316 9.05487C16.8864 9.16284 16.8202 9.26092 16.7367 9.34348L9.5671 16.4536C9.39882 16.6205 9.17057 16.7142 8.93259 16.7142C8.6946 16.7142 8.46636 16.6205 8.29808 16.4536C8.12979 16.2867 8.03525 16.0604 8.03525 15.8243C8.03525 15.5883 8.12979 15.362 8.29808 15.1951L13.9388 9.603H0.896201C0.658514 9.603 0.430562 9.50936 0.262491 9.34268C0.094421 9.17601 0 8.94995 0 8.71423Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                  {props.selectedTopic.type === 'nodeStudentInProgressView' && (
                    <button
                      type="button"
                      onClick={() => {
                        unenrolInTopic({
                          user_id: Number(localStorage.getItem('user_id')),
                          topic_id: Number(props.selectedTopic.id)
                        });
                        props.setForceUpdate(!props.forceUpdate);
                        props.setSelection(props.selectedTopic, null);
                      }}
                      className="flex break-inside rounded-xl px-2 py-2 my-2 w-full bg-red-400 dark:bg-red-400 text-white"
                    >
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium text-white">
                          Unenroll from topic
                        </span>
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 8.71423C0 8.47852 0.094421 8.25246 0.262491 8.08578C0.430562 7.91911 0.658514 7.82547 0.896201 7.82547H13.9388L8.29808 2.23337C8.12979 2.06648 8.03525 1.84013 8.03525 1.60412C8.03525 1.36811 8.12979 1.14176 8.29808 0.974875C8.46636 0.807989 8.6946 0.714233 8.93259 0.714233C9.17057 0.714233 9.39882 0.807989 9.5671 0.974875L16.7367 8.08499C16.8202 8.16755 16.8864 8.26562 16.9316 8.3736C16.9767 8.48158 17 8.59733 17 8.71423C17 8.83114 16.9767 8.94689 16.9316 9.05487C16.8864 9.16284 16.8202 9.26092 16.7367 9.34348L9.5671 16.4536C9.39882 16.6205 9.17057 16.7142 8.93259 16.7142C8.6946 16.7142 8.46636 16.6205 8.29808 16.4536C8.12979 16.2867 8.03525 16.0604 8.03525 15.8243C8.03525 15.5883 8.12979 15.362 8.29808 15.1951L13.9388 9.603H0.896201C0.658514 9.603 0.430562 9.50936 0.262491 9.34268C0.094421 9.17601 0 8.94995 0 8.71423Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              )}
              <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <p className="text-gray-600">Archived</p>
                {props.currTopicData.data.archived ? <p>Yes</p> : <p>No</p>}
              </div>
              {prereqSets && prereqSets.length > 0 && (
                <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                  <p className="text-gray-600">Pre-requisites required</p>
                  {prereqSets.map((set: any, indx: number) => {
                    return (
                      <div
                        key={indx}
                        className="rounded border-2 p-2"
                        style={{ marginTop: '2px' }}
                      >
                        <p>
                          Complete at least <b>{set.amount}</b> of the following
                          topics:
                        </p>
                        {set.choices.map((choice: any) => {
                          return (
                            <button
                              key={`${choice.id}_${indx}`}
                              type="button"
                              disabled={
                                !props.currPathTopicNames.includes(
                                  choice.sourceName
                                )
                              }
                              title={
                                props.currPathTopicNames.includes(
                                  choice.sourceName
                                )
                                  ? `Navigate to ${choice.sourceName}`
                                  : `${choice.sourceName} is not present in the current pathway`
                              }
                              onClick={() => {
                                props.setSelection(choice.id.toString(), null);
                              }}
                              className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                              style={{
                                backgroundColor: `${
                                  getButtonColors(
                                    choice.statusSource,
                                    choice.archivedSource
                                  ).backgroundColor
                                }`,
                                color: `${
                                  getButtonColors(
                                    choice.statusSource,
                                    choice.archivedSource
                                  ).textColor
                                }`
                              }}
                            >
                              <div className="flex items-center justify-between flex-1">
                                <span className="text-sm font-medium">
                                  {choice.sourceName}
                                </span>
                                <svg
                                  width="17"
                                  height="17"
                                  viewBox="0 0 17 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0 8.71423C0 8.47852 0.094421 8.25246 0.262491 8.08578C0.430562 7.91911 0.658514 7.82547 0.896201 7.82547H13.9388L8.29808 2.23337C8.12979 2.06648 8.03525 1.84013 8.03525 1.60412C8.03525 1.36811 8.12979 1.14176 8.29808 0.974875C8.46636 0.807989 8.6946 0.714233 8.93259 0.714233C9.17057 0.714233 9.39882 0.807989 9.5671 0.974875L16.7367 8.08499C16.8202 8.16755 16.8864 8.26562 16.9316 8.3736C16.9767 8.48158 17 8.59733 17 8.71423C17 8.83114 16.9767 8.94689 16.9316 9.05487C16.8864 9.16284 16.8202 9.26092 16.7367 9.34348L9.5671 16.4536C9.39882 16.6205 9.17057 16.7142 8.93259 16.7142C8.6946 16.7142 8.46636 16.6205 8.29808 16.4536C8.12979 16.2867 8.03525 16.0604 8.03525 15.8243C8.03525 15.5883 8.12979 15.362 8.29808 15.1951L13.9388 9.603H0.896201C0.658514 9.603 0.430562 9.50936 0.262491 9.34268C0.094421 9.17601 0 8.94995 0 8.71423Z"
                                    fill={`${
                                      getButtonColors(
                                        choice.statusSource,
                                        choice.archivedSource
                                      ).textColor
                                    }`}
                                  />
                                </svg>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
