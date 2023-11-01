import { useDeletePrerequisiteMutation } from 'features/api/apiSlice';
import React, { useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { classNames, getButtonColors } from './topicTreeHelpers';
import { currPathT } from './types';
import { WarningAlert } from 'common/Alert';

type DeletePrerequisiteProps = {
  setSelection: (
    node: Node | string | null,
    edge: Edge | string | null
  ) => void;
  selectedPrereq: Edge;
  currPathTopicNames: Array<string>;
};

export default function DeletePrerequisite(props: DeletePrerequisiteProps) {
  const [
    deletePrerequisite,
    { data: prereqDeleteData, isSuccess: isSuccessDeletePrereq }
  ] = useDeletePrerequisiteMutation();
  const [checkedWarning, setCheckedWarning] = useState<boolean>(false);

  return (
    <div>
      <div className="flex flex-col items-center">
        <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
          Currenlty viewing Prerequisite Set:
        </h2>
      </div>
      <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
        <div className="rounded border-2 p-2" style={{ marginTop: '2px' }}>
          <p>
            <b>{props.selectedPrereq.data.targetName}</b> requires at least{' '}
            <b>{props.selectedPrereq.data.amount}</b> of the following topics:
          </p>
          {props.selectedPrereq.data.choices.map((choice: any) => {
            return (
              <button
                key={`${props.selectedPrereq.target}_${choice.id}`}
                type="button"
                disabled={!props.currPathTopicNames.includes(choice.sourceName)}
                title={
                  props.currPathTopicNames.includes(choice.sourceName)
                    ? `Navigate to ${choice.sourceName}`
                    : `${choice.sourceName} is not present in the current pathway`
                }
                onClick={() => props.setSelection(choice.id.toString(), null)}
                className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                style={{
                  backgroundColor: `${
                    getButtonColors(choice.statusSource, choice.archivedSource)
                      .backgroundColor
                  }`,
                  color: `${
                    getButtonColors(choice.statusSource, choice.archivedSource)
                      .textColor
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
      </div>
      <WarningAlert
        message="Delete Prerequisite Set"
        description="This action will permanently delete this Prerequisite Set. Are you sure you want to proceed?"
        className="text-left mt-5"
        noSpace
      />
      <div className="flex items-center">
        <input
          id="checkedWarning"
          type="checkbox"
          checked={checkedWarning}
          onChange={() => setCheckedWarning((c) => !c)}
          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="checkedWarning" className="ml-2 text-left mt-5 text-sm">
          I understand that deleting is a permanent action
        </label>
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center text-sm text-center font-medium break-inside ${
          checkedWarning ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300'
        } rounded-xl px-2 py-2 my-2 w-full text-white`}
        disabled={!checkedWarning}
        title={`${
          !checkedWarning
            ? 'Please check that you understand the above before continuing'
            : 'Delete Prerequisite Set'
        }`}
        onClick={(e) => {
          e.preventDefault();
          deletePrerequisite({
            id: parseInt(props.selectedPrereq.data.prereqSetId)
          });
        }}
      >
        Permanently Delete Prerequisite Set
      </button>
    </div>
  );
}
