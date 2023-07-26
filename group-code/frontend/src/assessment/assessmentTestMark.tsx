import { Fragment, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  To
} from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';
import AssessmentService from './AssessmentService';
import { json } from 'stream/consumers';
import MessageModal from './messageModal';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function AssessmentTestMark() {
  const param = useParams();
  const navigate = useNavigate();
  const routeChange = (path: To) => {
    //let path = `newPath`;
    navigate(path);
  };
  const [mesg, setMesg] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isActive, setIsActive] = useState('-1');
  const [mark, setMark] = useState('0');
  const [feedback, setFeedback] = useState('');
  const [problem, setProblem] = useState([
    {
      questionID: '1',
      problemDescription:
        'What is a correct syntax to output "Hello World" in C++?',
      type: 'singleChoice',
      choice: [
        'A. cout << "Hello World";',
        'B. Console.WriteLine("Hello World");',
        'C. print ("Hello World");',
        'D. System.out.println("Hello World");'
      ],
      answerAttempt: ['A. cout << "Hello World";'],
      answer: ['A. cout << "Hello World";']
    },
    // {
    //     questionID: '2',
    //     problemDescription: 'which of the functions below can be used Allocate space for array in memory',
    //     type: 'multipleChoice',
    //     choice: ['A. calloc()', 'B. malloc()', 'C. realloc()', 'D. free()'],
    //     answerAttempt: ['A. calloc()', 'B. malloc()'],
    //     answer: ['A. calloc()', 'B. malloc()']
    // },
    {
      questionID: '3',
      problemDescription: 'What is the best programming language',
      type: 'Essay',
      answerAttempt: [] as any,
      answer: [''] as any
    }
  ]);

  const [probShow, setProbShow] = useState(problem[0]);
  //flag to see if back service loaded
  const [loaded, setLoaded] = useState(true);

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = 'Changes you made may not be saved.';
  };

  const handleChangeMark = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMark(event.target.value);
  };

  const handleChangeFeedback = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFeedback(event.target.value);
  };

  useEffect(() => {
    console.log(param);
    const para = { assessment_attempt_id: param.assessmentAttemptID };
    AssessmentService.renderAssessmentAttemptMark(para).then((res) => {
      //console.log(res.data)
      const arr = [];
      for (let index = 0; index < res.data.length; index++) {
        const question = {
          questionID: '',
          problemDescription: '',
          type: '',
          choice: [''],
          answerAttempt: [''],
          answer: ['']
        };
        question['questionID'] = res.data[index].Question.id;
        question['problemDescription'] =
          res.data[index].Question.question_description;
        question['type'] = res.data[index].Question.type;
        if (res.data[index].type != 'Essay') {
          question['choice'] = JSON.parse(
            res.data[index].Question.choices
          ).choices;
        }
        question['answerAttempt'] = JSON.parse(
          res.data[index].Question.answer_attempt
        ).answer_attempt;

        if (JSON.parse(res.data[index].Question.answer).answer == '') {
          question['answer'] = [''];
        } else {
          question['answer'] = JSON.parse(
            res.data[index].Question.answer
          ).answer;
        }
        //console.log(question)
        arr.push(question);
      }
      setProblem(arr);
      setLoaded(!loaded);
      //setProbShow()
      //console.log(problem)
      window.addEventListener('beforeunload', listener);
    });
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  useEffect(() => {
    //console.log("After update" + JSON.stringify(problem))
    setProbShow(problem[0]);
    setIsActive(problem[0].questionID);
    //console.log("probShow: " + JSON.stringify(probShow))
  }, [loaded]);

  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <h3>{param.topicName + ' ' + param.assessmentName}</h3>
            </div>
            <div className="mt-5 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {problem.map((prob) => (
                  <div
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    style={{
                      backgroundColor:
                        prob.questionID == isActive ? 'green' : ''
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsActive(prob.questionID);
                        //console.log('selectProblemID: ' + isActive);
                        setProbShow(prob);
                      }}
                    >
                      {'Question' + (problem.indexOf(prob) + 1)}
                    </button>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="md:pl-64">
          <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
            <main className="flex-1">
              <div className="py-6">
                <div className="px-4 sm:px-6 md:px-0">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {'Question' + probShow.questionID}
                  </h1>
                </div>
                <div className="px-4 sm:px-6 md:px-0">
                  {/* Replace with your content */}
                  <div className="py-4">
                    <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
                      <div className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {/* Actual problem description */}
                        <ReactMarkdown
                          className="prose prose-sm max-w-none"
                          children={probShow.problemDescription}
                          remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
                          rehypePlugins={[rehypeHighlight, rehypeKatex]}
                        />
                        {probShow.type == 'singleChoice' && (
                          <h2>(single choice)</h2>
                        )}
                        {probShow.type == 'multipleChoice' && (
                          <h2>(multiple choice)</h2>
                        )}
                      </div>
                      <div className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {probShow.type == 'singleChoice' &&
                          probShow.choice?.map((cho) => (
                            <div className="relative flex items-start">
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="comments"
                                  className="font-medium text-gray-700"
                                >
                                  {cho.split(/(?!.)/g).slice(0, 1) + ' '}
                                </label>
                                <span
                                  id="comments-description"
                                  className="text-gray-500"
                                >
                                  <span className="sr-only">New comments </span>
                                  {cho.split(/(?!.)/g).slice(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                        {probShow.type == 'multipleChoice' &&
                          probShow.choice?.map((cho) => (
                            <div className="relative flex items-start">
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="comments"
                                  className="font-medium text-gray-700"
                                >
                                  {cho.split(/(?!.)/g).slice(0, 1) + ' '}
                                </label>
                                <span
                                  id="comments-description"
                                  className="text-gray-500"
                                >
                                  <span className="sr-only">New comments </span>
                                  {cho.split(/(?!.)/g).slice(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                        {probShow.type == 'Essay' && (
                          <div className="mt-1">
                            <textarea
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Write your answer here"
                              value={probShow.answerAttempt[0]}
                              // onChange={essayAnswer}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
                      <div className="ml-3 text-sm">
                        AnswerAttempt:{' '}
                        {probShow.answerAttempt?.map((att: any) => (
                          <div className="relative flex items-start">
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="comments"
                                className="font-medium text-gray-700"
                              >
                                {att.split(/(?!.)/g).slice(0, 1) + ' '}
                              </label>
                              <span
                                id="comments-description"
                                className="text-gray-500"
                              >
                                <span className="sr-only">New comments </span>
                                {att.split(/(?!.)/g).slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="ml-3 text-sm">
                        CorrectAnswer:{' '}
                        {probShow.answer?.map((ans: any) => (
                          <div className="relative flex items-start">
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="comments"
                                className="font-medium text-gray-700"
                              >
                                {ans.split(/(?!.)/g).slice(0, 1) + ' '}
                              </label>
                              <span
                                id="comments-description"
                                className="text-gray-500"
                              >
                                <span className="sr-only">New comments </span>
                                {ans.split(/(?!.)/g).slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="put mark here"
                        onChange={handleChangeMark}
                      />
                      <br></br>
                      <textarea
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Write your feedback here"
                        value={feedback}
                        onChange={handleChangeFeedback}
                      />
                      <br></br>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          // console.log(problem)
                          //console.log(param)
                          const para = {
                            token: localStorage.getItem('access_token'),
                            assessment_attempt_id: param.assessmentAttemptID,
                            feedback: feedback,
                            mark: mark
                          };
                          console.log(para);
                          const regFloat = /^-?[1-9]\d*$/;
                          if (regFloat.test(mark) == false) {
                            setMesg('Mark should be in integer format');
                            setShowMessage(true);
                          } else {
                            AssessmentService.updateAttemptMark(para).then(
                              (res) => {
                                console.log(res.data);
                                alert('finish marking');
                                routeChange(
                                  '/assessmentAttempsTestOverview/' +
                                    param.topicName +
                                    '/' +
                                    param.topicId +
                                    '/' +
                                    param.assessmentName +
                                    '/' +
                                    param.assessmentId +
                                    '/' +
                                    'a'
                                );
                              }
                            );
                          }
                        }}
                      >
                        Finish marking
                      </button>
                    </div>
                  </div>
                  <MessageModal
                    show={showMessage}
                    close={() => setShowMessage(false)}
                    message={mesg}
                  />
                  {/* /End replace */}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
