import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import { useGetEnrolledTopicsQuery } from 'features/api/apiSlice';

export default function EnrolledTopics() {
  const {
    data: topicsData,
    error: topicsError,
    isLoading: topicsIsLoading
  } = useGetEnrolledTopicsQuery({});

  const navigate = useNavigate();

  const [topics, setTopics] = useState<
    Array<{ id: number; image_url: string; topic_name: string }>
  >([]);

  useEffect(() => {
    if (topicsData) {
      setTopics(topicsData.topics);
    }
  }, [topicsData]);

  return (
    <ul
      role="list"
      className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {topics.map((topic) => (
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
      ))}
    </ul>
  );
}
