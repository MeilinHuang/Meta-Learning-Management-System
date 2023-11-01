import {
  useDeleteTopicMutation,
  useEditPrerequisiteMutation,
  useDeletePrerequisiteMutation
} from 'features/api/apiSlice';
import React, { useEffect, useState } from 'react';
import { Edge, Node } from 'reactflow';
import { currPathT, prereqSetNodeT } from './types';
import { GenericGraphAdapter } from 'incremental-cycle-detect';
import { getButtonColors } from './topicTreeHelpers';
import { WarningAlert } from 'common/Alert';

type DeleteTopicProps = {
  setSelection: (
    node: Node | string | null,
    edge: Edge | string | null
  ) => void;
  currPathTopicNames: Array<string>;
  selectedTopic: Node;
  globalNodes: Node[];
  graphForDetectingCycles: GenericGraphAdapter<any, any>;
};

const findModifications = (
  set: any,
  currentTopic: Node
): null | prereqSetNodeT => {
  const newchoices: Array<any> = [];
  let numArchivedChoices = 0;
  let numActiveChoices = 0;
  set.choices.forEach((choice: any) => {
    if (choice.id.toString() !== currentTopic.id) {
      newchoices.push(choice);
      if (choice.archivedSource) {
        numArchivedChoices += 1;
      } else {
        numActiveChoices += 1;
      }
    }
  });
  if (newchoices.length === 0 || numActiveChoices === 0) {
    return null;
  } else if (set.amount >= numActiveChoices) {
    return {
      id: set.id,
      amount: numActiveChoices,
      choices: newchoices,
      targetName: set.targetName
    };
  } else {
    return {
      id: set.id,
      amount: set.amount,
      choices: newchoices,
      targetName: set.targetName
    };
  }
};

export default function DeleteTopic(props: DeleteTopicProps) {
  const [deleteTopic, { isSuccess: isSuccessTopicDelete }] =
    useDeleteTopicMutation();
  const [
    editPrerequisite,
    { data: prereqEditData, isSuccess: isSuccessEditPrerq }
  ] = useEditPrerequisiteMutation();
  const [
    deletePrerequisite,
    { data: prereqDeleteData, isSuccess: isSuccessDeletePrereq }
  ] = useDeletePrerequisiteMutation();

  const [prereqSets, setPrereqSets] = useState<Array<any>>(
    props.selectedTopic.data.prereqSets
  );
  const [postreqSets, setPostreqSets] = useState<
    Array<{
      curr: prereqSetNodeT;
      new: prereqSetNodeT | null;
      targetId: string;
    }>
  >([]);
  const [checkedWarning, setCheckedWarning] = useState<boolean>(false);

  useEffect(() => {
    setPrereqSets(props.selectedTopic.data.prereqSets);
  }, [props.selectedTopic]);

  useEffect(() => {
    const postReqs = props.graphForDetectingCycles.getSuccessorsOf(
      props.selectedTopic.id
    );
    setPostreqSets([]);
    let currentpostReq: IteratorResult<any, any>;
    const newPostReqs: Array<{
      curr: prereqSetNodeT;
      new: prereqSetNodeT | null;
      targetId: string;
    }> = [];
    while (
      (currentpostReq = postReqs.next()) &&
      currentpostReq &&
      !currentpostReq.done
    ) {
      const targetId = currentpostReq.value;
      const nodeIndex = props.globalNodes.findIndex((n) => n.id === targetId);
      if (nodeIndex !== -1 && targetId) {
        props.globalNodes[nodeIndex].data.prereqSets.forEach((element: any) => {
          if (
            element.choices.some(
              (x: any) => x.id.toString() === props.selectedTopic.id
            ) &&
            !newPostReqs.some((x: any) => x.curr.id === element.id)
          ) {
            newPostReqs.push({
              curr: element,
              new: findModifications(element, props.selectedTopic),
              targetId
            });
          }
        });
      }
    }
    setPostreqSets([...newPostReqs]);
  }, [props.globalNodes, props.graphForDetectingCycles, props.selectedTopic]);

  return (
    <div>
      <div className="flex flex-col items-center">
        <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
          Currenlty viewing Topic: <b>{props.selectedTopic.data.label}</b>
        </h2>
      </div>
      <WarningAlert
        message="Delete topic"
        description={`This action will permanently delete this topic${
          prereqSets &&
          prereqSets.length > 0 &&
          ' as well its PRErequisite sets'
        }
        ${
          postreqSets && postreqSets.length > 0
            ? ', and modify all POSTrequisite sets. Modifications listed below.'
            : '.'
        }`}
        className="text-left mt-5"
        noSpace
      />
      {prereqSets && prereqSets.length > 0 && (
        <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
          <p className="text-gray-600">
            List of PRE-requisite Sets of{' '}
            <b>'{props.selectedTopic.data.label}'</b> that will be deleted:
          </p>
          {prereqSets.map((set: any, indx: number) => {
            return (
              <div
                key={set.id}
                className="rounded border-2 p-2"
                style={{ marginTop: '2px' }}
              >
                <p>
                  Complete at least <b>{set.amount}</b> of the following topics:
                </p>
                {set.choices.map((choice: any) => {
                  return (
                    <button
                      key={`${choice.id}_${indx}`}
                      type="button"
                      disabled={
                        !props.currPathTopicNames.includes(choice.sourceName)
                      }
                      title={
                        props.currPathTopicNames.includes(choice.sourceName)
                          ? `Navigate to ${choice.sourceName}`
                          : `${choice.sourceName} is not present in the current pathway`
                      }
                      onClick={() => {
                        props.setSelection(choice.id.toString(), null);
                      }}
                      className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                      style={{
                        backgroundColor: `${
                          getButtonColors(
                            choice.statusSource,
                            choice.archivedSource
                          ).backgroundColor
                        }`,
                        color: `${
                          getButtonColors(
                            choice.statusSource,
                            choice.archivedSource
                          ).textColor
                        }`
                      }}
                    >
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium">
                          {choice.sourceName}
                        </span>
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 8.71423C0 8.47852 0.094421 8.25246 0.262491 8.08578C0.430562 7.91911 0.658514 7.82547 0.896201 7.82547H13.9388L8.29808 2.23337C8.12979 2.06648 8.03525 1.84013 8.03525 1.60412C8.03525 1.36811 8.12979 1.14176 8.29808 0.974875C8.46636 0.807989 8.6946 0.714233 8.93259 0.714233C9.17057 0.714233 9.39882 0.807989 9.5671 0.974875L16.7367 8.08499C16.8202 8.16755 16.8864 8.26562 16.9316 8.3736C16.9767 8.48158 17 8.59733 17 8.71423C17 8.83114 16.9767 8.94689 16.9316 9.05487C16.8864 9.16284 16.8202 9.26092 16.7367 9.34348L9.5671 16.4536C9.39882 16.6205 9.17057 16.7142 8.93259 16.7142C8.6946 16.7142 8.46636 16.6205 8.29808 16.4536C8.12979 16.2867 8.03525 16.0604 8.03525 15.8243C8.03525 15.5883 8.12979 15.362 8.29808 15.1951L13.9388 9.603H0.896201C0.658514 9.603 0.430562 9.50936 0.262491 9.34268C0.094421 9.17601 0 8.94995 0 8.71423Z"
                            fill={`${
                              getButtonColors(
                                choice.statusSource,
                                choice.archivedSource
                              ).textColor
                            }`}
                          />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      {postreqSets && postreqSets.length > 0 && (
        <div className="hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
          <p className="text-gray-600">
            List of POST-requisite Sets that will be modified:
          </p>
          {postreqSets.map((set: any, indx: number) => {
            return (
              <div
                key={set.curr.id}
                className="rounded border-2 p-2"
                style={{ marginTop: '2px' }}
              >
                <p>
                  Complete at least <b>{set.curr.amount}</b> of the following
                  topics before beginning <b>'{set.curr.targetName}'</b>:
                </p>
                {set.curr.choices.map((choice: any) => {
                  return (
                    <button
                      key={`${choice.id}_${indx}`}
                      type="button"
                      disabled={
                        !props.currPathTopicNames.includes(choice.sourceName)
                      }
                      title={
                        props.currPathTopicNames.includes(choice.sourceName)
                          ? `Navigate to ${choice.sourceName}`
                          : `${choice.sourceName} is not present in the current pathway`
                      }
                      onClick={() => {
                        props.setSelection(choice.id.toString(), null);
                      }}
                      className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                      style={{
                        backgroundColor: `${
                          getButtonColors(
                            choice.statusSource,
                            choice.archivedSource
                          ).backgroundColor
                        }`,
                        color: `${
                          getButtonColors(
                            choice.statusSource,
                            choice.archivedSource
                          ).textColor
                        }`
                      }}
                    >
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium">
                          {choice.sourceName}
                        </span>
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 8.71423C0 8.47852 0.094421 8.25246 0.262491 8.08578C0.430562 7.91911 0.658514 7.82547 0.896201 7.82547H13.9388L8.29808 2.23337C8.12979 2.06648 8.03525 1.84013 8.03525 1.60412C8.03525 1.36811 8.12979 1.14176 8.29808 0.974875C8.46636 0.807989 8.6946 0.714233 8.93259 0.714233C9.17057 0.714233 9.39882 0.807989 9.5671 0.974875L16.7367 8.08499C16.8202 8.16755 16.8864 8.26562 16.9316 8.3736C16.9767 8.48158 17 8.59733 17 8.71423C17 8.83114 16.9767 8.94689 16.9316 9.05487C16.8864 9.16284 16.8202 9.26092 16.7367 9.34348L9.5671 16.4536C9.39882 16.6205 9.17057 16.7142 8.93259 16.7142C8.6946 16.7142 8.46636 16.6205 8.29808 16.4536C8.12979 16.2867 8.03525 16.0604 8.03525 15.8243C8.03525 15.5883 8.12979 15.362 8.29808 15.1951L13.9388 9.603H0.896201C0.658514 9.603 0.430562 9.50936 0.262491 9.34268C0.094421 9.17601 0 8.94995 0 8.71423Z"
                            fill={`${
                              getButtonColors(
                                choice.statusSource,
                                choice.archivedSource
                              ).textColor
                            }`}
                          />
                        </svg>
                      </div>
                    </button>
                  );
                })}
                <hr className="py-1" />
                <div>
                  <p className="text-center text-rose-900 italic">
                    This POST-requisite set will be
                    {set.new && <> modified as follows:</>}
                    {!set.new && <> deleted.</>}
                  </p>
                  {set.new && (
                    <>
                      <hr className="py-1" />
                      <p>
                        Complete at least <b>{set.new.amount}</b> of the
                        following topics before beginning{' '}
                        <b>'{set.new.targetName}'</b>:
                      </p>
                      {set.new.choices.map((choice: any) => {
                        return (
                          <button
                            key={`${choice.id}_${indx}`}
                            type="button"
                            disabled={
                              !props.currPathTopicNames.includes(
                                choice.sourceName
                              )
                            }
                            title={
                              props.currPathTopicNames.includes(
                                choice.sourceName
                              )
                                ? `Navigate to ${choice.sourceName}`
                                : `${choice.sourceName} is not present in the current pathway`
                            }
                            onClick={() => {
                              props.setSelection(choice.id.toString(), null);
                            }}
                            className="flex break-inside rounded-xl px-2 py-2 my-2 w-full"
                            style={{
                              backgroundColor: `${
                                getButtonColors(
                                  choice.statusSource,
                                  choice.archivedSource
                                ).backgroundColor
                              }`,
                              color: `${
                                getButtonColors(
                                  choice.statusSource,
                                  choice.archivedSource
                                ).textColor
                              }`
                            }}
                          >
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-sm font-medium">
                                {choice.sourceName}
                              </span>
                              <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M0 8.71423C0 8.47852 0.094421 8.25246 0.262491 8.08578C0.430562 7.91911 0.658514 7.82547 0.896201 7.82547H13.9388L8.29808 2.23337C8.12979 2.06648 8.03525 1.84013 8.03525 1.60412C8.03525 1.36811 8.12979 1.14176 8.29808 0.974875C8.46636 0.807989 8.6946 0.714233 8.93259 0.714233C9.17057 0.714233 9.39882 0.807989 9.5671 0.974875L16.7367 8.08499C16.8202 8.16755 16.8864 8.26562 16.9316 8.3736C16.9767 8.48158 17 8.59733 17 8.71423C17 8.83114 16.9767 8.94689 16.9316 9.05487C16.8864 9.16284 16.8202 9.26092 16.7367 9.34348L9.5671 16.4536C9.39882 16.6205 9.17057 16.7142 8.93259 16.7142C8.6946 16.7142 8.46636 16.6205 8.29808 16.4536C8.12979 16.2867 8.03525 16.0604 8.03525 15.8243C8.03525 15.5883 8.12979 15.362 8.29808 15.1951L13.9388 9.603H0.896201C0.658514 9.603 0.430562 9.50936 0.262491 9.34268C0.094421 9.17601 0 8.94995 0 8.71423Z"
                                  fill={`${
                                    getButtonColors(
                                      choice.statusSource,
                                      choice.archivedSource
                                    ).textColor
                                  }`}
                                />
                              </svg>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center">
        <input
          id="checkedWarning"
          type="checkbox"
          checked={checkedWarning}
          onChange={() => setCheckedWarning((c) => !c)}
          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="checkedWarning" className="ml-2 text-left mt-5 text-sm">
          I understand that deleting is a permanent action
        </label>
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center text-sm text-center font-medium break-inside ${
          checkedWarning ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300'
        } rounded-xl px-2 py-2 my-2 w-full text-white`}
        disabled={!checkedWarning}
        title={`${
          !checkedWarning
            ? 'Please check that you understand the above before continuing'
            : 'Delete this topic and its prerequisite sets'
        }`}
        onClick={async (e) => {
          e.preventDefault();
          //modify all POST-reqs
          for (const postreq of postreqSets) {
            if (postreq.new) {
              const newPostreqSet = postreq.new.choices.map((choice: any) =>
                Number(choice.id)
              );
              const r = await editPrerequisite({
                prerequisite_id: postreq.new.id,
                topic: Number(postreq.targetId),
                amount: postreq.new.amount,
                choices: newPostreqSet
              });
            } else {
              //delete postreq
              await deletePrerequisite({
                id: Number(postreq.curr.id)
              });
            }
          }
          deleteTopic({ id: Number(props.selectedTopic.id) });
        }}
      >
        Permanently delete this topic
        {prereqSets && prereqSets.length > 0 && ' and its PRErequisite sets'}
        {postreqSets && postreqSets.length > 0
          ? ', and modify all POSTrequisite sets.'
          : '.'}
      </button>
    </div>
  );
}
