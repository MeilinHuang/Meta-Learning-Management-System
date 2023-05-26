import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function PostCreatorError(props: {
  error: string;
  dismissCallback: () => void;
}) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Attention needed</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{props.error}</p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon
                className="h-5 w-5"
                aria-hidden="true"
                onClick={props.dismissCallback}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
