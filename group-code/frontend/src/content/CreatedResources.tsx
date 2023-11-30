import { getResourceLink } from './contentHelpers';
import { useGetCreatedResourcesQuery } from 'features/api/apiSlice';
import { useNavigate } from 'react-router-dom';

export default function CreatedResources() {
  const {
    data: resourcesData,
    error: resourcesError,
    isLoading: resourcesIsLoading
  } = useGetCreatedResourcesQuery(null);

  const navigate = useNavigate();

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full text-sm text-left divide-y divide-gray-300 text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-10 py-3.5 text-sm font-bold text-gray-900 sm:pl-6"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-10 py-3.5 text-sm font-bold text-gray-900"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-10 py-3.5 text-sm font-bold text-gray-900"
                  >
                    Topic
                  </th>
                  <th
                    scope="col"
                    className="px-10 py-3.5 text-sm font-bold text-gray-900"
                  >
                    Section
                  </th>
                  <th scope="col" className="px-10 relative py-3.5 sm:pr-6">
                    <span className="sr-only">View in browser</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(resourcesData === undefined || resourcesData.length === 0) && (
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="h-10 col-span-5 text-center font-semibold text-sm capitalize">No resources Data Available</td>
                    <td></td>
                    <td></td>
                  </tr>
                )}
                {resourcesData &&
                  resourcesData.map(
                    (resource: {
                      id: number;
                      title: string;
                      resource_type: string;
                      topic: string;
                      topic_id: number;
                      section: string;
                      url: string;
                      server_path: string;
                    }) => (
                      <tr
                        key={resource.id}
                        className="hover:cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          navigate(
                            `/topic/${resource.topic_id}/${resource.section}/${resource.id}`
                          );
                        }}
                      >
                        <td className="whitespace-normal px-10 py-4 text-sm font-semibold text-gray-900 sm:pl-0 capitalize">
                          {resource.title}
                        </td>
                        <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                          {resource.resource_type}
                        </td>
                        <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                          {resource.topic}
                        </td>
                        <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                          {resource.section}
                        </td>
                        <td className="relative whitespace-normal px-10 py-4 text-right text-sm font-semibold sm:pr-6">
                          <a
                            title="View in browser"
                            href={getResourceLink({
                              serverPath: resource.server_path,
                              url: resource.url,
                              download: true,
                              resourceType: resource.resource_type
                            })}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
