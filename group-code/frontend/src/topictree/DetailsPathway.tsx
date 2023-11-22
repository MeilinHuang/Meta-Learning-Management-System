import {
  useEnrolInPathwayMutation,
  useUnenrolInPathwayMutation
} from 'features/api/apiSlice';
import React, { useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { classNames, getButtonColors } from './topicTreeHelpers';
import { currPathT } from './types';

type DetailPathwayProps = {
  pathwayName: string;
  setSelection: (
    node: Node | string | null,
    edge: Edge | string | null
  ) => void;
  currPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  globalPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  isSuperuser: boolean;
  setCurrPath: (currPath: currPathT) => void;
  pathwaysData: {
    userPathsData: {
      pathways: Array<any>;
      error: any;
      isLoading: boolean;
      isSuccess: boolean;
    };
    allPathsData: {
      pathways: Array<any>;
      error: any;
      isLoading: boolean;
      isSuccess: boolean;
    };
  };
};

export default function DetailsPathway(props: DetailPathwayProps) {
  const [
    enrolInPathway,
    { data: pathEnrolData, isSuccess: isSuccessPathEnrol }
  ] = useEnrolInPathwayMutation();
  const [
    unenrolInPathway,
    { data: pathUnenrolData, isSuccess: isSuccessPathUnenrol }
  ] = useUnenrolInPathwayMutation();
  const [coreTopics, setCoreTopics] = useState<Array<any>>([]);
  const [elecTopics, setElecTopics] = useState<Array<any>>([]);

  useEffect(() => {
    if (props.currPathData.data && props.currPathData.data.core) {
      if (props.isSuperuser) {
        setCoreTopics(props.currPathData.data.core);
      } else {
        setCoreTopics(
          props.currPathData.data.core.filter((c: any) => !c.archived)
        );
      }
    }
    if (props.currPathData.data && props.currPathData.data.electives) {
      if (props.isSuperuser) {
        setElecTopics(props.currPathData.data.electives);
      } else {
        setElecTopics(
          props.currPathData.data.electives.filter((e: any) => !e.archived)
        );
      }
    }
  }, [props.currPathData, props.isSuperuser]);

  return (
    <>
      {props.currPathData.isFetching && <h2> Loading ... </h2>}
      {props.currPathData.error && (
        <h2>
          {' '}
          An error occured when getting information on Pathway:{' '}
          <b>{props.pathwayName}</b>. Please contact your admin.
        </h2>
      )}
      {props.currPathData.isSuccess &&
        props.globalPathData.isSuccess &&
        props.currPathData.data &&
        'id' in props.currPathData.data &&
        props.currPathData.data.id !== null &&
        props.currPathData.data.id !== undefined &&
        props.globalPathData.data &&
        'id' in props.globalPathData.data &&
        props.globalPathData.data.id !== null &&
        props.globalPathData.data.id !== undefined && (
          <div>
            <div className="flex flex-col items-center">
              <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
                Currently Viewing Pathway: <b>{props.pathwayName}</b>
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white w-full rounded-lg shadow-xl">
                {props.currPathData.data.id != props.globalPathData.data.id &&
                  !props.isSuperuser && (
                    <div className="hover:bg-gray-50 p-4 border-b">
                      {props.pathwaysData.userPathsData.pathways
                        .map((p: any) => Number(p.id))
                        .includes(Number(props.currPathData.data.id)) ? (
                        <>
                          <p className="text-gray-600">Enrolled in Pathway</p>
                          <button
                            type="button"
                            onClick={async () => {
                              const r = await unenrolInPathway({
                                user_id: localStorage.getItem('user_id'),
                                pathway_id: Number(props.currPathData.data.id)
                              });
                              props.setCurrPath({
                                name: props.globalPathData.data.name,
                                id: Number(props.globalPathData.data.id),
                                user: true
                              });
                            }}
                            className="flex break-inside text-white bg-red-500 hover:bg-red-900 dark:hover:bg-red-900 rounded-xl px-2 py-2 my-2 w-full dark:bg-red-500 dark:text-white"
                          >
                            <div className="flex items-center justify-center flex-1">
                              Unenrol from Pathway
                            </div>
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-600">
                            Not enrolled in Pathway
                          </p>
                          <button
                            type="button"
                            onClick={async () => {
                              const r = await enrolInPathway({
                                user_id: localStorage.getItem('user_id'),
                                pathway_id: Number(props.currPathData.data.id)
                              });
                              props.setCurrPath({
                                name: props.currPathData.data.name,
                                id: Number(props.currPathData.data.id),
                                user: true
                              });
                            }}
                            className="flex break-inside text-white bg-green-600 hover:bg-green-900 dark:hover:bg-green-900 rounded-xl px-2 py-2 my-2 w-full dark:bg-green-600 dark:text-white"
                          >
                            <div className="flex items-center justify-center flex-1">
                              Enrol in Pathway
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                <div className="hover:bg-gray-50 p-4 border-b">
                  <p className="text-gray-600">Core Topics</p>
                  {coreTopics.length > 0 ? (
                    <div className="hover:bg-gray-50 p-4">
                      {coreTopics.map((core: any) => {
                        return (
                          <button
                            key={`${core.id}_core`}
                            type="button"
                            onClick={() =>
                              props.setSelection(core.id.toString(), null)
                            }
                            className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                            style={{
                              backgroundColor: `${
                                getButtonColors(core.status, core.archived)
                                  .backgroundColor
                              }`,
                              color: `${
                                getButtonColors(core.status, core.archived)
                                  .textColor
                              }`
                            }}
                          >
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-sm font-medium">
                                {core.name}
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
                                    getButtonColors(core.status, core.archived)
                                      .textColor
                                  }`}
                                />
                              </svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p>None</p>
                  )}
                </div>
                <div className="hover:bg-gray-50 p-4 border-b">
                  <p className="text-gray-600">Elective Topics</p>
                  {elecTopics.length > 0 ? (
                    <div className="hover:bg-gray-50 p-4">
                      {elecTopics.map((elec: any) => {
                        return (
                          <button
                            key={`${elec.id}_elec`}
                            type="button"
                            onClick={() =>
                              props.setSelection(elec.id.toString(), null)
                            }
                            className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                            style={{
                              backgroundColor: `${
                                getButtonColors(elec.status, elec.archived)
                                  .backgroundColor
                              }`,
                              color: `${
                                getButtonColors(elec.status, elec.archived)
                                  .textColor
                              }`
                            }}
                          >
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-sm font-medium">
                                {elec.name}
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
                                    getButtonColors(elec.status, elec.archived)
                                      .textColor
                                  }`}
                                />
                              </svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p>None</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
