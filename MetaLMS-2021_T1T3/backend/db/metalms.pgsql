--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5 (Ubuntu 13.5-2.pgdg20.04+1)
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-2.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: question; Type: TYPE; Schema: public; Owner: metalms
--

CREATE TYPE public.question AS ENUM (
    'mc',
    'sa',
    'cb'
);


ALTER TYPE public.question OWNER TO metalms;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: announcement_comment; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.announcement_comment (
    id integer NOT NULL,
    announcement_id integer NOT NULL,
    author integer NOT NULL,
    content text NOT NULL,
    post_date timestamp without time zone
);


ALTER TABLE public.announcement_comment OWNER TO metalms;

--
-- Name: announcement_comment_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.announcement_comment_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    comment_id integer NOT NULL
);


ALTER TABLE public.announcement_comment_files OWNER TO metalms;

--
-- Name: announcement_comment_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.announcement_comment_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.announcement_comment_files_id_seq OWNER TO metalms;

--
-- Name: announcement_comment_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.announcement_comment_files_id_seq OWNED BY public.announcement_comment_files.id;


--
-- Name: announcement_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.announcement_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.announcement_comment_id_seq OWNER TO metalms;

--
-- Name: announcement_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.announcement_comment_id_seq OWNED BY public.announcement_comment.id;


--
-- Name: announcement_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.announcement_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    announcement_id integer NOT NULL
);


ALTER TABLE public.announcement_files OWNER TO metalms;

--
-- Name: announcement_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.announcement_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.announcement_files_id_seq OWNER TO metalms;

--
-- Name: announcement_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.announcement_files_id_seq OWNED BY public.announcement_files.id;


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    author integer NOT NULL,
    topic_group integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    post_date timestamp without time zone
);


ALTER TABLE public.announcements OWNER TO metalms;

--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.announcements_id_seq OWNER TO metalms;

--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: attempt_answers; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.attempt_answers (
    attemptid integer NOT NULL,
    answerid integer NOT NULL
);


ALTER TABLE public.attempt_answers OWNER TO metalms;

--
-- Name: calendar_reminders; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.calendar_reminders (
    id integer NOT NULL,
    remind_date timestamp without time zone,
    description text
);


ALTER TABLE public.calendar_reminders OWNER TO metalms;

--
-- Name: calendar_reminders_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.calendar_reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.calendar_reminders_id_seq OWNER TO metalms;

--
-- Name: calendar_reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.calendar_reminders_id_seq OWNED BY public.calendar_reminders.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    user_id integer NOT NULL,
    author text NOT NULL,
    published_date timestamp without time zone,
    comment text,
    isendorsed boolean NOT NULL
);


ALTER TABLE public.comments OWNER TO metalms;

--
-- Name: comments_author; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.comments_author (
    comment_id integer NOT NULL,
    user_id integer NOT NULL,
    author text NOT NULL
);


ALTER TABLE public.comments_author OWNER TO metalms;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_comment_id_seq OWNER TO metalms;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- Name: enrol_lectures; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.enrol_lectures (
    id integer NOT NULL,
    lecture_code text NOT NULL,
    topic_group_id integer NOT NULL,
    lecturer_id integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    curr_capacity integer NOT NULL,
    max_capacity integer NOT NULL
);


ALTER TABLE public.enrol_lectures OWNER TO metalms;

--
-- Name: enrol_lectures_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.enrol_lectures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enrol_lectures_id_seq OWNER TO metalms;

--
-- Name: enrol_lectures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.enrol_lectures_id_seq OWNED BY public.enrol_lectures.id;


--
-- Name: enrol_tutorials; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.enrol_tutorials (
    id integer NOT NULL,
    tutorial_code text NOT NULL,
    topic_group_id integer NOT NULL,
    tutor_id integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    curr_capacity integer NOT NULL,
    max_capacity integer NOT NULL
);


ALTER TABLE public.enrol_tutorials OWNER TO metalms;

--
-- Name: enrol_tutorials_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.enrol_tutorials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enrol_tutorials_id_seq OWNER TO metalms;

--
-- Name: enrol_tutorials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.enrol_tutorials_id_seq OWNED BY public.enrol_tutorials.id;


--
-- Name: enroll_codes; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.enroll_codes (
    id integer NOT NULL,
    code text NOT NULL,
    topic_group_id integer NOT NULL,
    uses integer,
    expiration timestamp without time zone
);


ALTER TABLE public.enroll_codes OWNER TO metalms;

--
-- Name: enroll_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.enroll_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enroll_codes_id_seq OWNER TO metalms;

--
-- Name: enroll_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.enroll_codes_id_seq OWNED BY public.enroll_codes.id;


--
-- Name: enrolled_lectures; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.enrolled_lectures (
    lecture_id integer NOT NULL,
    student_id integer NOT NULL
);


ALTER TABLE public.enrolled_lectures OWNER TO metalms;

--
-- Name: enrolled_tutorials; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.enrolled_tutorials (
    tutorial_id integer NOT NULL,
    student_id integer NOT NULL
);


ALTER TABLE public.enrolled_tutorials OWNER TO metalms;

--
-- Name: forum_comment_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.forum_comment_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    comment_id integer NOT NULL
);


ALTER TABLE public.forum_comment_files OWNER TO metalms;

--
-- Name: forum_comment_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.forum_comment_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forum_comment_files_id_seq OWNER TO metalms;

--
-- Name: forum_comment_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.forum_comment_files_id_seq OWNED BY public.forum_comment_files.id;


--
-- Name: forum_post_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.forum_post_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public.forum_post_files OWNER TO metalms;

--
-- Name: forum_post_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.forum_post_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forum_post_files_id_seq OWNER TO metalms;

--
-- Name: forum_post_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.forum_post_files_id_seq OWNED BY public.forum_post_files.id;


--
-- Name: forum_posts; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.forum_posts (
    post_id integer NOT NULL,
    title text NOT NULL,
    user_id integer NOT NULL,
    author text NOT NULL,
    published_date timestamp without time zone,
    description text,
    ispinned boolean NOT NULL,
    related_link text,
    num_of_upvotes integer NOT NULL,
    isendorsed boolean NOT NULL,
    topic_group integer NOT NULL,
    fromannouncement boolean NOT NULL
);


ALTER TABLE public.forum_posts OWNER TO metalms;

--
-- Name: forum_posts_post_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.forum_posts_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forum_posts_post_id_seq OWNER TO metalms;

--
-- Name: forum_posts_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.forum_posts_post_id_seq OWNED BY public.forum_posts.post_id;


--
-- Name: forum_reply_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.forum_reply_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    reply_id integer NOT NULL
);


ALTER TABLE public.forum_reply_files OWNER TO metalms;

--
-- Name: forum_reply_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.forum_reply_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forum_reply_files_id_seq OWNER TO metalms;

--
-- Name: forum_reply_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.forum_reply_files_id_seq OWNED BY public.forum_reply_files.id;


--
-- Name: lecture_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.lecture_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    type text,
    lecture_id integer NOT NULL
);


ALTER TABLE public.lecture_files OWNER TO metalms;

--
-- Name: lecture_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.lecture_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lecture_files_id_seq OWNER TO metalms;

--
-- Name: lecture_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.lecture_files_id_seq OWNED BY public.lecture_files.id;


--
-- Name: lectures; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.lectures (
    id integer NOT NULL,
    topic_group_id integer NOT NULL,
    lecturer_id integer NOT NULL,
    week integer,
    start_time time without time zone,
    end_time time without time zone,
    topic_reference integer,
    lecture_video text
);


ALTER TABLE public.lectures OWNER TO metalms;

--
-- Name: lectures_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.lectures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lectures_id_seq OWNER TO metalms;

--
-- Name: lectures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.lectures_id_seq OWNED BY public.lectures.id;


--
-- Name: post_author; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.post_author (
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    author text NOT NULL
);


ALTER TABLE public.post_author OWNER TO metalms;

--
-- Name: post_comments; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.post_comments (
    post_id integer NOT NULL,
    comment_id integer NOT NULL
);


ALTER TABLE public.post_comments OWNER TO metalms;

--
-- Name: post_replies; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.post_replies (
    post_id integer NOT NULL,
    reply_id integer NOT NULL
);


ALTER TABLE public.post_replies OWNER TO metalms;

--
-- Name: post_tags; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.post_tags (
    post_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.post_tags OWNER TO metalms;

--
-- Name: prerequisites; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.prerequisites (
    prereq integer NOT NULL,
    topic integer NOT NULL
);


ALTER TABLE public.prerequisites OWNER TO metalms;

--
-- Name: question_bank; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.question_bank (
    id integer NOT NULL
);


ALTER TABLE public.question_bank OWNER TO metalms;

--
-- Name: question_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.question_bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_bank_id_seq OWNER TO metalms;

--
-- Name: question_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.question_bank_id_seq OWNED BY public.question_bank.id;


--
-- Name: question_possible_answers; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.question_possible_answers (
    id integer NOT NULL,
    questionid integer NOT NULL,
    answertext text NOT NULL,
    iscorrect boolean NOT NULL,
    explanation text NOT NULL
);


ALTER TABLE public.question_possible_answers OWNER TO metalms;

--
-- Name: question_possible_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.question_possible_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_possible_answers_id_seq OWNER TO metalms;

--
-- Name: question_possible_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.question_possible_answers_id_seq OWNED BY public.question_possible_answers.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    topicid integer NOT NULL,
    questionbankid integer NOT NULL,
    questiontext text NOT NULL,
    questiontype public.question NOT NULL,
    marksawarded integer NOT NULL
);


ALTER TABLE public.questions OWNER TO metalms;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_id_seq OWNER TO metalms;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.quiz_questions (
    quizid integer NOT NULL,
    questionid integer NOT NULL
);


ALTER TABLE public.quiz_questions OWNER TO metalms;

--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    name text NOT NULL,
    topicgroupid integer NOT NULL,
    opendate time without time zone,
    closedate time without time zone,
    timegiven integer NOT NULL,
    numquestions integer NOT NULL
);


ALTER TABLE public.quizzes OWNER TO metalms;

--
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quizzes_id_seq OWNER TO metalms;

--
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- Name: replies; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.replies (
    reply_id integer NOT NULL,
    user_id integer NOT NULL,
    author text NOT NULL,
    published_date timestamp without time zone,
    reply text
);


ALTER TABLE public.replies OWNER TO metalms;

--
-- Name: replies_author; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.replies_author (
    reply_id integer NOT NULL,
    user_id integer NOT NULL,
    author text NOT NULL
);


ALTER TABLE public.replies_author OWNER TO metalms;

--
-- Name: replies_reply_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.replies_reply_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.replies_reply_id_seq OWNER TO metalms;

--
-- Name: replies_reply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.replies_reply_id_seq OWNED BY public.replies.reply_id;


--
-- Name: reserved_tags; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.reserved_tags (
    tag_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.reserved_tags OWNER TO metalms;

--
-- Name: reserved_tags_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.reserved_tags_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reserved_tags_tag_id_seq OWNER TO metalms;

--
-- Name: reserved_tags_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.reserved_tags_tag_id_seq OWNED BY public.reserved_tags.tag_id;


--
-- Name: student_answers; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.student_answers (
    id integer NOT NULL,
    quizid integer NOT NULL,
    studentid integer NOT NULL,
    questionid integer NOT NULL,
    answer text
);


ALTER TABLE public.student_answers OWNER TO metalms;

--
-- Name: student_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.student_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_answers_id_seq OWNER TO metalms;

--
-- Name: student_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.student_answers_id_seq OWNED BY public.student_answers.id;


--
-- Name: student_attempts; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.student_attempts (
    id integer NOT NULL,
    quizid integer NOT NULL,
    studentid integer NOT NULL,
    starttime time without time zone,
    endtime time without time zone
);


ALTER TABLE public.student_attempts OWNER TO metalms;

--
-- Name: student_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.student_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_attempts_id_seq OWNER TO metalms;

--
-- Name: student_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.student_attempts_id_seq OWNED BY public.student_attempts.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.tags (
    tag_id integer NOT NULL,
    topic_group_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.tags OWNER TO metalms;

--
-- Name: tags_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.tags_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_tag_id_seq OWNER TO metalms;

--
-- Name: tags_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.tags_tag_id_seq OWNED BY public.tags.tag_id;


--
-- Name: topic_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.topic_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    type text NOT NULL,
    topic_id integer NOT NULL,
    due_date timestamp without time zone
);


ALTER TABLE public.topic_files OWNER TO metalms;

--
-- Name: topic_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.topic_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topic_files_id_seq OWNER TO metalms;

--
-- Name: topic_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.topic_files_id_seq OWNED BY public.topic_files.id;


--
-- Name: topic_group; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.topic_group (
    id integer NOT NULL,
    name text NOT NULL,
    topic_code text NOT NULL,
    course_outline text,
    searchable boolean NOT NULL
);


ALTER TABLE public.topic_group OWNER TO metalms;

--
-- Name: topic_group_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.topic_group_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    type text NOT NULL,
    topic_group_id integer NOT NULL
);


ALTER TABLE public.topic_group_files OWNER TO metalms;

--
-- Name: topic_group_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.topic_group_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topic_group_files_id_seq OWNER TO metalms;

--
-- Name: topic_group_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.topic_group_files_id_seq OWNED BY public.topic_group_files.id;


--
-- Name: topic_group_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.topic_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topic_group_id_seq OWNER TO metalms;

--
-- Name: topic_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.topic_group_id_seq OWNED BY public.topic_group.id;


--
-- Name: topic_tags; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.topic_tags (
    topic_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.topic_tags OWNER TO metalms;

--
-- Name: topics; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    topic_group_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.topics OWNER TO metalms;

--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_id_seq OWNER TO metalms;

--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: tutorial_files; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.tutorial_files (
    id integer NOT NULL,
    name text NOT NULL,
    file text NOT NULL,
    type text,
    tutorial_id integer NOT NULL
);


ALTER TABLE public.tutorial_files OWNER TO metalms;

--
-- Name: tutorial_files_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.tutorial_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tutorial_files_id_seq OWNER TO metalms;

--
-- Name: tutorial_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.tutorial_files_id_seq OWNED BY public.tutorial_files.id;


--
-- Name: tutorials; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.tutorials (
    id integer NOT NULL,
    topic_group_id integer NOT NULL,
    week integer,
    tutor_id integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    topic_reference integer,
    tutorial_video text
);


ALTER TABLE public.tutorials OWNER TO metalms;

--
-- Name: tutorials_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.tutorials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tutorials_id_seq OWNER TO metalms;

--
-- Name: tutorials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.tutorials_id_seq OWNED BY public.tutorials.id;


--
-- Name: upvotes; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.upvotes (
    post_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.upvotes OWNER TO metalms;

--
-- Name: user_admin; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.user_admin (
    admin_id integer NOT NULL,
    topic_group_id integer NOT NULL
);


ALTER TABLE public.user_admin OWNER TO metalms;

--
-- Name: user_calendar_reminders; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.user_calendar_reminders (
    reminder_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.user_calendar_reminders OWNER TO metalms;

--
-- Name: user_content_progress; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.user_content_progress (
    user_id integer NOT NULL,
    topic_file_id integer NOT NULL,
    topic_id integer NOT NULL,
    completed boolean NOT NULL
);


ALTER TABLE public.user_content_progress OWNER TO metalms;

--
-- Name: user_enrolled; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.user_enrolled (
    topic_group_id integer NOT NULL,
    user_id integer NOT NULL,
    progress numeric NOT NULL
);


ALTER TABLE public.user_enrolled OWNER TO metalms;

--
-- Name: users; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    zid text NOT NULL,
    staff boolean NOT NULL,
    last_accessed_topic integer,
    img_url text
);


ALTER TABLE public.users OWNER TO metalms;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO metalms;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: weeks; Type: TABLE; Schema: public; Owner: metalms
--

CREATE TABLE public.weeks (
    id integer NOT NULL,
    num integer NOT NULL
);


ALTER TABLE public.weeks OWNER TO metalms;

--
-- Name: weeks_id_seq; Type: SEQUENCE; Schema: public; Owner: metalms
--

CREATE SEQUENCE public.weeks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.weeks_id_seq OWNER TO metalms;

--
-- Name: weeks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: metalms
--

ALTER SEQUENCE public.weeks_id_seq OWNED BY public.weeks.id;


--
-- Name: announcement_comment id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_comment ALTER COLUMN id SET DEFAULT nextval('public.announcement_comment_id_seq'::regclass);


--
-- Name: announcement_comment_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_comment_files ALTER COLUMN id SET DEFAULT nextval('public.announcement_comment_files_id_seq'::regclass);


--
-- Name: announcement_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_files ALTER COLUMN id SET DEFAULT nextval('public.announcement_files_id_seq'::regclass);


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: calendar_reminders id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.calendar_reminders ALTER COLUMN id SET DEFAULT nextval('public.calendar_reminders_id_seq'::regclass);


--
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- Name: enrol_lectures id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_lectures ALTER COLUMN id SET DEFAULT nextval('public.enrol_lectures_id_seq'::regclass);


--
-- Name: enrol_tutorials id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_tutorials ALTER COLUMN id SET DEFAULT nextval('public.enrol_tutorials_id_seq'::regclass);


--
-- Name: enroll_codes id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enroll_codes ALTER COLUMN id SET DEFAULT nextval('public.enroll_codes_id_seq'::regclass);


--
-- Name: forum_comment_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_comment_files ALTER COLUMN id SET DEFAULT nextval('public.forum_comment_files_id_seq'::regclass);


--
-- Name: forum_post_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_post_files ALTER COLUMN id SET DEFAULT nextval('public.forum_post_files_id_seq'::regclass);


--
-- Name: forum_posts post_id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_posts ALTER COLUMN post_id SET DEFAULT nextval('public.forum_posts_post_id_seq'::regclass);


--
-- Name: forum_reply_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_reply_files ALTER COLUMN id SET DEFAULT nextval('public.forum_reply_files_id_seq'::regclass);


--
-- Name: lecture_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lecture_files ALTER COLUMN id SET DEFAULT nextval('public.lecture_files_id_seq'::regclass);


--
-- Name: lectures id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lectures ALTER COLUMN id SET DEFAULT nextval('public.lectures_id_seq'::regclass);


--
-- Name: question_bank id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.question_bank ALTER COLUMN id SET DEFAULT nextval('public.question_bank_id_seq'::regclass);


--
-- Name: question_possible_answers id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.question_possible_answers ALTER COLUMN id SET DEFAULT nextval('public.question_possible_answers_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- Name: replies reply_id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.replies ALTER COLUMN reply_id SET DEFAULT nextval('public.replies_reply_id_seq'::regclass);


--
-- Name: reserved_tags tag_id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.reserved_tags ALTER COLUMN tag_id SET DEFAULT nextval('public.reserved_tags_tag_id_seq'::regclass);


--
-- Name: student_answers id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_answers ALTER COLUMN id SET DEFAULT nextval('public.student_answers_id_seq'::regclass);


--
-- Name: student_attempts id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_attempts ALTER COLUMN id SET DEFAULT nextval('public.student_attempts_id_seq'::regclass);


--
-- Name: tags tag_id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tags ALTER COLUMN tag_id SET DEFAULT nextval('public.tags_tag_id_seq'::regclass);


--
-- Name: topic_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_files ALTER COLUMN id SET DEFAULT nextval('public.topic_files_id_seq'::regclass);


--
-- Name: topic_group id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_group ALTER COLUMN id SET DEFAULT nextval('public.topic_group_id_seq'::regclass);


--
-- Name: topic_group_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_group_files ALTER COLUMN id SET DEFAULT nextval('public.topic_group_files_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: tutorial_files id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorial_files ALTER COLUMN id SET DEFAULT nextval('public.tutorial_files_id_seq'::regclass);


--
-- Name: tutorials id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorials ALTER COLUMN id SET DEFAULT nextval('public.tutorials_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: weeks id; Type: DEFAULT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.weeks ALTER COLUMN id SET DEFAULT nextval('public.weeks_id_seq'::regclass);


--
-- Data for Name: announcement_comment; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.announcement_comment (id, announcement_id, author, content, post_date) FROM stdin;
\.


--
-- Data for Name: announcement_comment_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.announcement_comment_files (id, name, file, comment_id) FROM stdin;
\.


--
-- Data for Name: announcement_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.announcement_files (id, name, file, announcement_id) FROM stdin;
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.announcements (id, author, topic_group, title, content, post_date) FROM stdin;
6	12	1	Welcome to COMP6771	<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Hi there!</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">A big hello and a big welcome to COMP6771 in 20T2. My name is Hayden and I'll be overseeing the running of this course this term. It's an exciting course about C++ supported by a team of talented tutors and lecturers - but more on that later!</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Our course outline has been public for a while, but we're just in the final stages of making decisions on the arrangement of lecture topics, as well as the delivery methods of teaching during COVID-19. The course outline will be finalised late on this Sunday night. I'll be sending another email at the end of next week (the weekend before the course starts) with some final information and key points just as a reminder.</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>However!</strong></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Until then, we'd</span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>really</strong></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>love your feedback and vote</strong></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">on what is the best way to deliver this course online. There are a few options we're looking at (to finalise in the next day or two), and we want to make decisions driven by student's views. As far as we're concerned this is a higher level CSE course and I'm very comfortable treating everyone like adults - especially if we're about to spend the next few months together!</span><span style="font-family: Arial;"><br></span></p>\n<p style="text-align:left;"><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/activities/polls/1254" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;">Check out this poll before 6pm Sunday (if you care enough!)</span></a><span style="font-family: Arial;"><br></span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">We'll be setting up the forum in about a week. If you have urgent questions before then, please check the course outline. If you still have questions after that, email cs6771@cse.unsw.edu.au.</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Enjoy what's left of your holidays!!</span><span style="font-family: Arial;"> </span></p>\n	2021-10-30 02:20:04.16176
7	12	1	Starting the Term	<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Hi everyone!</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Welcome to the start of COMP6771.</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Our first lecture is Wednesday 1pm-3pm, and the link to it can be found in the</span><span style="font-family: Arial;"> </span><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/resources/47572" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;">Timetable</span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">page. Please don't bookmark these links to lecture vids, they are subject to change right up until the lecture, so always go through the link on timetable. We will cover quite a decent overview of the course during the first lecture, but in the meantime I think it's important to highlight some key changes or facts about the course!</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">(A quick apology too for some materials coming out tomorrow - a lot of this course hinges on some upgrades to CSE systems which won't occur until tomorrow).</span><span style="font-family: Arial;"><br></span></p>\n<h2 style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 30px;font-family: Arial;">Technology</span></h2>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">A section to the course outline was added highlighting the technologies we'll be using in this course. Many of you will be familiar with Webcms3 already, but three to get more comfortable with:</span></p>\n<ul>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>Piazza</strong></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">: A forum tool linked in the sidebar</span></li>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>Zoom</strong></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">: A video calling tool that works best if you download their native application</span></li>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>Gitlab</strong></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">: It's like github/bitbucket, but is a cse hosted git server that we will be using for everything in the course. If you don't have a basic knowledge in git, you should start</span><span style="font-family: Arial;"> </span><a href="https://www.atlassian.com/git" target="_blank"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;">learning now</span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">.</span></li>\n</ul>\n<h2 style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 30px;font-family: Arial;">Lectures</span></h2>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Our Thursday lecture time is an hour earlier than on your timetable. It's 3pm-5pm instead of 4pm-6pm. Always refer to the</span><span style="font-family: Arial;"> </span><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/resources/47572" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;"><strong>Timetable</strong></span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">page to confirm the times of your lectures.</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">We're using Zoom for lectures, tutorials, and help sessions in this course. Zoom has a 300 participant cap at UNSW current license, but the course has 380 students enrolled in it. While after the first lecture, I can't imagine 80% of you regularly turning up to lectures (no offence!), it's quite possible for the very first lecture that more than 300 of you try and attend - and in that case there may be a small handful of people who have to watch the first lecture recorded. I know it's not ideal, but we're just trying to keep the technology and platforms as simple as possible to start. If it turns out attendance remains that high then we'll change lecture platforms.</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">The release date for lecture slides is shown on the</span><span style="font-family: Arial;"> </span><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/resources/47712" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;"><strong>Lectures</strong></span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">page. This is also the page that links to the recordings will be linked up.</span><span style="font-family: Arial;"><br></span></p>\n<h2 style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 30px;font-family: Arial;">Tutorials</span></h2>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">To create more resources for online help sessions (consultations), we have merged a number of tutorials together into new larger tutorials. Each of these larger tutorials is given a name (fruit) and has a tutor. The</span><span style="font-family: Arial;"> </span><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/resources/47572" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;"><strong>Timetable</strong></span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">page shows in detail which tutorial you</span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><em>should</em></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">attend based on your original enrollment. You are welcome to attend others of course, but we just pre-assign them to help balance students across tutorials.</span><span style="font-family: Arial;"><br></span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">If you can no longer attend a tutorial because of this merge, or you can't attend a tutorial in general, the first tutorial of the week (Ryan Fallah's) will be recorded and a link to the recording posted on the</span><span style="font-family: Arial;"> </span><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/resources/47713" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;"><strong>Tutorials</strong></span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">page.</span><span style="font-family: Arial;"><br></span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">The release date for tutorials and their solutions can be seen on the gitlab pages for each tutorial (the links to these gitlab pages are also on the</span><span style="font-family: Arial;"> </span><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/resources/47713" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;"><strong>Tutorials</strong></span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">page).</span></p>\n<h2 style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 30px;font-family: Arial;">Assignments</span></h2>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">The release date for assignments can be found in the course outline, as well as in the gitlab pages for each assignment (linked in the</span><span style="font-family: Arial;"> </span><a href="https://webcms3.cse.unsw.edu.au/COMP6771/20T2/resources/44759" target="_self"><span style="color: rgb(59,134,63);background-color: transparent;font-size: 14px;font-family: Arial;"><strong>Assignments</strong></span><span style="font-family: Arial;"> </span></a><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">section).</span></p>\n<h2 style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 30px;font-family: Arial;">Final Comments</span></h2>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>If you have any questions, you can post in the Piazza forum (see the link in the left sidebar)!</strong></span><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 14px;font-family: Arial;">This is the first time that courses like COMP6771 have run for the entire term completely online, so it's a learning experience for all of us. Everything the team and I are doing here is focused on creating the best experience for you overall, so we'd love your ongoing feedback and thoughts as we get into the course. We're not afraid to change things up and adapt if we need to. You're all mature, intelligent people which is what gives me great confidence we'll have a great term.</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><strong>Chris and I will see you on Wednesday!</strong></span><span style="font-family: Arial;"> </span></p>\n	2021-10-30 03:06:33.670153
8	12	1	End of Week 1 Updates	<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Hey everyone,</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Just some updates to bring you all into sync at the end of this week!</span></p>\n<ul>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Tutorial 1 solutions have been released. Tutorial solutions will be pushed to YOUR repo for tut01.</span></li>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Tutorial 2 &amp; Lectures 2 were released* on Friday at 8pm.</span></li>\n<ul>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Tutorial 2 has some setup instructions for certain machines at home (we don't support everything!). See SETUP.md in that tutorial.</span></li>\n</ul>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Tutorial 3 &amp; Lectures 3 have been released*.</span></li>\n<ul>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Future tutorials and lectures will be released about 10 days in advance like Lecture/Tutorial 3, so check out for Lecture 4 / Tutorial 4</span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;"><em>next</em></span><span style="font-family: Arial;"> </span><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Sunday night at 10pm.</span></li>\n</ul>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Assignment 1 was released on Friday at 8pm. See the spec for due date.</span></li>\n<ul>\n<li><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">In the 48 hours after it was released we made a number of small fixes and clarifications from early student feedback, but any future fixes or clarifications will be recorded in the changelog at the top of the spec.</span></li>\n</ul>\n</ul>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">* Lecture slides are subject to minor changes up until the day of the lecture. PDFs released later.</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">If you have any questions about the above, please check out the forum to see if others have asked, otherwise ask there!</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Also, just wanted to say a big thanks to everyone for spending the time trying to get their environments set up this week. We could have just started of this course getting you to compile with g++ or clang++ on command line, and while that would have a very gentle learning curve.. we wouldn't be doing you the justice to skill you up in some more modern and industry-like practices. Don't forget that we have a lot of tutors on the forums nearly all day every day to help - so we'll all be getting through the next 9+ weeks together!</span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Chris will be taking week 2 lectures, and I'll be taking week 3 &amp; 4.</span><span style="font-family: Arial;"><br></span></p>\n<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 14px;font-family: Arial;">Have a great rest of your long weekend :)</span><span style="font-family: Arial;"> </span></p>\n	2021-10-30 03:06:58.064773
\.


--
-- Data for Name: attempt_answers; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.attempt_answers (attemptid, answerid) FROM stdin;
\.


--
-- Data for Name: calendar_reminders; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.calendar_reminders (id, remind_date, description) FROM stdin;
2	2021-10-26 11:04:28.182726	Assignment 2 due date
3	2021-10-26 11:04:28.201901	Assignment 3 due date
4	2021-11-17 13:00:00	test
5	2021-11-22 13:00:00	testing2
6	2021-11-25 13:00:00	wqeqwe
7	2021-10-30 13:00:00	test
8	2021-11-14 13:00:00	test
12	2021-12-07 13:00:00	assignment
15	2021-11-16 13:00:00	Assignment 1 due
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.comments (comment_id, user_id, author, published_date, comment, isendorsed) FROM stdin;
4	10	Rason Chia	2021-10-30 03:11:15.957919	<p>I believe the course outline says we will! :)</p>\n	t
9	100	Jane Doe	2021-11-02 01:54:53.342009	<p>comment</p>\n	f
10	100	Jane Doe	2021-11-08 08:25:40.524898	<p>Comment</p>\n	f
\.


--
-- Data for Name: comments_author; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.comments_author (comment_id, user_id, author) FROM stdin;
\.


--
-- Data for Name: enrol_lectures; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.enrol_lectures (id, lecture_code, topic_group_id, lecturer_id, start_time, end_time, curr_capacity, max_capacity) FROM stdin;
\.


--
-- Data for Name: enrol_tutorials; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.enrol_tutorials (id, tutorial_code, topic_group_id, tutor_id, start_time, end_time, curr_capacity, max_capacity) FROM stdin;
\.


--
-- Data for Name: enroll_codes; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.enroll_codes (id, code, topic_group_id, uses, expiration) FROM stdin;
28	pwaderVW	5	1	2021-10-31 20:30:03.81
29	wP75NkFh	11	\N	\N
30	lWezWtuo	11	\N	\N
31	dwvVfEtN	11	\N	\N
38	hsaqHqjo	3	\N	\N
\.


--
-- Data for Name: enrolled_lectures; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.enrolled_lectures (lecture_id, student_id) FROM stdin;
\.


--
-- Data for Name: enrolled_tutorials; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.enrolled_tutorials (tutorial_id, student_id) FROM stdin;
\.


--
-- Data for Name: forum_comment_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.forum_comment_files (id, name, file, comment_id) FROM stdin;
\.


--
-- Data for Name: forum_post_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.forum_post_files (id, name, file, post_id) FROM stdin;
\.


--
-- Data for Name: forum_posts; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.forum_posts (post_id, title, user_id, author, published_date, description, ispinned, related_link, num_of_upvotes, isendorsed, topic_group, fromannouncement) FROM stdin;
6	Will we be using C++ 20 in this course?	6	Daniel Ferraro	2021-10-30 14:10:03.278	<p>Hi, just wanted to know if we will be using C++ 20 in this course?</p>\n	f	\N	1	f	1	f
12	test	100	Jane Doe	2021-11-02 12:53:29.792	<p>tset</p>\n	f	\N	0	f	3	f
14	test	100	Jane Doe	2021-11-02 12:53:43.548	<p>test</p>\n	f	\N	0	f	3	f
13	test 	100	Jane Doe	2021-11-02 12:53:37.48	<p>test</p>\n	f	\N	1	f	3	f
15	b	100	Jane Doe	2021-11-02 12:55:13.355	<p>sdgsdg</p>\n	f	\N	0	f	3	f
16	c	100	Jane Doe	2021-11-02 12:55:20.254	<p>sdgsd</p>\n	f	\N	0	f	3	f
7	Assignment 1 info	10	Rason Chia	2021-10-30 14:11:02.318	<p>Hi, just wondering when information on assignment 1 will be released?</p>\n	f	\N	2	t	1	f
10	g++	99	John Smith	2021-11-01 09:32:05.069	<p>What is g++?</p>\n	f	\N	0	f	1	t
11	test post	100	Jane Doe	2021-11-02 12:53:00.647	<p>test</p>\n	t	\N	1	f	1	f
8	When is assignment 1 due?	11	Rebekah Chow	2021-10-31 12:29:07.772	<p>I am wondering when assignment 1 is due? The course outline says it is due on wk 4 but the assignment spec says wk 5</p>\n	f	\N	2	f	1	f
\.


--
-- Data for Name: forum_reply_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.forum_reply_files (id, name, file, reply_id) FROM stdin;
\.


--
-- Data for Name: lecture_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.lecture_files (id, name, file, type, lecture_id) FROM stdin;
\.


--
-- Data for Name: lectures; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.lectures (id, topic_group_id, lecturer_id, week, start_time, end_time, topic_reference, lecture_video) FROM stdin;
\.


--
-- Data for Name: post_author; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.post_author (post_id, user_id, author) FROM stdin;
\.


--
-- Data for Name: post_comments; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.post_comments (post_id, comment_id) FROM stdin;
6	4
13	9
8	10
\.


--
-- Data for Name: post_replies; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.post_replies (post_id, reply_id) FROM stdin;
7	4
13	8
8	10
\.


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.post_tags (post_id, tag_id) FROM stdin;
6	1
7	3
8	3
\.


--
-- Data for Name: prerequisites; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.prerequisites (prereq, topic) FROM stdin;
2	1
14	10
14	11
14	9
9	13
11	12
2	3
53	3
2	53
9	2
3	61
53	61
13	2
57	64
\.


--
-- Data for Name: question_bank; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.question_bank (id) FROM stdin;
1
\.


--
-- Data for Name: question_possible_answers; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.question_possible_answers (id, questionid, answertext, iscorrect, explanation) FROM stdin;
1	1	A loop iterates X times executing whatever is inside	t	It is the correct definition
2	1	A data structure	f	A loop is not a data structure
3	2	*	t	Pointer
4	2	+=	f	Incrementer false
5	3	var x = []	t	Javascript array
6	3	[]	f	No variable declaration
7	10	add, divide, multiply	f	
8	10	integer, character, float	t	
9	10	number, letters, special symbols	f	
10	10	boolean, true, false	f	
11	10	name of a movie	f	
12	10	a vegetable	f	
13	10	a container that stores data	t	
14	10	a container that stores data	t	
15	10	a vegetable	f	
16	10	name of a movie	f	
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.questions (id, topicid, questionbankid, questiontext, questiontype, marksawarded) FROM stdin;
1	1	1	What is a loop	mc	1
2	2	1	Which one is a pointer	mc	1
3	3	1	How do you declare an array	sa	1
8	1	1	What is a variable	mc	1
9	1	1	What is a variable	mc	1
10	1	1	What is a variable	mc	1
11	1	1	What is a variable	mc	1
12	1	1	What is a variable	mc	1
13	1	1	What is a variable	mc	0
14	1	1	What are valid data types?	mc	2
15	1	1	What are example/s of valid integers in C++?	cb	1
16	1	1	Which of the following is incorrect C++ syntax?	cb	0
17	1	1	dsdsd	mc	3
18	1	1	ewewe	mc	34
19	1	1	dfgdfgdfgdf	mc	0
20	1	1	dsd	mc	1
21	1	1	dsd	mc	0
22	1	1	dsdsd	mc	0
23	3	1	dsds	mc	0
24	1	1	sdfsdfsd	cb	0
25	1	1	What is a variable?	mc	1
26	1	1	Which are valid data type/s?	mc	1
27	2	1	Which are valid example/s of looping in C++?	cb	2
\.


--
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.quiz_questions (quizid, questionid) FROM stdin;
1	1
1	2
2	3
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.quizzes (id, name, topicgroupid, opendate, closedate, timegiven, numquestions) FROM stdin;
1	Quiz 1	1	19:10:25	11:04:29.419598	30	2
2	Quiz 2	1	19:10:25	11:04:29.436868	30	1
3	Quiz 1	2	19:10:25	11:04:29.453095	30	0
\.


--
-- Data for Name: replies; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.replies (reply_id, user_id, author, published_date, reply) FROM stdin;
4	12	Hayden Smith	2021-10-30 03:12:13.983126	<p>Hi Rason, the assignment 1 spec will be released at the end of week 2, giving you plenty of time before its due in week 5!</p>\n
8	100	Jane Doe	2021-11-02 01:53:53.787838	<p>response</p>\n
10	100	Jane Doe	2021-11-08 08:25:49.69357	<p>Offical response</p>\n
\.


--
-- Data for Name: replies_author; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.replies_author (reply_id, user_id, author) FROM stdin;
\.


--
-- Data for Name: reserved_tags; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.reserved_tags (tag_id, name) FROM stdin;
1	Announcement
2	Answered
3	Unanswered
4	Endorsed
\.


--
-- Data for Name: student_answers; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.student_answers (id, quizid, studentid, questionid, answer) FROM stdin;
\.


--
-- Data for Name: student_attempts; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.student_attempts (id, quizid, studentid, starttime, endtime) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.tags (tag_id, topic_group_id, name) FROM stdin;
1	1	Intro
2	1	New
3	1	Ass1
4	2	Ass1
5	2	FinalExam
6	1	Memory
7	1	Loops
8	1	Lists
9	1	Data Storage
11	1	For Loops
12	1	For Loops
15	1	Vectors
16	1	Topic1
17	1	Hello
18	3	While Loops
19	1	Structures
20	1	Lilian
\.


--
-- Data for Name: topic_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.topic_files (id, name, file, type, topic_id, due_date) FROM stdin;
3	pointers1.pdf	pointers1_path	content	2	\N
4	dynamic_arrays.pdf	dynamic_arrays_path	content	3	\N
5	ass1.pdf	dynamic_arrays_path	assessment	3	\N
23	Scan.jpeg	/_files/topicGroup3/topic11/Scan.jpeg	content	11	\N
24	Scan 1.jpeg	/_files/topicGroup1/topic2/Scan 1.jpeg	content	2	\N
25	tealights.jpg	/_files/topicGroup1/topic53/tealights.jpg	content	53	\N
26	tealights.jpg	/_files/topicGroup3/topic9/tealights.jpg	content	9	\N
27	horse.jpg	/_files/topicGroup1/topic1/horse.jpg	content	1	\N
28	tealights.jpg	/_files/topicGroup1/topic3/tealights.jpg	content	3	\N
29	hamburg.jpg	/_files/topicGroup3/topic9/hamburg.jpg	content	9	\N
30	tealights.jpg	/_files/topicGroup1/topic2/tealights.jpg	practice	2	\N
32	DSC_0078.JPG	/_files/topicGroup1/topic2/DSC_0078.JPG	practice	2	\N
35	Algorithms - Binary Search-P3YID7liBug.mp4	/_files/topicGroup1/topic2/Algorithms - Binary Search-P3YID7liBug.mp4	assessment	2	\N
\.


--
-- Data for Name: topic_group; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.topic_group (id, name, topic_code, course_outline, searchable) FROM stdin;
10	IoT Design Studio	COMP6733	The aim of the lectures is to facilitate learning and understanding of the important concepts within the course syllabus. Lecture notes will be available at the course web site for downloading before the lecture.	f
2	Database Systems	COMP3311	This course aims to explore in depth the practice of developing database applications and the theory behind relational database systems. It will also give a very brief overview of the technologies used in implementing database management systems and the past, present and future of database systems.	f
3	Programming Fundamentals	COMP1511	This course is an introductory course into the basics of Computer Programming and Computer Science. It is intended as an introduction to studying further in Computer Science or related fields.	t
4	Computer Systems Fundamentals	COMP1521	This course introduces students to how computer systems are structured in terms of basic electronic components, how they are used to implement procedural programs, and how they are structured as a collection of software layers.	f
5	Software Engineering Fundamentals	COMP1531\n	This course is teaches students about software engineering principles via exposure to the important practice of building correct products in effectively functioning teams.	f
6	Object-Oriented Design & Programming	COMP2511	COMP2511 covers the theory and practice of Object-Oriented Design and Programming with an emphasis on teaching students how to apply software design principles and design patterns to the building of flexible, reusable and maintainable systems.	f
1	C++ Programming	COMP6771	This course introduces the fundamentals and advanced techniques of object-oriented programming in C++.	f
7	Data Structures and Algorithms	COMP2521	The goal of this course is to deepen your understanding of data structures and algorithms and how these can be employed effectively in the design of software systems. 	t
11	Professional Issues and Ethics in IT	SENG4920	This course is taken by Computer Science, Computer Engineering and Bioinformatics students under the code COMP4920, and Software Engineering students under the code SENG4920.	t
12	Programming Challenges	COMP4128	This is a course designed to introduce advanced problem solving techniques to those who have already mastered the fundamentals of programming.	t
8	Computer Networks and Applications	COMP3331	This course is an introductory course on computer networks, aimed at students with a computer science / electrical engineering background. 	t
9	Computer Vision	COMP9517	Computer vision is the interdisciplinary scientific field that develops theories and methods allowing computers to extract high-level information from digital images or videos.	t
30	TESTTOPIC	TOPIC1231	\N	f
\.


--
-- Data for Name: topic_group_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.topic_group_files (id, name, file, type, topic_group_id) FROM stdin;
\.


--
-- Data for Name: topic_tags; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.topic_tags (topic_id, tag_id) FROM stdin;
3	6
9	9
11	12
3	16
57	17
11	18
57	19
2	20
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.topics (id, topic_group_id, name) FROM stdin;
5	2	SQL
6	2	Python
7	2	Schema
8	2	ER Diagrams
12	3	Linked Lists
13	3	Data Types
14	3	C Programming
15	4	Machine Code\n
16	4	Assembly
17	4	Memory
18	4	C Programming
19	5	Python
20	5	Flask
21	5	Web Design
22	5	Team Work
23	5	Agile Development
24	6	Classes
25	6	Inheritance
26	6	Constructors
27	7	Data Structures
28	7	Graphs
29	7	Doubly Linked Lists
30	7	Binary Search Trees (BSTs)
31	8	TCP
32	8	UDP
33	9	Python
34	9	Sklearn
35	9	Machine Learning
36	9	Decision Trees
37	9	Classifiers
38	10	C Programming
39	10	Bluetooth
40	10	IOT Devices
41	11	Kantian Ethics
42	11	Mills Ethics\n
43	11	Academic Writing
44	12	Data Structures
45	12	Dynamic Programming
46	12	Graphs
11	3	Loops
10	3	If Statements
53	1	If Statements
1	1	Variables
3	1	Iterators
9	3	Variables
57	1	Data Types
61	1	Jack
2	1	Loops
64	1	Inheritance
65	30	TEST
\.


--
-- Data for Name: tutorial_files; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.tutorial_files (id, name, file, type, tutorial_id) FROM stdin;
\.


--
-- Data for Name: tutorials; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.tutorials (id, topic_group_id, week, tutor_id, start_time, end_time, topic_reference, tutorial_video) FROM stdin;
\.


--
-- Data for Name: upvotes; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.upvotes (post_id, user_id) FROM stdin;
6	10
8	99
7	99
13	100
7	100
8	100
11	100
\.


--
-- Data for Name: user_admin; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.user_admin (admin_id, topic_group_id) FROM stdin;
\.


--
-- Data for Name: user_calendar_reminders; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.user_calendar_reminders (reminder_id, user_id) FROM stdin;
12	99
15	5
\.


--
-- Data for Name: user_content_progress; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.user_content_progress (user_id, topic_file_id, topic_id, completed) FROM stdin;
99	4	3	t
99	5	3	t
100	3	2	t
99	3	2	t
5	3	2	f
\.


--
-- Data for Name: user_enrolled; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.user_enrolled (topic_group_id, user_id, progress) FROM stdin;
9	99	0
5	99	0
3	100	100
1	100	100
11	6	0
1	5	0
3	5	0
2	5	0
1	99	0
1	6	0
1	104	0
9	104	0
1	12	100
2	13	100
3	14	100
4	15	100
5	12	100
6	16	100
7	16	100
8	17	100
9	1	100
10	2	100
11	3	100
12	4	100
2	6	53
3	6	84
4	6	58
5	7	15
6	7	27
7	7	69
8	7	24
9	8	36
10	8	47
11	8	25
12	8	29
1	9	27
2	9	35
3	9	39
4	9	59
5	10	57
6	10	29
7	10	92
8	10	79
9	11	64
10	11	74
11	11	25
12	11	54
12	6	54
10	6	54
9	6	57
4	7	28
2	7	75
1	7	72
12	7	24
4	8	42
3	8	48
2	8	24
12	9	84
11	9	24
10	9	48
9	9	48
1	10	87
2	10	57
3	10	74
4	10	42
4	11	24
3	11	42
2	11	42
1	11	38
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.users (id, name, email, password, zid, staff, last_accessed_topic, img_url) FROM stdin;
6	Daniel Ferraro	daniel.ferraro@test.com	password	z5204902	f	\N	https://i.imgur.com/9MCHUsn.jpg
5	Allen Wu	allen.wu@test.com	password	z5205003	f	1	\N
12	Hayden Smith	hayden.smith@test.com	password	z7651562	t	\N	\N
102	Test User	test@test.com	password	z9654294	f	\N	\N
103	Test User	test2@test.com	password	z8503237	f	\N	\N
104	John Smith	john.smith@student.unsw.edu.au	password	z5903976	f	\N	https://imgur.com/PhZgSaQ.jpg
1	Erik Meijering	erik.meijering@test.com	password	z5212345	t	\N	\N
2	Wen Hu	wen.hu@test.com	password	z2957308	t	\N	\N
3	Wayne Wobcke	wayne.wobcke@test.com	password	z9574037	t	\N	\N
4	Raveen De Silva	raveen.desilva@test.com	password	z5204629	t	\N	\N
7	David Nguyen	david.nguyen@test.com	password	z5166106	f	\N	\N
8	Edward Webb	edward.webb@test.com	password	z5207215	f	\N	\N
9	Emily Ngo	emily.ngo@test.com	password	z5164090	f	\N	\N
10	Rason Chia	rason.chia@test.com	password	z5084566	f	\N	\N
11	Rebekah Chow	rebekah.chow@test.com	password	z5160152	f	\N	\N
13	John Shepard	john.shepard@test.com	password	z5147835	t	\N	\N
14	Sasha Vassar	sasha.vassar@test.com	password	z5214590	t	\N	\N
15	Andrew Taylor	andrew.taylor@test.com\n	password	z7521951	t	\N	\N
16	Ashesh Mahidadia	ashesh.mahidadia@test.com	password	z7456215	t	\N	\N
17	Salil Kanhere	salil.kanhere@test.com	password	z9642357	t	\N	\N
101	Emily N	emilyn@test.com	emilyn	z5164091	f	\N	\N
105	William Shen	williamyinanshen2009@gmail.com	SecurePassword1234	z5208451	f	\N	https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/83/834ac62c891ec0c25a1de2e388b41f2df6be5ca5_full.jpg
99	John Smith	john.smith@unsw.com.au	password	z5304820	f	19	https://imgur.com/PhZgSaQ.jpg
100	Jane Doe	jane.doe@unsw.com.au	password	z3549520	t	57	https://imgur.com/lCAYWUS.jpg
\.


--
-- Data for Name: weeks; Type: TABLE DATA; Schema: public; Owner: metalms
--

COPY public.weeks (id, num) FROM stdin;
1	1
2	2
3	3
\.


--
-- Name: announcement_comment_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.announcement_comment_files_id_seq', 1, false);


--
-- Name: announcement_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.announcement_comment_id_seq', 2, true);


--
-- Name: announcement_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.announcement_files_id_seq', 6, true);


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.announcements_id_seq', 20, true);


--
-- Name: calendar_reminders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.calendar_reminders_id_seq', 29, true);


--
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.comments_comment_id_seq', 10, true);


--
-- Name: enrol_lectures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.enrol_lectures_id_seq', 1, false);


--
-- Name: enrol_tutorials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.enrol_tutorials_id_seq', 1, false);


--
-- Name: enroll_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.enroll_codes_id_seq', 38, true);


--
-- Name: forum_comment_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.forum_comment_files_id_seq', 1, false);


--
-- Name: forum_post_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.forum_post_files_id_seq', 2, true);


--
-- Name: forum_posts_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.forum_posts_post_id_seq', 17, true);


--
-- Name: forum_reply_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.forum_reply_files_id_seq', 1, false);


--
-- Name: lecture_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.lecture_files_id_seq', 3, true);


--
-- Name: lectures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.lectures_id_seq', 3, true);


--
-- Name: question_bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.question_bank_id_seq', 1, true);


--
-- Name: question_possible_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.question_possible_answers_id_seq', 16, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.questions_id_seq', 28, true);


--
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 3, true);


--
-- Name: replies_reply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.replies_reply_id_seq', 10, true);


--
-- Name: reserved_tags_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.reserved_tags_tag_id_seq', 4, true);


--
-- Name: student_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.student_answers_id_seq', 2, true);


--
-- Name: student_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.student_attempts_id_seq', 3, true);


--
-- Name: tags_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.tags_tag_id_seq', 20, true);


--
-- Name: topic_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.topic_files_id_seq', 35, true);


--
-- Name: topic_group_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.topic_group_files_id_seq', 1, false);


--
-- Name: topic_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.topic_group_id_seq', 30, true);


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.topics_id_seq', 65, true);


--
-- Name: tutorial_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.tutorial_files_id_seq', 1, true);


--
-- Name: tutorials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.tutorials_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.users_id_seq', 105, true);


--
-- Name: weeks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: metalms
--

SELECT pg_catalog.setval('public.weeks_id_seq', 3, true);


--
-- Name: announcement_comment_files announcement_comment_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_comment_files
    ADD CONSTRAINT announcement_comment_files_pkey PRIMARY KEY (id);


--
-- Name: announcement_comment announcement_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_comment
    ADD CONSTRAINT announcement_comment_pkey PRIMARY KEY (id);


--
-- Name: announcement_files announcement_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_files
    ADD CONSTRAINT announcement_files_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: attempt_answers attempt_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.attempt_answers
    ADD CONSTRAINT attempt_answers_pkey PRIMARY KEY (attemptid, answerid);


--
-- Name: calendar_reminders calendar_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.calendar_reminders
    ADD CONSTRAINT calendar_reminders_pkey PRIMARY KEY (id);


--
-- Name: comments_author comments_author_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.comments_author
    ADD CONSTRAINT comments_author_pkey PRIMARY KEY (comment_id, user_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: enrol_lectures enrol_lectures_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_lectures
    ADD CONSTRAINT enrol_lectures_pkey PRIMARY KEY (id);


--
-- Name: enrol_tutorials enrol_tutorials_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_tutorials
    ADD CONSTRAINT enrol_tutorials_pkey PRIMARY KEY (id);


--
-- Name: enroll_codes enroll_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enroll_codes
    ADD CONSTRAINT enroll_codes_pkey PRIMARY KEY (id);


--
-- Name: enrolled_lectures enrolled_lectures_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrolled_lectures
    ADD CONSTRAINT enrolled_lectures_pkey PRIMARY KEY (lecture_id, student_id);


--
-- Name: enrolled_tutorials enrolled_tutorials_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrolled_tutorials
    ADD CONSTRAINT enrolled_tutorials_pkey PRIMARY KEY (tutorial_id, student_id);


--
-- Name: forum_comment_files forum_comment_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_comment_files
    ADD CONSTRAINT forum_comment_files_pkey PRIMARY KEY (id);


--
-- Name: forum_post_files forum_post_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_post_files
    ADD CONSTRAINT forum_post_files_pkey PRIMARY KEY (id);


--
-- Name: forum_posts forum_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT forum_posts_pkey PRIMARY KEY (post_id);


--
-- Name: forum_reply_files forum_reply_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_reply_files
    ADD CONSTRAINT forum_reply_files_pkey PRIMARY KEY (id);


--
-- Name: lecture_files lecture_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lecture_files
    ADD CONSTRAINT lecture_files_pkey PRIMARY KEY (id);


--
-- Name: lectures lectures_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lectures
    ADD CONSTRAINT lectures_pkey PRIMARY KEY (id);


--
-- Name: post_author post_author_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_author
    ADD CONSTRAINT post_author_pkey PRIMARY KEY (post_id, user_id);


--
-- Name: post_comments post_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_pkey PRIMARY KEY (post_id, comment_id);


--
-- Name: post_replies post_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_replies
    ADD CONSTRAINT post_replies_pkey PRIMARY KEY (post_id, reply_id);


--
-- Name: post_tags post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id);


--
-- Name: prerequisites prerequisites_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_pkey PRIMARY KEY (prereq, topic);


--
-- Name: question_bank question_bank_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.question_bank
    ADD CONSTRAINT question_bank_pkey PRIMARY KEY (id);


--
-- Name: question_possible_answers question_possible_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.question_possible_answers
    ADD CONSTRAINT question_possible_answers_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (quizid, questionid);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: replies_author replies_author_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.replies_author
    ADD CONSTRAINT replies_author_pkey PRIMARY KEY (reply_id, user_id);


--
-- Name: replies replies_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.replies
    ADD CONSTRAINT replies_pkey PRIMARY KEY (reply_id);


--
-- Name: reserved_tags reserved_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.reserved_tags
    ADD CONSTRAINT reserved_tags_pkey PRIMARY KEY (tag_id);


--
-- Name: student_answers student_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT student_answers_pkey PRIMARY KEY (id);


--
-- Name: student_attempts student_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_attempts
    ADD CONSTRAINT student_attempts_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag_id);


--
-- Name: topic_files topic_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_files
    ADD CONSTRAINT topic_files_pkey PRIMARY KEY (id);


--
-- Name: topic_group_files topic_group_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_group_files
    ADD CONSTRAINT topic_group_files_pkey PRIMARY KEY (id);


--
-- Name: topic_group topic_group_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_group
    ADD CONSTRAINT topic_group_pkey PRIMARY KEY (id);


--
-- Name: topic_group topic_group_topic_code_key; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_group
    ADD CONSTRAINT topic_group_topic_code_key UNIQUE (topic_code);


--
-- Name: topic_tags topic_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_tags
    ADD CONSTRAINT topic_tags_pkey PRIMARY KEY (topic_id, tag_id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: tutorial_files tutorial_files_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorial_files
    ADD CONSTRAINT tutorial_files_pkey PRIMARY KEY (id);


--
-- Name: tutorials tutorials_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_pkey PRIMARY KEY (id);


--
-- Name: upvotes upvotes_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.upvotes
    ADD CONSTRAINT upvotes_pkey PRIMARY KEY (post_id, user_id);


--
-- Name: user_admin user_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_admin
    ADD CONSTRAINT user_admin_pkey PRIMARY KEY (admin_id, topic_group_id);


--
-- Name: user_calendar_reminders user_calendar_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_calendar_reminders
    ADD CONSTRAINT user_calendar_reminders_pkey PRIMARY KEY (reminder_id, user_id);


--
-- Name: user_content_progress user_content_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_content_progress
    ADD CONSTRAINT user_content_progress_pkey PRIMARY KEY (user_id, topic_file_id, topic_id);


--
-- Name: user_enrolled user_enrolled_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_enrolled
    ADD CONSTRAINT user_enrolled_pkey PRIMARY KEY (user_id, topic_group_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weeks weeks_pkey; Type: CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.weeks
    ADD CONSTRAINT weeks_pkey PRIMARY KEY (id);


--
-- Name: prereq_idx; Type: INDEX; Schema: public; Owner: metalms
--

CREATE INDEX prereq_idx ON public.prerequisites USING btree (prereq);


--
-- Name: topic_idx; Type: INDEX; Schema: public; Owner: metalms
--

CREATE INDEX topic_idx ON public.prerequisites USING btree (topic);


--
-- Name: announcement_comment announcement_comment_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_comment
    ADD CONSTRAINT announcement_comment_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcement_comment announcement_comment_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_comment
    ADD CONSTRAINT announcement_comment_author_fkey FOREIGN KEY (author) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcement_comment_files announcement_comment_files_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_comment_files
    ADD CONSTRAINT announcement_comment_files_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.announcement_comment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcement_files announcement_files_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcement_files
    ADD CONSTRAINT announcement_files_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_author_fkey FOREIGN KEY (author) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_topic_group_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_topic_group_fkey FOREIGN KEY (topic_group) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attempt_answers attempt_answers_answerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.attempt_answers
    ADD CONSTRAINT attempt_answers_answerid_fkey FOREIGN KEY (answerid) REFERENCES public.student_answers(id);


--
-- Name: attempt_answers attempt_answers_attemptid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.attempt_answers
    ADD CONSTRAINT attempt_answers_attemptid_fkey FOREIGN KEY (attemptid) REFERENCES public.student_attempts(id);


--
-- Name: comments_author comments_author_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.comments_author
    ADD CONSTRAINT comments_author_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments_author comments_author_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.comments_author
    ADD CONSTRAINT comments_author_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrol_lectures enrol_lectures_lecturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_lectures
    ADD CONSTRAINT enrol_lectures_lecturer_id_fkey FOREIGN KEY (lecturer_id) REFERENCES public.users(id);


--
-- Name: enrol_lectures enrol_lectures_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_lectures
    ADD CONSTRAINT enrol_lectures_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrol_tutorials enrol_tutorials_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_tutorials
    ADD CONSTRAINT enrol_tutorials_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrol_tutorials enrol_tutorials_tutor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrol_tutorials
    ADD CONSTRAINT enrol_tutorials_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.users(id);


--
-- Name: enroll_codes enroll_codes_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enroll_codes
    ADD CONSTRAINT enroll_codes_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id);


--
-- Name: enrolled_lectures enrolled_lectures_lecture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrolled_lectures
    ADD CONSTRAINT enrolled_lectures_lecture_id_fkey FOREIGN KEY (lecture_id) REFERENCES public.lectures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrolled_lectures enrolled_lectures_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrolled_lectures
    ADD CONSTRAINT enrolled_lectures_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrolled_tutorials enrolled_tutorials_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrolled_tutorials
    ADD CONSTRAINT enrolled_tutorials_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrolled_tutorials enrolled_tutorials_tutorial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.enrolled_tutorials
    ADD CONSTRAINT enrolled_tutorials_tutorial_id_fkey FOREIGN KEY (tutorial_id) REFERENCES public.tutorials(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: forum_comment_files forum_comment_files_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_comment_files
    ADD CONSTRAINT forum_comment_files_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: forum_post_files forum_post_files_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_post_files
    ADD CONSTRAINT forum_post_files_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: forum_posts forum_posts_topic_group_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT forum_posts_topic_group_fkey FOREIGN KEY (topic_group) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: forum_posts forum_posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT forum_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: forum_reply_files forum_reply_files_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.forum_reply_files
    ADD CONSTRAINT forum_reply_files_reply_id_fkey FOREIGN KEY (reply_id) REFERENCES public.replies(reply_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lecture_files lecture_files_lecture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lecture_files
    ADD CONSTRAINT lecture_files_lecture_id_fkey FOREIGN KEY (lecture_id) REFERENCES public.lectures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lectures lectures_lecturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lectures
    ADD CONSTRAINT lectures_lecturer_id_fkey FOREIGN KEY (lecturer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lectures lectures_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lectures
    ADD CONSTRAINT lectures_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lectures lectures_topic_reference_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.lectures
    ADD CONSTRAINT lectures_topic_reference_fkey FOREIGN KEY (topic_reference) REFERENCES public.topics(id);


--
-- Name: post_author post_author_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_author
    ADD CONSTRAINT post_author_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_author post_author_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_author
    ADD CONSTRAINT post_author_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_comments post_comments_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_comments post_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_replies post_replies_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_replies
    ADD CONSTRAINT post_replies_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_replies post_replies_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_replies
    ADD CONSTRAINT post_replies_reply_id_fkey FOREIGN KEY (reply_id) REFERENCES public.replies(reply_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_tags post_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_tags post_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prerequisites prerequisites_prereq_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_prereq_fkey FOREIGN KEY (prereq) REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prerequisites prerequisites_topic_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_topic_fkey FOREIGN KEY (topic) REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: question_possible_answers question_possible_answers_questionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.question_possible_answers
    ADD CONSTRAINT question_possible_answers_questionid_fkey FOREIGN KEY (questionid) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions questions_questionbankid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_questionbankid_fkey FOREIGN KEY (questionbankid) REFERENCES public.question_bank(id);


--
-- Name: questions questions_topicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_topicid_fkey FOREIGN KEY (topicid) REFERENCES public.topics(id) ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_questionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_questionid_fkey FOREIGN KEY (questionid) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_quizid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_quizid_fkey FOREIGN KEY (quizid) REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quizzes quizzes_topicgroupid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_topicgroupid_fkey FOREIGN KEY (topicgroupid) REFERENCES public.topic_group(id);


--
-- Name: replies_author replies_author_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.replies_author
    ADD CONSTRAINT replies_author_reply_id_fkey FOREIGN KEY (reply_id) REFERENCES public.replies(reply_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: replies_author replies_author_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.replies_author
    ADD CONSTRAINT replies_author_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: replies replies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.replies
    ADD CONSTRAINT replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_answers student_answers_questionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT student_answers_questionid_fkey FOREIGN KEY (questionid) REFERENCES public.questions(id);


--
-- Name: student_answers student_answers_quizid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT student_answers_quizid_fkey FOREIGN KEY (quizid) REFERENCES public.quizzes(id);


--
-- Name: student_answers student_answers_studentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_answers
    ADD CONSTRAINT student_answers_studentid_fkey FOREIGN KEY (studentid) REFERENCES public.users(id);


--
-- Name: student_attempts student_attempts_quizid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_attempts
    ADD CONSTRAINT student_attempts_quizid_fkey FOREIGN KEY (quizid) REFERENCES public.quizzes(id);


--
-- Name: student_attempts student_attempts_studentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.student_attempts
    ADD CONSTRAINT student_attempts_studentid_fkey FOREIGN KEY (studentid) REFERENCES public.users(id);


--
-- Name: tags tags_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id);


--
-- Name: topic_files topic_files_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_files
    ADD CONSTRAINT topic_files_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: topic_group_files topic_group_files_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_group_files
    ADD CONSTRAINT topic_group_files_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: topic_tags topic_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_tags
    ADD CONSTRAINT topic_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: topic_tags topic_tags_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topic_tags
    ADD CONSTRAINT topic_tags_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: topics topics_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tutorial_files tutorial_files_tutorial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorial_files
    ADD CONSTRAINT tutorial_files_tutorial_id_fkey FOREIGN KEY (tutorial_id) REFERENCES public.tutorials(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tutorials tutorials_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tutorials tutorials_topic_reference_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_topic_reference_fkey FOREIGN KEY (topic_reference) REFERENCES public.topics(id);


--
-- Name: tutorials tutorials_tutor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.users(id);


--
-- Name: upvotes upvotes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.upvotes
    ADD CONSTRAINT upvotes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: upvotes upvotes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.upvotes
    ADD CONSTRAINT upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_admin user_admin_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_admin
    ADD CONSTRAINT user_admin_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_admin user_admin_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_admin
    ADD CONSTRAINT user_admin_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON DELETE CASCADE;


--
-- Name: user_calendar_reminders user_calendar_reminders_reminder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_calendar_reminders
    ADD CONSTRAINT user_calendar_reminders_reminder_id_fkey FOREIGN KEY (reminder_id) REFERENCES public.calendar_reminders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_calendar_reminders user_calendar_reminders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_calendar_reminders
    ADD CONSTRAINT user_calendar_reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_content_progress user_content_progress_topic_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_content_progress
    ADD CONSTRAINT user_content_progress_topic_file_id_fkey FOREIGN KEY (topic_file_id) REFERENCES public.topic_files(id);


--
-- Name: user_content_progress user_content_progress_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_content_progress
    ADD CONSTRAINT user_content_progress_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);


--
-- Name: user_content_progress user_content_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_content_progress
    ADD CONSTRAINT user_content_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_enrolled user_enrolled_topic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_enrolled
    ADD CONSTRAINT user_enrolled_topic_group_id_fkey FOREIGN KEY (topic_group_id) REFERENCES public.topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_enrolled user_enrolled_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.user_enrolled
    ADD CONSTRAINT user_enrolled_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_last_accessed_topic_fkey; Type: FK CONSTRAINT; Schema: public; Owner: metalms
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_last_accessed_topic_fkey FOREIGN KEY (last_accessed_topic) REFERENCES public.topics(id);


--
-- PostgreSQL database dump complete
--

