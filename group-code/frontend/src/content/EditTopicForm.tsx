import { useEffect, useState } from 'react';
import {
  useArchiveTopicMutation,
  useDeleteTopicMutation,
  useEditTopicMutation,
  useGetPathwayQuery,
  useGetTopicGroupsQuery,
  useGetTopicInfoQuery
} from 'features/api/apiSlice';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import {
  PlusIcon as PlusIconMini,
  ArchiveBoxIcon,
  TrashIcon,
  PencilSquareIcon,
  PaperAirplaneIcon
} from '@heroicons/react/20/solid';

export default function EditTopicForm() {
  const { topicId } = useParams();

  const {
    data: topicInfoData,
    error: topicInfoError,
    isLoading: topicInfoIsLoading,
    isSuccess: topicInfoIsSuccess,
    isFetching: topicInfoIsFetching
  } = useGetTopicInfoQuery({
    topic_id: topicId
  });

  // topic details
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [prereqSets, setPrereqSets] = useState<
    { amount: number; choices: Array<{ id: number; name: string }> }[]
  >([]);
  const [topicGroup, setTopicGroup] = useState<{
    label: string;
    value: string;
  }>();

  // topic and group select data
  const [formattedGroups, setFormattedGroups] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [formattedTopics, setFormattedTopics] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const {
    data: globalPathData,
    error: errorPath,
    isLoading: isLoadingPath,
    isFetching: isFetchingPath,
    isSuccess: isSuccessPath
  } = useGetPathwayQuery({
    pathway_id: 0,
    user: false
  });

  const {
    data: groupsData,
    error: errorGroups,
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    isSuccess: isSuccessGroups
  } = useGetTopicGroupsQuery(null);

  const [editTopic, { data: topicEditData, isSuccess: isSuccessEditTopic }] =
    useEditTopicMutation();

  const [archiveTopic, { isSuccess: isSuccessArchiveTopic }] =
    useArchiveTopicMutation();

  const [deleteTopic, { isSuccess: isSuccessTopicDelete }] =
    useDeleteTopicMutation();

  useEffect(() => {
    if (!isFetchingGroups && isSuccessGroups) {
      setFormattedGroups(
        groupsData.topic_groups.map((group: any) => {
          return {
            value: `${group.id}`,
            label: group.name
          };
        })
      );
    }
  }, [isFetchingGroups]);

  useEffect(() => {
    if (!isFetchingPath && isSuccessPath) {
      setFormattedTopics(
        globalPathData.electives.map((topic: any) => {
          return {
            value: `${topic.id}`,
            label: topic.name
          };
        })
      );
    }
  }, [isFetchingPath]);

  useEffect(() => {
    if (topicInfoData) {
      setName(topicInfoData.title);
      setImageUrl(topicInfoData.image_url);
      setDescription(topicInfoData.description);

      if (topicInfoData.topic_group) {
        setTopicGroup({
          label: topicInfoData.topic_group.name,
          value: topicInfoData.topic_group.id
        });
      } else {
        setTopicGroup(undefined);
      }

      setPrereqSets(topicInfoData.sets);
    }
  }, [topicInfoData]);

  return (
    <div>
      {/* Topic name */}
      <div className="w-full flex flex-col items-start">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Title*
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            name="name"
            id="name"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      {/* Topic group */}
      <div className="w-full flex flex-col items-start mt-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Topic group
        </label>
        <Select
          name="group"
          options={formattedGroups}
          className="basic-multi-select mt-1 block w-full text-sm text-left"
          classNamePrefix="select"
          maxMenuHeight={100}
          value={topicGroup}
          onChange={(e) => {
            if (e) {
              const group = formattedGroups.filter(
                (group) => group.value === e.value
              )[0];
              setTopicGroup(group);
            }
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary25: '#eef2ff',
              primary: '#818cf8'
            }
          })}
        />
      </div>
      {/* Topic image */}
      <div className="w-full flex flex-col items-start mt-4">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            name="image"
            id="image"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
      </div>
      {/* Topic description */}
      <div className="w-full flex flex-col items-start mt-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <div className="mt-1 w-full">
          <textarea
            id="description"
            name="description"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      {/* Topic prerequisites */}
      <div className="w-full flex flex-col items-start mt-5">
        <div className="w-full flex items-center justify-between">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Prerequisites
          </label>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            onClick={() => {
              setPrereqSets([
                ...prereqSets,
                {
                  amount: 1,
                  choices: []
                }
              ]);
            }}
          >
            <PlusIconMini className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {/* Prerequisites */}
        {prereqSets.length > 0 && (
          <div className="w-full flex">
            <div className="flex items-center mr-3 w-1/4">
              <label className="ml-8 mr-3 block text-sm text-gray-700 text-left">
                Amount
              </label>
            </div>
            <div className="w-3/4">
              <label className="w-3/4 block text-sm text-gray-700 text-left">
                Choices
              </label>
            </div>
          </div>
        )}
        {prereqSets.map((set, indx) => {
          return (
            <div key={indx} className="w-full flex">
              <div className="flex items-center mr-3 w-1/4 mt-1">
                <button
                  type="button"
                  className="rounded-full mr-2 items-center justify-center bg-white p-1 text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    setPrereqSets([
                      ...prereqSets.slice(0, indx),
                      ...prereqSets.slice(indx + 1)
                    ]);
                  }}
                >
                  <TrashIcon
                    className="h-5 w-5 text-indigo-600"
                    aria-hidden="true"
                  />
                </button>
                <div>
                  <input
                    onChange={(e) =>
                      setPrereqSets([
                        ...prereqSets.slice(0, indx),
                        {
                          ...prereqSets[indx],
                          amount: e.target.value ? Number(e.target.value) : 1
                        },
                        ...prereqSets.slice(indx + 1)
                      ])
                    }
                    type="number"
                    value={prereqSets[indx].amount}
                    min={1}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="w-3/4">
                <Select
                  name="prerequisites"
                  options={formattedTopics}
                  isMulti
                  className="basic-multi-select mt-1 block w-full text-sm text-left"
                  classNamePrefix="select"
                  maxMenuHeight={90}
                  onChange={(e) => {
                    setPrereqSets([
                      ...prereqSets.slice(0, indx),
                      {
                        ...prereqSets[indx],
                        choices: e.map((prereq: any) => {
                          return {
                            id: Number(prereq.value),
                            name: prereq.label
                          };
                        })
                      },
                      ...prereqSets.slice(indx + 1)
                    ]);
                  }}
                  value={prereqSets[indx].choices.map((choice) => {
                    return {
                      value: '' + choice.id,
                      label: choice.name
                    };
                  })}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      primary25: '#eef2ff',
                      primary: '#818cf8'
                    }
                  })}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            const verifiedPrereqSets: Array<{
              amount: number;
              choices: number[];
            }> = [];
            prereqSets.forEach((prereqSet) => {
              if (
                prereqSet.amount > 0 &&
                prereqSet.choices.length > 0 &&
                prereqSet.amount <= prereqSet.choices.length
              ) {
                verifiedPrereqSets.push({
                  amount: prereqSet.amount,
                  choices: prereqSet.choices.map((choice) => choice.id)
                });
              }
            });

            editTopic({
              id: topicId,
              name,
              topic_group_id: topicGroup ? Number(topicGroup.value) : null,
              image_url: imageUrl,
              description,
              sets: verifiedPrereqSets
            });
          }}
        >
          Edit Topic
        </button>
      </div>
    </div>
  );
}
