import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import { useGetEnrolledTopicsQuery, useIsSuperuserQuery } from 'features/api/apiSlice';

export default function EnrolledTopics() {
  const [accessCode, setAccessCode] = useState<string|null>(localStorage.getItem('access_token'));

  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
  const { data: superuserData, error: superuserError, isLoading: superuserIsLoading } = useIsSuperuserQuery(null);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== accessCode) {
      setAccessCode(localStorage.getItem('access_token'));
    }
  }, [localStorage.getItem('access_token')]);

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperuser(true);
    } else if (superuserData) {
      setIsSuperuser(false);
    }
  }, [superuserData]);

  const {
    data: topicsData,
    error: topicsError,
    isLoading: topicsIsLoading
  } = useGetEnrolledTopicsQuery({access_token: accessCode, forceRefresh: false});

  const navigate = useNavigate();

  const [topicsCompleted, setTopicsCompleted] = useState<
    Array<{ id: number; image_url: string; topic_name: string}>
  >([]);
  const [topicsEnrolled, setTopicsEnrolled] = useState<
  Array<{ id: number; image_url: string; topic_name: string}>
  >([]);

  useEffect(() => {
    if (topicsData) {
      setTopicsCompleted(topicsData.topics.filter( (t: any) => t.complete));
      setTopicsEnrolled(topicsData.topics.filter( (t: any) => !t.complete));
    }
  }, [topicsData]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="py-1">
        <div className="rounded-lg border-gray-200">
        {(superuserIsLoading || topicsIsLoading) 
          ? <h2 className='py-3 text-xl font-semibold text-gray-900'> Loading ...</h2>
          :<>
            { isSuperuser
            ? <ul
                role="list"
                className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
              { topicsEnrolled.concat(topicsCompleted).map((topic) => (
                <li
                  key={topic.id}
                  className="hover:cursor-pointer hover:bg-gray-50 border col-span-1 flex flex-col rounded-lg bg-white text-center shadow"
                  onClick={() => {
                    navigate(`/topic/${topic.id}/preparation`);
                  }}
                >
                  <div className="flex flex-1 flex-col">
                    <img
                      className="mx-auto h-40 w-full flex-shrink-0 rounded-t-lg"
                      src={topic.image_url}
                      alt=""
                    />
                    <h3 className="py-4 text-sm font-semibold text-gray-900">
                      {topic.topic_name}
                    </h3>
                  </div>
                </li>
              ))}</ul>
            : <>
            <h2 className='py-3 text-xl font-semibold text-gray-900'> In Progress </h2>
            <ul
                role="list"
                className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
            { topicsEnrolled.map((topic) => (
              <li
                key={topic.id}
                className="hover:cursor-pointer hover:bg-gray-50 border col-span-1 flex flex-col rounded-lg bg-white text-center shadow"
                onClick={() => {
                  navigate(`/topic/${topic.id}/preparation`);
                }}
              >
                <div className="flex flex-1 flex-col">
                  <img
                    className="mx-auto h-40 w-full flex-shrink-0 rounded-t-lg"
                    src={topic.image_url}
                    alt=""
                  />
                  <h3 className="py-4 text-sm font-semibold text-gray-900">
                    {topic.topic_name}
                  </h3>
                </div>
              </li>
            ))}</ul>
            <h2 className='py-3 text-xl font-semibold text-gray-900'> Completed </h2>
            <ul
                role="list"
                className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
            { topicsCompleted.map((topic) => (
              <li
                key={topic.id}
                className="hover:cursor-pointer hover:bg-gray-50 border col-span-1 flex flex-col rounded-lg bg-white text-center shadow"
                onClick={() => {
                  navigate(`/topic/${topic.id}/preparation`);
                }}
              >
                <div className="flex flex-1 flex-col">
                  <img
                    className="mx-auto h-40 w-full flex-shrink-0 rounded-t-lg"
                    src={topic.image_url}
                    alt=""
                  />
                  <h3 className="py-4 text-sm font-semibold text-gray-900">
                    {topic.topic_name}
                  </h3>
                </div>
              </li>
            ))}</ul></>
            }
          </>
        }
        </div>
      </div>
    </div>
  );
}
