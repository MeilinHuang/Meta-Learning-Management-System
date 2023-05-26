type Post = {
  id: number;
  author: {
    name: string;
    username: string;
    id: number;
  };
  time: Date;
  thread_id: number;
  content: string;
  upvotes: number;
  replies: number[];
  answered: boolean;
  endorsed: boolean;
  reported: boolean;
};

type Thread = {
  id: number;
  author: {
    name: string;
    username: string;
    id: number;
  };
  section_id: number;
  title: string;
  time: Date;
  content: string;
  upvotes: number;
  posts: number[];
  stickied: boolean;
  reported: boolean;
};

export type {Post, Thread}