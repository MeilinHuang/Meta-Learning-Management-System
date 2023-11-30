import { Fragment, useEffect, useRef, useState } from 'react';
import { Listbox, Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { PlusIcon as PlusIconMini } from '@heroicons/react/20/solid';
import Select from 'react-select';

import { useEnrolInTopicMutation } from '../../features/api/apiSlice';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type CreateTopicModalProps = {
  open: boolean;
  setOpen: any;
  topicId: number;
  topicName: string;
};

export default function TopicEnrolModal({
  open,
  setOpen,
  topicId,
  topicName
}: CreateTopicModalProps) {
  const cancelButtonRef = useRef(null);

  const [
    enrolInTopic,
    { data: topicEnrolData, isSuccess: isSuccessTopicEnrol }
  ] = useEnrolInTopicMutation();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed bottom-0 right-0 left-0 top-16 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="mb-5">
                  <div className="mx-auto flex items-center justify-center rounded-full">
                    <QuestionMarkCircleIcon
                      className="h-10 w-10 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Enrol in {topicName}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Would you like to enrol in this topic?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={() => {
                      enrolInTopic({
                        user_id: localStorage.getItem('user_id'),
                        topic_id: topicId
                      });
                      setOpen(false);
                    }}
                  >
                    Enrol
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => {
                      setOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
