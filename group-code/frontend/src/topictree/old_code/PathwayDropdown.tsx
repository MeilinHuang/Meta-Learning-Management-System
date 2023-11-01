import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  UserCircleIcon,
  ChevronDownIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

import {
  useGetPathwaysQuery,
  useIsSuperuserQuery
} from '../../features/api/apiSlice';
import { useState, useEffect } from 'react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type currPathT = { id: number; name: string; user: boolean };
type PathwayDropdownProps = { currPath: currPathT; setCurrPath: any };

export default function PathwayDropdown({
  currPath,
  setCurrPath
}: PathwayDropdownProps) {
  // TODO: error handling

  //Why are the constants written over immediately??
  const {
    data: userPathsData,
    error: errorUserPaths,
    isLoading: isLoadingUserPaths,
    isSuccess: isSuccessUserPaths
  } = useGetPathwaysQuery(true);
  const { data, error, isLoading, isSuccess } = useGetPathwaysQuery(false);

  const { data: superuserData, error: superuserError } =
    useIsSuperuserQuery(null);

  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperuser(true);
    }
  }, [superuserData]);

  return (
    <Menu as="div" className="mt-1 ml-1 md:mt-0 relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100">
          {currPath.name}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 divide-y divide-gray-100 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {!isSuperuser && (
            <div>
              <div className="flex px-4 items-center">
                <UserCircleIcon
                  className="mr-2 h-5 w-5 text-gray-900"
                  aria-hidden="true"
                />
                <p className="block text-sm font-medium text-gray-900 py-2">
                  My Pathways
                </p>
              </div>
              {isSuccess &&
                isSuccessUserPaths &&
                userPathsData.pathways.map((pathway: any) => {
                  return (
                    <Menu.Item key={pathway.id}>
                      {({ active }) => (
                        <a
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900 cursor-pointer'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() => {
                            setCurrPath({
                              id: pathway.id,
                              name: pathway.name,
                              user: true
                            });
                          }}
                        >
                          {pathway.name}
                        </a>
                      )}
                    </Menu.Item>
                  );
                })}
            </div>
          )}
          <div>
            {!isSuperuser && (
              <div className="flex px-4 items-center">
                <ArchiveBoxIcon
                  className="mr-2 h-[18px] w-[18px] text-gray-900"
                  aria-hidden="true"
                />
                <p className="block text-sm font-medium text-gray-900 py-2">
                  Other Pathways
                </p>
              </div>
            )}
            {isSuccess &&
              isSuccessUserPaths &&
              data.pathways.map((pathway: any) => {
                // only show in other pathways if user has not joined path
                if (
                  userPathsData.pathways.filter(
                    (userPath: any) => userPath.id == pathway.id
                  ).length === 0
                ) {
                  return (
                    <Menu.Item key={pathway.id}>
                      {({ active }) => (
                        <a
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900 cursor-pointer'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() => {
                            setCurrPath({
                              id: pathway.id,
                              name: pathway.name,
                              user: false
                            });
                          }}
                        >
                          {pathway.name}
                        </a>
                      )}
                    </Menu.Item>
                  );
                }
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

// max-h-46 overflow-y-scroll
