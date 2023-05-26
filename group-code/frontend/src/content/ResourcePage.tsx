import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/20/solid';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import Resource from './Resource';

import {
  ResourceIcon,
  formatDuration,
  capitalise,
  getNextResourceIndex,
  getPrevResourceIndex,
  getResourceLink
} from './contentHelpers';

import { ErrorAlert } from '../common/Alert';

import { useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import {
  useGetResourceQuery,
  useGetTopicResourcesQuery,
  useGetResourceSectionQuery,
  useMarkResourceCompleteMutation,
  useGetTopicPermissionQuery
} from 'features/api/apiSlice';
import { useEffect } from 'react';

export default function ResourcePage() {
  const currSection = useParams()['section'];
  const topicId = useParams()['topicId'];
  const resourceId = useParams()['resourceId'];
  const navigate = useNavigate();

  const {
    data: resourceData,
    error: resourceError,
    isLoading: resourceIsLoading
  } = useGetResourceQuery({ resource_id: resourceId });

  const {
    data: sectionData,
    error: sectionError,
    isLoading: sectionIsLoading
  } = useGetResourceSectionQuery({ resource_id: resourceId });

  const { data: resourcesData } = useGetTopicResourcesQuery({
    topic_id: topicId,
    section: currSection
  });

  const { data: userPermissionData, error: userPermissionError } =
    useGetTopicPermissionQuery({
      topic_id: Number(topicId),
      permission: 'can_manage_resources'
    });

  const [markResourceComplete, { error: markResourceCompleteError }] =
    useMarkResourceCompleteMutation();

  const [nextResId, setNextResId] = useState(-1);
  const [prevResId, setPrevResId] = useState(-1);

  useEffect(() => {
    if (resourcesData && userPermissionData) {
      setNextResId(
        getNextResourceIndex({
          currentResId: Number(resourceId),
          resources: resourcesData.resources
        })
      );
      setPrevResId(
        getPrevResourceIndex({
          currentResId: Number(resourceId),
          resources: resourcesData.resources
        })
      );

      if (!userPermissionData['can_manage_resources']) {
        // Track progress for topic students
        markResourceComplete({ resource_id: Number(resourceId) });
      }
    }
  }, [resourcesData, resourceId]);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="flex justify-between mt-1 mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2">
            <li>
              <div className="flex items-center">
                <a
                  className="mr-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                  onClick={() => navigate(`/topic/${topicId}/${currSection}`)}
                >
                  {capitalise(currSection || '')}
                </a>
                <ChevronRightIcon
                  className="hidden md:flex h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </li>
            <li>
              <div className="hidden md:flex items-center">
                <a className="mr-2 text-sm font-medium text-gray-500">
                  {resourceData && resourceData.title}
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <a
          title="View in browser"
          href={
            resourceData
              ? getResourceLink({
                  serverPath: resourceData.server_path,
                  url: resourceData.url,
                  download: true,
                  resourceType: resourceData.resource_type
                })
              : '#'
          }
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          className="flex"
        >
          <span className="inline mr-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:cursor-pointer">
            {resourceData && resourceData.resource_type === 'link'
              ? 'Online resource'
              : 'Downloadable resource'}
          </span>
          {resourceData && resourceData.resource_type === 'file' ? (
            <ArrowDownTrayIcon
              className="ml-1 h-5 w-5 text-gray-500 hover:text-gray-700"
              aria-label="Downloadable resource"
            />
          ) : (
            <ArrowTopRightOnSquareIcon
              className="ml-1 h-5 w-5 text-gray-500 hover:text-gray-700"
              aria-label="Downloadable resource"
            />
          )}
        </a>
      </div>

      {/* Loading resource */}
      {resourceIsLoading && (
        <p className="mt-3 text-sm text-gray-700">Loading resource...</p>
      )}

      {/* Error loading resource */}
      {resourceError && (
        <ErrorAlert
          message="Something went wrong when fetching resource"
          description={'error' in resourceError ? resourceError.error : ''}
        />
      )}

      {/* Main page */}
      {resourceData && (
        <>
          <span className="flex flex-row justify-between items-center rounded-md">
            <button
              type="button"
              className={
                prevResId < 0
                  ? 'md:w-28 relative inline-flex items-center rounded-l-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 focus:z-10 focus-visible:outline-none'
                  : 'md:w-28 relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500'
              }
              onClick={() => {
                if (prevResId) {
                  navigate(`/topic/${topicId}/${currSection}/${prevResId}`);
                }
              }}
              disabled={prevResId < 0}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="hidden md:inline ml-2">Previous</span>
            </button>
            <div className="flex items-center">
              <ResourceIcon
                type={resourceData.resource_type}
                className="hidden md:flex text-gray-900 w-5 h-5"
              />
              <h1 className="ml-3 text-center text-md font-md leading-6 text-gray-900">
                {resourceData.title}
                <span className="hidden md:inline text-gray-500">
                  {' '}
                  • {formatDuration(resourceData.duration)}
                </span>
              </h1>
            </div>
            <button
              type="button"
              className={
                nextResId < 0
                  ? 'md:w-22 relative inline-flex items-center rounded-r-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 focus:z-10 focus-visible:outline-none'
                  : 'md:w-22 relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500'
              }
              onClick={() => {
                if (nextResId) {
                  navigate(`/topic/${topicId}/${currSection}/${nextResId}`);
                }
              }}
              disabled={nextResId < 0}
            >
              <span className="ml-6 hidden md:inline">Next</span>
              <ChevronRightIcon className="ml-1 h-5 w-5" aria-hidden="true" />
            </button>
          </span>
          <p className="mt-4 text-sm text-gray-900">
            {resourceData.description}
          </p>
          <Resource
            url={getResourceLink({
              serverPath: resourceData.server_path,
              url: resourceData.url,
              resourceType: resourceData.resource_type
            })}
            title={resourceData.title}
            type={resourceData.resource_type}
            id={resourceData.id + ''}
          />
          {/* Forum button */}
          <div className="w-full flex justify-center mt-6 mb-6">
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                if (sectionData && sectionData.id) {
                  navigate(`/forum/${topicId}/${sectionData.id}`);
                }
              }}
            >
              <ChatBubbleBottomCenterTextIcon
                className="-ml-0.5 h-5 w-5"
                aria-hidden="true"
              />
              Resource Forum
            </button>
          </div>
        </>
      )}
    </div>
  );
}
