import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type PathwayDropdownProps = {
  setShowTopicModal: any;
  setShowTopicImportModal: any;
  setShowGroupModal: any;
  setShowPrereqModal: any;
  setShowPathwayModal: any;
};

export default function PathwayDropdown({
  setShowTopicModal,
  setShowTopicImportModal,
  setShowGroupModal,
  setShowPrereqModal,
  setShowPathwayModal
}: PathwayDropdownProps) {
  return (
    <Menu as="div" className="md:mr-3 relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100">
          Create
          <PlusIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? 'bg-gray-100 text-gray-900 cursor-pointer'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => setShowTopicModal(true)}
                >
                  Topic
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? 'bg-gray-100 text-gray-900 cursor-pointer'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => setShowTopicImportModal(true)}
                >
                  Upload Topic
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? 'bg-gray-100 text-gray-900 cursor-pointer'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => setShowPrereqModal(true)}
                >
                  Prerequisite
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? 'bg-gray-100 text-gray-900 cursor-pointer'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => setShowGroupModal(true)}
                >
                  Topic Group
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? 'bg-gray-100 text-gray-900 cursor-pointer'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => setShowPathwayModal(true)}
                >
                  Pathway
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
