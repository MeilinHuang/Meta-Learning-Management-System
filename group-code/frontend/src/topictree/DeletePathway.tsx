import { useDeletePathwayMutation } from 'features/api/apiSlice';
import React, { useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { classNames } from './topicTreeHelpers';
import { currPathT } from './types';
import { WarningAlert } from 'common/Alert';

type DeletePathwayProps = {
  pathwayId: number;
  pathwayName: string;
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
  setCurrPath: (currPath: currPathT) => void;
  setTabOpen: (
    tab: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete'
  ) => void;
  setSelectedSubTab: (tab: 'Topic' | 'Pathway' | 'Pre-requisite') => void;
};

export default function DeletePathway(props: DeletePathwayProps) {
  const [
    deletePathway,
    { data: pathwayDeleteData, isSuccess: isSuccessDeletePathway }
  ] = useDeletePathwayMutation();
  const [checkedWarning, setCheckedWarning] = useState<boolean>(false);

  return (
    <>
      {props.globalPathData.data &&
      'id' in props.globalPathData.data &&
      props.globalPathData.data.id !== null &&
      props.globalPathData.data.id !== undefined ? (
        <>
          {props.pathwayId === Number(props.globalPathData.data.id) ? (
            <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
              Cannot Delete <b>{props.globalPathData.data.name}</b>
            </h2>
          ) : (
            <>
              {props.currPathData.isFetching && (
                <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
                  {' '}
                  Loading ...{' '}
                </h2>
              )}
              {props.currPathData.error && (
                <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
                  {' '}
                  An error occured when getting information on Pathway:{' '}
                  <b>{props.pathwayName}</b>. Please contact your admin.
                </h2>
              )}
              {props.currPathData.isSuccess && (
                <div>
                  <div className="flex flex-col items-center">
                    <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
                      Currently viewing: <b>{props.pathwayName}</b>
                    </h2>
                  </div>
                  <WarningAlert
                    message="Delete pathway"
                    description="This action will permanently delete this Pathway. Are you sure you want to proceed?"
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
                    <label
                      htmlFor="checkedWarning"
                      className="ml-2 text-left mt-5 text-sm"
                    >
                      I understand that deleting is a permanent action
                    </label>
                  </div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center text-sm text-center font-medium break-inside ${
                      checkedWarning
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-red-300'
                    } rounded-xl px-2 py-2 my-2 w-full text-white`}
                    disabled={!checkedWarning}
                    title={`${
                      !checkedWarning
                        ? 'Please check that you understand the above before continuing'
                        : 'Delete Pathway'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      deletePathway({
                        pathway_id: Number(props.pathwayId)
                      });
                      props.setCurrPath({
                        id: Number(props.globalPathData.data.id),
                        name: props.globalPathData.data.name,
                        user: true
                      });
                      props.setSelectedSubTab('Pathway');
                      props.setTabOpen('details');
                    }}
                  >
                    Permanently Delete Pathway
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <h2> Loading ... </h2>
      )}
    </>
  );
}
