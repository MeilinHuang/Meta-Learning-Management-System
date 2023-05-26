import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetZipPathQuery,
  useGetTopicResourcesQuery
} from 'features/api/apiSlice';

import { SERVER } from 'content/contentHelpers';

import {
  useGetTopicPermissionQuery,
  useResetProgressMutation
} from 'features/api/apiSlice';

export default function TopicToolbar({
  setOpen,
  rearrange,
  setRearrange
}: {
  setOpen: any;
  rearrange: boolean;
  setRearrange: any;
}) {
  const [zipPath, setZipPath] = useState('#');

  const topicId = useParams()['topicId'];
  const currSection = useParams()['section'];
  const [canManageResources, setCanManageResources] = useState(false);

  const {
    data: resourcesData,
    error: resourcesError,
    isLoading: resourcesIsLoading
  } = useGetTopicResourcesQuery({ topic_id: topicId, section: currSection });

  const {
    data: zipPathData,
    error: zipPathError,
    isLoading: zipPathIsLoading
  } = useGetZipPathQuery({ topic_id: topicId, section: currSection });

  const { data: userPermissionData, error: userPermissionError } =
    useGetTopicPermissionQuery({
      topic_id: Number(topicId),
      permission: 'can_manage_resources'
    });

  const [resetProgress, { error: resetProgressError }] =
    useResetProgressMutation();

  useEffect(() => {
    if (zipPathData) {
      setZipPath(SERVER + zipPathData.server_path);
    }
  }, [zipPathData]);

  useEffect(() => {
    if (userPermissionData && userPermissionData['can_manage_resources']) {
      setCanManageResources(true);
    }
  }, [userPermissionData]);

  return (
    <>
      <div className="flex justify-end">
        {resourcesData &&
          resourcesData.resources.length > 0 &&
          !canManageResources && (
            <button
              type="button"
              className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              onClick={() => {
                resetProgress({ topic_id: topicId, section: currSection });
              }}
            >
              Reset Progress
            </button>
          )}
        {resourcesData && resourcesData.resources.length > 0 && (
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <a href={zipPath} download>
              Download All
            </a>
          </button>
        )}
        {resourcesData &&
          resourcesData.resources.length > 0 &&
          canManageResources && (
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              onClick={() => {
                setRearrange(!rearrange);
              }}
            >
              {rearrange ? 'Stop Rearranging' : 'Rearrange'}
            </button>
          )}
        {canManageResources && (
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            onClick={() => {
              setOpen(true);
            }}
          >
            Add Resource
          </button>
        )}
      </div>
    </>
  );
}
