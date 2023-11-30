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
import { capitalise } from 'content/contentHelpers';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ChevronRight } from '@mui/icons-material';
import { Divider } from '@mui/material';

export default function AssessmentAttempt() {
  const param = useParams();
  const navigate = useNavigate();
  const routeChange = (path: To) => {
    navigate(path);
  };
  const [showMessage, setShowMessage] = useState(false);
  const [isActive, setIsActive] = useState('-1');
  const [problem, setProblem] = useState([
    {
      questionID: "",
      problemDescription: "",
      type: "",
      choice: [""],
      answerAttempt: [] as any,
      answer: [""]
    },
  ]);

  const [isAnswered, setIsAnswered] = useState(false);

  const singleSelect = async (cho: string) => {
    console.log(cho);
    await setProblem((prev) => {
      let i = 0;
      while (i < prev.length) {
        if (prev[i] == probShow) {
          break;
        }
        i++;
      }
      prev[i].answerAttempt = [cho];
      const arrCopy = prev.slice();
      return arrCopy;
    });
    console.log('problem: ' + JSON.stringify(problem));
  };

  const multiSelect = async (cho: string) => {
    console.log(cho);
    await setProblem((prev) => {
      let i = 0;
      while (i < prev.length) {
        if (prev[i] == probShow) {
          break;
        }
        i++;
      }
      const index = prev[i].answerAttempt.indexOf(cho)
      console.log("index: " + index)
      index == -1 ? prev[i].answerAttempt.push(cho) : prev[i].answerAttempt.splice(index, 1);
      console.log(JSON.stringify(prev[i].answerAttempt))
      const arrCopy = prev.slice();
      return arrCopy;
    });
    console.log('problem: ' + JSON.stringify(problem));
  }
  const essayAnswer = async (e: { target: { value: any; }; }) => {
    const ans = e.target.value;
    //console.log(ans);
    await setProblem((prev) => {
      let i = 0;
      while (i < prev.length) {
        if (prev[i] == probShow) {
          break;
        }
        i++;
      }
      prev[i].answerAttempt = [ans];
      const arrCopy = prev.slice();
      return arrCopy;
    });
    console.log('problem: ' + JSON.stringify(probShow))
  }

  const [probShow, setProbShow] = useState(problem[0]);
  //flag to see if back service loaded
  const [loaded, setLoaded] = useState(true)

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = 'Changes you made may not be saved.'
  }


  useEffect(() => {
    console.log(param)
    const para = { assessment_id: param.assessmentId }
    AssessmentService.renderAssessmentAttempt(para)
      .then(res => {
        const arr = []
        for (let index = 0; index < res.data.length; index++) {
          const question = {
            questionID: "",
            problemDescription: "",
            type: "",
            choice: [],
            answerAttempt: [],
            answer: []
          }
          question["questionID"] = res.data[index].id
          question["problemDescription"] = res.data[index].question_description
          question["type"] = res.data[index].type
          if (res.data[index].type != "Essay") {
            question["choice"] = JSON.parse(res.data[index].choices).choices
          }
          question["answerAttempt"] = []
          question["answer"] = JSON.parse(res.data[index].answer).answer
          console.log(question)
          arr.push(question)
        }
        console.log('arr: ' + arr.length)
        const newData = [
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
            answerAttempt: [] as any,
            answer: ['A. cout << "Hello World";']
          },
          {
            questionID: '2',
            problemDescription: 'which of the functions below can be used Allocate space for array in memory',
            type: 'multipleChoice',
            choice: ['A. calloc()', 'B. malloc()', 'C. realloc()', 'D. free()'],
            answerAttempt: [] as any,
            answer: ['A. calloc()', 'B. malloc()']
          },
          {
            questionID: '3',
            problemDescription: 'What is the best programming language',
            type: 'Essay',
            answerAttempt: [] as any,
            answer: ['']
          },
        ]
        newData.map((elem) => {
          arr.push(elem)
        })
        setProblem(arr);
        setLoaded(!loaded)
        //setProbShow()
        //console.log(problem)
        window.addEventListener('beforeunload', listener)
      })
  }, [])

  useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', listener)
    }
  }, [])

  useEffect(() => {
    console.log("After update" + JSON.stringify(problem))
    setProbShow(problem[0])
    setIsActive(problem[0].questionID)
    //console.log("probShow: " + JSON.stringify(probShow))
  }, [loaded])


  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col mt-16">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
            <div className="flex flex-shrink-0 items-center align-center justify-center px-4">
              <h2 className='ml-2 text-lg font-bold'>
                {param.topicName + ' ' + param.assessmentName}
              </h2>
            </div>
            <div className="mt-5 flex flex-none flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {problem.map((prob) => (
                  <button
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${prob.questionID == isActive ? 'text-white bg-indigo-500' : ''}`}
                    onClick={() => {
                      setIsActive(prob.questionID);
                      //console.log('selectProblemID: ' + isActive);
                      setProbShow(prob);
                    }}
                  >
                    <div className='flex flex-row'>
                      <div>
                        {'Question ' + (problem.indexOf(prob) + 1)}
                        {/* {'Question ' + (prob.questionID)} */}
                      </div>
                      <div>
                        {
                          prob.answerAttempt[0] != null
                            ? <DoneAllOutlinedIcon className={`h-6 w-6 text-black`}></DoneAllOutlinedIcon>
                            : <></>
                        }
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
            <div className='flex justify-center my-4'>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  // console.log(problem)
                  console.log(param)
                  const para = {
                    token: localStorage.getItem("access_token"),
                    enroll_id: param.enrollId,
                    assessment_id: param.assessmentId,
                    problem: problem
                  }
                  console.log(para)
                  AssessmentService.submitPracAttempt(para)
                    .then((res) => {
                      console.log(res.data)
                      alert('Submit successfully');
                      routeChange(
                        '/assessmentDetail/' +
                        param.enrollId +
                        '/' +
                        param.topicName +
                        '/' +
                        param.topicId
                      );
                    })
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="md:pl-64">
          <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
            <main className="flex-1">
              <div className="py-6">
                <div className="px-4 sm:px-6 md:px-0">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {'Question ' + (problem.indexOf(probShow) + 1)}
                  </h1>
                </div>
                <div className="px-4 sm:px-6 md:px-0">
                  {/* Replace with your content */}
                  <div className="py-4">
                    <div className="h-max rounded-lg border-4 border-gray-200">
                      <div className="flex flex-row whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                        {capitalise(probShow.problemDescription)}
                        {probShow.type == 'singleChoice' && (
                          <h2>(single choice)</h2>
                        )}
                        {probShow.type == 'multipleChoice' && (
                          <h2>(multiple choice)</h2>
                        )}
                      </div>
                      <div className="flex flex-col whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {probShow.type == 'singleChoice' &&
                          probShow.choice?.map((cho) => (
                            <div className="relative flex items-start pb-2">
                              <div className="flex flex-row h-5 items-center">
                                <input
                                  id="comments"
                                  aria-describedby="comments-description"
                                  name="comments"
                                  type="radio"
                                  onChange={() => singleSelect(cho)}
                                  checked={probShow.answerAttempt == cho}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                              </div>
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
                        {probShow.type == 'multipleChoice' && (
                          probShow.choice?.map((cho) => (
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="comments"
                                  aria-describedby="comments-description"
                                  name="comments"
                                  type="checkbox"
                                  onChange={() => multiSelect(cho)}
                                  checked={probShow.answerAttempt.includes(cho)}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                              </div>
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
                          ))
                        )}
                        {probShow.type == 'Essay' &&
                          <div className="mt-1">
                            <textarea
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Write your answer here"
                              value={probShow.answerAttempt[0]}
                              onChange={essayAnswer}
                            />
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  {/* /End replace */}
                </div>
                <div className='flex flex-row justify-between'>
                  <button type="button"
                    // the last effect is not working, hence add one duplicate hover effect to avoid the problem
                    className={`${problem[0] == probShow ? 'invisible' : ''} inline-flex items-center justify-center rounded-md border border-transparent text-indigo-600 px-3 py-2 text-sm font-medium leading-4 shadow-md hover:bg-indigo-700 hover:text-white hover:text-white}`}
                    onClick={() => {
                      const currentIndex = problem.findIndex((item) => item.questionID === probShow.questionID);
                      if (currentIndex > 0) {
                        const prevQuestion = problem[currentIndex - 1];
                        setIsActive(prevQuestion.questionID);
                        setProbShow(prevQuestion);
                      }
                    }}>
                    <ChevronLeftIcon className='h-6 w-6'></ChevronLeftIcon>
                    <p>Prev</p>
                  </button>
                  <button type="button"
                    // the last effect is not working, hence add one duplicate hover effect to avoid the problem
                    className={`${problem[problem.length - 1] == probShow ? 'invisible' : ''} inline-flex items-center justify-center rounded-md border border-transparent text-indigo-600 px-3 py-2 text-sm font-medium leading-4 shadow-md hover:bg-indigo-700 hover:text-white hover:text-white}`}
                    onClick={() => {
                      const currentIndex = problem.findIndex((item) => item.questionID === probShow.questionID); 7
                      if (currentIndex < problem.length - 1) {
                        const nextQuestion = problem[currentIndex + 1];
                        setIsActive(nextQuestion.questionID);
                        setProbShow(nextQuestion);
                      }
                    }}
                  >
                    <p>Next</p>
                    <ChevronRightIcon className='h-6 w-6'></ChevronRightIcon>
                  </button>
                </div>

                {/* {problem[problem.length - 1].questionID === probShow.questionID
                  ? <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      // console.log(problem)
                      console.log(param)
                      const para = {
                        token: localStorage.getItem("access_token"),
                        enroll_id: param.enrollId,
                        assessment_id: param.assessmentId,
                        problem: problem
                      }
                      console.log(para)
                      AssessmentService.submitPracAttempt(para)
                        .then((res) => {
                          console.log(res.data)
                          alert('Submit successfully');
                          routeChange(
                            '/assessmentDetail/' +
                            param.enrollId +
                            '/' +
                            param.topicName +
                            '/' +
                            param.topicId
                          );
                        })
                    }}
                  >
                    Submit
                  </button>
                  : <></>} */}

              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
