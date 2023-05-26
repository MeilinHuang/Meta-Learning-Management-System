import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/20/solid';

export function WarningAlert({
  message,
  description,
  className,
  noSpace
}: {
  message: string;
  description?: string;
  className?: string;
  noSpace?: boolean;
}) {
  return (
    <div className={noSpace ? '' : 'pt-20 mx-4'}>
      <div className={`rounded-md bg-yellow-50 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">{message}</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorAlert({
  message,
  description,
  className,
  noSpace
}: {
  message: string;
  description?: string;
  className?: string;
  noSpace?: boolean;
}) {
  return (
    <div className={noSpace ? '' : 'pt-20 mx-4'}>
      <div className={`rounded-md bg-red-50 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{message}</h3>
            <p className="mt-2 text-sm text-red-700">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfirmAlert({
  message,
  description,
  className,
  noSpace
}: {
  message: string;
  description?: string;
  className?: string;
  noSpace?: boolean;
}) {
  return (
    <div className={noSpace ? '' : 'pt-20 mx-4'}>
      <div className={`rounded-md bg-green-50 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">{message}</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
