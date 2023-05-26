import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/20/solid';

import {
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

import {
  ResourceIcon,
  formatDuration,
  getResourceLink,
  getSortedResources
} from './contentHelpers';

import {
  useGetTopicResourcesQuery,
  useGetTopicPermissionQuery,
  useMarkResourceCompleteMutation,
  useRearrangeResourceMutation
} from 'features/api/apiSlice';

import { ErrorAlert } from '../common/Alert';

export default function ResourcesList({
  setEditOpen,
  setSelectedRes,
  setDeleteOpen,
  rearrange
}: {
  setEditOpen: any;
  setSelectedRes: any;
  setDeleteOpen: any;
  rearrange: boolean;
}) {
  const topicId = useParams()['topicId'];
  const currSection = useParams()['section'] || 'Preparation';

  const navigate = useNavigate();

  const [canManageResources, setCanManageResources] = useState(false);

  const [rearrangeResource, { error: rearrangeResourceError }] =
    useRearrangeResourceMutation();

  const {
    data: resourcesData,
    error: resourcesError,
    isLoading: resourcesIsLoading
  } = useGetTopicResourcesQuery({ topic_id: topicId, section: currSection });

  const { data: userPermissionData, error: userPermissionError } =
    useGetTopicPermissionQuery({
      topic_id: Number(topicId),
      permission: 'can_manage_resources'
    });

  const [markResourceComplete, { error: markResourceError }] =
    useMarkResourceCompleteMutation();

  useEffect(() => {
    if (userPermissionData && userPermissionData['can_manage_resources']) {
      setCanManageResources(true);
    }
  }, [userPermissionData]);

  return (
    <div className="overflow-hidden bg-white mt-2">
      {resourcesData && resourcesData.resources.length === 0 && (
        <p className="mt-3 text-sm text-gray-700">
          No resources in {currSection.toLowerCase()}.
        </p>
      )}
      <ul role="list" className="divide-y divide-gray-200">
        {resourcesIsLoading && (
          <p className="mt-3 text-sm text-gray-700">Loading resources...</p>
        )}
        {resourcesError && (
          <ErrorAlert
            message="Something went wrong when fetching topic resources"
            description={'error' in resourcesError ? resourcesError.error : ''}
            noSpace
          />
        )}
        {resourcesData &&
          getSortedResources(resourcesData.resources).map(
            (
              resource: {
                id: number;
                resource_type: string;
                title: string;
                duration: number;
                server_path: string;
                url: string;
                complete: boolean;
                order_index: number;
                section: string;
              },
              index
            ) => (
              <li
                key={resource.id}
                onClick={() => {
                  navigate(`/topic/${topicId}/${currSection}/${resource.id}`);
                }}
              >
                <div className="block hover:bg-gray-50 hover:cursor-pointer">
                  <div className="flex items-center">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0 flex-1 flex items-center justify-between">
                        <div className="flex py-4 pl-4">
                          {ResourceIcon({
                            type: resource.resource_type,
                            className:
                              'mr-3 h-5 w-5 flex-shrink-0 text-indigo-500'
                          })}
                          <span className="flex items-center truncate text-sm font-medium text-indigo-600">
                            {resource.title}
                          </span>
                          <span className="ml-2 md:flex items-center text-sm text-gray-500 hidden">
                            • {resource.resource_type}
                          </span>
                          {resource.complete && !canManageResources && (
                            <CheckBadgeIcon className="ml-3 mr-3 h-5 w-5 flex-shrink-0 text-indigo-500" />
                          )}
                        </div>
                        <div className="flex">
                          <span className="text-sm md:flex items-center mr-4 text-gray-700 hidden">
                            {formatDuration(resource.duration)}
                          </span>
                          {rearrange ? (
                            <span className="flex">
                              {/* Edit / delete resources */}
                              {canManageResources && (
                                <>
                                  {index === 0 ? (
                                    <div className="px-3 py-4 h-full">
                                      <div className="h-5 w-5"></div>
                                    </div>
                                  ) : (
                                    <div
                                      className="hover:bg-gray-100 px-3 py-4 h-full z-10"
                                      onClick={(e) => {
                                        rearrangeResource({
                                          resource_id: resource.id,
                                          section: resource.section,
                                          topic_id: Number(topicId),
                                          direction: true,
                                          order_index: resource.order_index
                                        });
                                        e.stopPropagation();
                                      }}
                                    >
                                      <a title="Move resource up" href="#">
                                        <ArrowUpIcon className="h-5 w-5 text-gray-600" />
                                      </a>
                                    </div>
                                  )}
                                  {index ===
                                  resourcesData.resources.length - 1 ? (
                                    <div className="px-3 py-4 h-full">
                                      <div className="h-5 w-5"></div>
                                    </div>
                                  ) : (
                                    <div
                                      className="hover:bg-gray-100 px-3 py-4 h-full z-10"
                                      onClick={(e) => {
                                        rearrangeResource({
                                          resource_id: resource.id,
                                          section: resource.section,
                                          topic_id: Number(topicId),
                                          direction: false,
                                          order_index: resource.order_index
                                        });

                                        e.stopPropagation();
                                      }}
                                    >
                                      <a title="Move resource down" href="#">
                                        <ArrowDownIcon className="h-5 w-5 text-gray-600" />
                                      </a>
                                    </div>
                                  )}
                                </>
                              )}
                            </span>
                          ) : (
                            <span className="flex">
                              {/* Edit / delete resources */}
                              {canManageResources && (
                                <>
                                  <div
                                    className="hover:bg-gray-100 px-3 py-4 h-full z-10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteOpen(true);
                                      setSelectedRes(resource.id);
                                    }}
                                  >
                                    <a title="Delete resource" href="#">
                                      <TrashIcon className="h-5 w-5 text-gray-700" />
                                    </a>
                                  </div>
                                  <div
                                    className="hover:bg-gray-100 px-3 py-4 h-full z-10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditOpen(true);
                                      setSelectedRes(resource.id);
                                    }}
                                  >
                                    <a title="Edit resource" href="#">
                                      <PencilIcon className="h-5 w-5 text-gray-700" />
                                    </a>
                                  </div>
                                </>
                              )}
                              <a
                                title="View in browser"
                                className="hover:bg-gray-100 px-3 py-4 h-full z-10"
                                href={getResourceLink({
                                  serverPath: resource.server_path,
                                  url: resource.url,
                                  download: true,
                                  resourceType: resource.resource_type
                                })}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!canManageResources) {
                                    // Track progress for topic students
                                    markResourceComplete({
                                      resource_id: resource.id
                                    });
                                  }
                                }}
                                target={
                                  resource.resource_type === 'file'
                                    ? '_self'
                                    : '_blank'
                                }
                              >
                                {resource.resource_type === 'file' ? (
                                  <ArrowDownTrayIcon className="h-5 w-5 text-gray-700" />
                                ) : (
                                  <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-700" />
                                )}
                              </a>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          )}
      </ul>
    </div>
  );
}
