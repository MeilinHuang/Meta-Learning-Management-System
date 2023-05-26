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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Title
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
                    Topic
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Section
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">View in browser</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {resource.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {resource.resource_type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {resource.topic}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {resource.section}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
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
