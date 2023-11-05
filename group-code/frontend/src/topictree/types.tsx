export type pathway = {
  id: number;
  name: string;
  core: pathwayTopicInfo[];
  electives: pathwayTopicInfo[];
};

export type pathwayTopicInfo = {
  id: number;
  name: string;
  status?: string;
  topic_group: pathwayGroupInfo;
  needs: pathwayTopicPrerequisite[];
  archived: boolean;
};

export type pathwayGroupInfo = {
  id: number;
  name: string;
};

export type pathwayTopicPrerequisite = {
  id: number;
  amount: number;
  choices: pathwayTopicInfo[];
};

export type option = {
  label: string;
  value: string;
  group: string;
};

export type SearchTopics = {
  label: 'Topic' | 'Pre-req relationship';
  options: option[];
}[];

export type EnrolledTopic = {
  id: number;
  image_url: string | null;
  topic_group_id: number | null;
  archived: boolean;
  description: string;
  topic_name: string;
  complete: boolean;
  prereq_sets: {
    amount: number;
    choices: {
      id: number;
      name: string;
    }[];
  }[];
};

export type currPathT = {
  id: number;
  name: string;
  user: boolean;
};

export type PrereqSetT = {
  amount: number;
  choices: Array<{
    id: number;
    name: string;
    archived: boolean;
    status: null | 'available' | 'unavailable' | 'complete' | 'in-progress';
  }>;
};

export type CoreAndElecTopicsT = Array<{ value: string; label: HTMLElement }>;

export type prereqSetNodeT = {
  id: number;
  amount: number;
  choices: Array<any>;
  targetName: string;
};
