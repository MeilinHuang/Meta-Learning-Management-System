import { useParams, useNavigate } from 'react-router-dom';
import { WarningAlert, ErrorAlert, ConfirmAlert } from '../common/Alert';
import React, { ChangeEvent, MouseEventHandler, FC, useState } from 'react';
import {
  useArchiveTopicMutation,
  useDeleteTopicMutation,
  useGetTopicInfoQuery
} from '../features/api/apiSlice';
import AccountService from '../account/AccountService';
import { stringify } from 'querystring';
export default function DeleteArchiveForm() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [archiveTopic, { isSuccess: isSuccessArchiveTopic }] =
    useArchiveTopicMutation();

  const [deleteTopic, { isSuccess: isSuccessTopicDelete }] =
    useDeleteTopicMutation();

  const {
    data: topicInfoData,
    error: topicInfoError,
    isLoading: topicInfoIsLoading,
    isSuccess: topicInfoIsSuccess,
    isFetching: topicInfoIsFetching
  } = useGetTopicInfoQuery({
    topic_id: topicId
  });

  const exportTopic = () => {
    if (!isLoading) {
      const param = {topicId: topicId}
      setIsLoading(true)
      AccountService.exportTopic(param)
        .then((response) => {
          console.log(response.data)
          console.log(Object.keys(response.data))
          if (response.data && Object.keys(response.data).includes("topic")) {
            const link = document.createElement("a");
            const file = new Blob([response.data["topic"]], { type: 'text/plain' });
            link.href = URL.createObjectURL(file);
            link.download = "MetaLMS_Topic_" + response.data["topic_name"] + ".txt";
            link.click();
            URL.revokeObjectURL(link.href);
          }
          setIsLoading(false)
        });
    }
  };

  
  return (
    <div>
      <ConfirmAlert
        message="Exporting a topic will download a Meta LMS Topic. This file can be imported via the topic tree."
        noSpace
      />
      <WarningAlert
        message="Archiving a topic makes it inaccessible to students."
        noSpace
      />
      <ErrorAlert
        message="Deleting a topic permanently removes it from the LMS."
        noSpace
      />
      <div className="mt-4 w-full flex justify-center">
        <button
          type="submit"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => exportTopic()}
        >
          {!isLoading
          ? "Export Topic"
          : "Loading..."
          }
        </button>
        <button
          type="submit"
          className="ml-4 rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            archiveTopic({
              id: Number(topicId),
              archive: !topicInfoData.archived
            });
          }}
        >
          {topicInfoData.archived ? 'Unarchive Topic' : 'Archive Topic'}
        </button>
        <button
          type="submit"
          className="ml-4 rounded-md bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            deleteTopic({ id: Number(topicId) });
            navigate('/topictree');
          }}
        >
          Delete Topic
        </button>
      </div>
    </div>
  );
}
