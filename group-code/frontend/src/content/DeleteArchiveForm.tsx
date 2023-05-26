import { useParams, useNavigate } from 'react-router-dom';
import { WarningAlert } from '../common/Alert';
import {
  useArchiveTopicMutation,
  useDeleteTopicMutation,
  useGetTopicInfoQuery
} from '../features/api/apiSlice';

export default function DeleteArchiveForm() {
  const { topicId } = useParams();
  const navigate = useNavigate();

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

  return (
    <div>
      <WarningAlert
        message="Archiving a topic makes it inaccessible to students. Deleting a topic permanently removes it from the LMS."
        noSpace
      />
      <div className="mt-4 w-full flex justify-center">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
