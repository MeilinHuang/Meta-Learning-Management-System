import { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  To,
} from "react-router-dom";
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AssessmentService from "./AssessmentService";
import { json } from "stream/consumers";
import MessageModal from "./messageModal";
import { capitalise } from "content/contentHelpers";

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
  const [mesg, setMesg] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isActive, setIsActive] = useState(1);
  const [mark, setMark] = useState("0");
  const [feedback, setFeedback] = useState("");
  const [problem, setProblem] = useState([
    {
      questionID: "",
      problemDescription: "",
      type: "",
      choice: [""],
      answerAttempt: [""],
      answer: [""],
      mark: "",
      feedback: "",
    },
    // {
    //     questionID: "1",
    //     problemDescription:
    //         'What is a correct syntax to output "Hello World" in C++?',
    //     type: "singleChoice",
    //     choice: [
    //         'A. cout << "Hello World";',
    //         'B. Console.WriteLine("Hello World");',
    //         'C. print ("Hello World");',
    //         'D. System.out.println("Hello World");',
    //     ],
    //     answerAttempt: ['A. cout << "Hello World";'],
    //     answer: ['A. cout << "Hello World";'],
    //     mark: "0",
    //     feedback: ""
    // },
    // {
    //     questionID: '2',
    //     problemDescription: 'which of the functions below can be used Allocate space for array in memory',
    //     type: 'multipleChoice',
    //     choice: ['A. calloc()', 'B. malloc()', 'C. realloc()', 'D. free()'],
    //     answerAttempt: ['A. calloc()', 'B. malloc()'],
    //     answer: ['A. calloc()', 'B. malloc()'],
    //     mark: "0",
    //     feedback: ""
    // },
    // {
    //     questionID: "3",
    //     problemDescription: "What is the best programming language",
    //     type: "Essay",
    //     answerAttempt: [] as any,
    //     answer: [""] as any,
    //     mark: "0",
    //     feedback: ""
    // },
  ]);

  const [probShow, setProbShow] = useState(problem[0]);
  //flag to see if back service loaded
  const [loaded, setLoaded] = useState(true);;

  const [problemMarks, setProblemMarks] = useState({});
  const [problemFeedbacks, setProblemFeedbacks] = useState({});

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = "Changes you made may not be saved.";;
  };;

  const handleChangeMark = (event: React.ChangeEvent<HTMLInputElement>, questionID: string) => {
    const newMarks = { ...problemMarks };
    newMarks[questionID] = event.target.value;
    setProblemMarks(newMarks);

    const updatedProblem = problem.map((prob) => {
      if (prob.questionID === questionID) {
        return { ...prob, mark: event.target.value };
      }
      return prob;
    });
    setProblem(updatedProblem)
  };

  const handleChangeFeedback = (event: React.ChangeEvent<HTMLTextAreaElement>, questionID: string) => {
    // setFeedback(event.target.value);
    const newFeedbak = { ...problemFeedbacks };
    newFeedbak[questionID] = event.target.value;
    setProblemFeedbacks(newFeedbak);

    const updatedProblem = problem.map((prob) => {
      if (prob.questionID === questionID) {
        return { ...prob, feedback: event.target.value };
      }
      return prob;
    });
    setProblem(updatedProblem)
  };

  const [attempt, setAttempt] = useState([""]);
  const [result, setResult] = useState([""]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    console.log('Component re-rendered:', problemMarks, problem);
  }, [problemMarks, problem]);

  useEffect(() => {
    console.log(param);
    const para = { assessment_attempt_id: param.assessmentAttemptID };
    AssessmentService.renderAssessmentAttemptMark(para).then((res) => {
      console.log("result: ", res.data)
      const arr = [];
      for (let index = 0; index < res.data.length; index++) {
        const question = {
          questionID: "",
          problemDescription: "",
          type: "",
          choice: [""],
          answerAttempt: [""],
          answer: [""],
          mark: "",
          feedback: ""
        };
        question["questionID"] = res.data[index].Question.id;
        question["problemDescription"] =
          res.data[index].Question.question_description;
        question["type"] = res.data[index].Question.type;
        if (res.data[index].type != "Essay") {
          question["choice"] = JSON.parse(
            res.data[index].Question.choices
          ).choices;
        }
        question["answerAttempt"] = JSON.parse(
          res.data[index].Question.answer_attempt
        ).answer_attempt;

        if (JSON.parse(res.data[index].Question.answer).answer == "") {
          question["answer"] = [""];
        } else {
          question["answer"] = JSON.parse(
            res.data[index].Question.answer
          ).answer;
        }
        //console.log(question)
        arr.push(question);
      }

      // const newData = [
      //   {
      //     questionID: "1",
      //     problemDescription:
      //       'What is a correct syntax to output "Hello World" in C++?',
      //     type: "singleChoice",
      //     choice: [
      //       'A. cout << "Hello World";',
      //       'B. Console.WriteLine("Hello World");',
      //       'C. print ("Hello World");',
      //       'D. System.out.println("Hello World");',
      //     ],
      //     answerAttempt: ['A. cout << "Hello World";'],
      //     answer: ['A. cout << "Hello World";'],
      //     mark: "0",
      //     feedback: ""
      //   },
      // ]
      // arr.push(newData[0])
      setProblem(arr);
      console.log("arr: ", arr)
      setLoaded(!loaded);
      //setProbShow()
      //console.log(problem)
      window.addEventListener("beforeunload", listener);
    });
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", listener);;
    };;
  }, []);;

  useEffect(() => {
    // console.log("After update" + JSON.stringify(problem))
    if (problem[0].problemDescription !== "") {
      setProbShow(problem[0]);
      setIsActive(parseInt(problem[0].questionID));
      setAttempt(probShow.answerAttempt);
      setResult(probShow.answer);
      setStatus(attempt === result);
    }
    // console.log("probShow: " + JSON.stringify(probShow))
  }, [loaded]);

  useEffect(() => {
    if (probShow.questionID !== "") {
      const selectedProblem = problem.find(
        (prob) => prob.questionID === probShow.questionID
      );
      if (selectedProblem) {
        setAttempt(selectedProblem.answerAttempt);
        setResult(selectedProblem.answer);
        setStatus(
          JSON.stringify(selectedProblem.answerAttempt) ===
          JSON.stringify(selectedProblem.answer)
        );
      }
    }
  }, [loaded, probShow]);

  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col mt-16">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
            <div
              className="cursor-pointer flex flex-row items-center flex-shrink-0 px-4 h-max hover:bg-gray-200 "
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeftIcon className="h-6 w-6" />
              <h2 className="ml-2 text-lg font-bold">
                {param.topicName + " " + param.assessmentName}
              </h2>
            </div>
            <div className="mt-5 flex flex-none flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {problem.map((prob) => (
                  <button
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${prob.questionID == isActive.toString()
                      ? "text-white bg-indigo-500"
                      : ""
                      }`}
                    onClick={() => {
                      setIsActive(parseInt(prob.questionID));
                      //console.log('selectProblemID: ' + isActive);
                      setProbShow(prob);
                    }}
                  >
                    {"Question " + (problem.indexOf(prob) + 1)}
                  </button>
                ))}
              </nav>
            </div>
            <div className='flex justify-center my-4'>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  let sum = 0;
                  const allFeedbacks = [];
                  for (const prob of problem) {
                    const questionID = prob.questionID;
                    const mark = parseInt(problemMarks[questionID]);
                    const feedback = problemFeedbacks[questionID];
                    sum += mark
                    allFeedbacks.push(feedback);
                  }
                  const para = {
                    token: localStorage.getItem("access_token"),
                    assessment_attempt_id: param.assessmentAttemptID,
                    // feedback: feedback,
                    // mark: mark,
                    feedback: allFeedbacks.join("\n"),
                    mark: sum.toString()
                  };
                  console.log(para);
                  const regFloat = /^-?[0-9]\d*$/;
                  // for (const elem of problemMarks) {
                  //     if (regFloat.test(elem.mark) == false)) {
                  //         return;
                  //     }
                  // }
                  console.log("sum: " + sum)
                  if (regFloat.test(sum.toString()) == false) {
                    setMesg("You haven't completed the marking yet.");
                    setShowMessage(true);
                  } else {
                    AssessmentService.updateAttemptMark(para).then(
                      (res) => {
                        console.log(res.data);
                        alert("Finish marking");
                        routeChange(
                          "/assessmentAttempsTestOverview/" +
                          param.topicName +
                          "/" +
                          param.topicId +
                          "/" +
                          param.assessmentName +
                          "/" +
                          param.assessmentId +
                          "/" +
                          "a"
                        );
                      }
                    );
                  }
                }
                }
              >
                Finish marking
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
                    {"Question " + (problem.indexOf(probShow) + 1)}
                  </h1>
                </div>
                <div className="px-4 sm:px-6 md:px-0">
                  {/* Replace with your content */}
                  <div className="py-4">
                    <div className="h-max rounded-lg border-4 border-gray-200">
                      <div className="flex flex-row whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                        {/* Actual problem description */}
                        <ReactMarkdown
                          className="prose prose-sm max-w-none"
                          children={probShow.problemDescription}
                          remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
                          rehypePlugins={[rehypeHighlight, rehypeKatex]}
                        />
                        {probShow.type == "singleChoice" && (
                          <h2>(single choice)</h2>
                        )}
                        {probShow.type == "multipleChoice" && (
                          <h2>(multiple choice)</h2>
                        )}
                      </div>
                      <div className="flex flex-col whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {probShow.type == "singleChoice" &&
                          probShow.choice?.map((cho) => (
                            <div className="relative flex items-start pb-2">
                              <div className="flex flex-row ml-3 text-sm items-center">
                                <label
                                  htmlFor="comments"
                                  className="font-medium text-gray-700"
                                >
                                  {cho.split(/(?!.)/g).slice(0, 1) + " "}
                                </label>
                                {attempt[0] === cho ? (
                                  status ? (
                                    <CheckIcon className="h-6 w-6 text-green-500"></CheckIcon>
                                  ) : (
                                    <XMarkIcon className="h-6 w-6 text-red-500"></XMarkIcon>
                                  )
                                ) : (
                                  <></>
                                )}
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
                        {probShow.type == "multipleChoice" &&
                          probShow.choice?.map((cho) => (
                            <div className="relative flex items-start pb-2">
                              <div className="flex flex-row ml-3 text-sm">
                                <label
                                  htmlFor="comments"
                                  className="font-medium text-gray-700"
                                >
                                  {cho.split(/(?!.)/g).slice(0, 1) + " "}
                                </label>
                                {attempt.includes(cho) ? (
                                  result.includes(cho) ? (
                                    <CheckIcon className="h-6 w-6 text-green-500"></CheckIcon>
                                  ) : (
                                    <XMarkIcon className="h-6 w-6 text-red-500"></XMarkIcon>
                                  )
                                ) : (
                                  <></>
                                )}
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
                        {probShow.type == "Essay" && (
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
                    <div className="px-4 sm:px-6 md:px-0 mt-10">
                      <h1 className="text-2xl font-semibold text-gray-900">
                        Give Marking and Feedback
                      </h1>
                    </div>
                    <div className="h-max rounded-lg border-4 border-gray-200 mt-6">
                      {/* <div className="ml-3 text-sm font-semibold">
                                                Answer Attempt:
                                                {probShow.answerAttempt?.map((att: any) => (
                                                    <div className="relative flex items-start">
                                                        <div className="ml-3 text-sm">
                                                            <label
                                                                htmlFor="comments"
                                                                className="font-medium text-gray-700"
                                                            >
                                                                {att.split(/(?!.)/g).slice(0, 1) + " "}
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
                                            </div> */}
                      {/* <div className="ml-3 text-sm font-semibold text-green-600">
                                                Correct Answer:{" "}
                                                {probShow.answer?.map((ans: any) => (
                                                    <div className="relative flex items-start">
                                                        <div className="ml-3 text-sm">
                                                            <label
                                                                htmlFor="comments"
                                                                className="font-medium text-gray-700"
                                                            >
                                                                {ans.split(/(?!.)/g).slice(0, 1) + " "}
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
                                            </div> */}
                      {problem.map((prob) => (
                        <div key={prob.questionID}>
                          {probShow && probShow.questionID === prob.questionID && (
                            <div className="py-4 pl-4 pr-3">
                              <div className="flex flex-row items-center align-center">
                                <p className="font-medium">Mark:</p>
                                <input
                                  type="text"
                                  placeholder="Put mark here"
                                  onChange={(event) => handleChangeMark(event, probShow.questionID)}
                                  value={prob.mark}
                                  // className="mt-2 ml-2 rounded-lg border-gray-200"
                                  className="b-4 mt-2 ml-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-row items-center align-center">
                                <p className="font-medium">Feedback:</p>
                                <textarea
                                  className="mt-2 ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  placeholder="Write your feedback here"
                                  value={prob.feedback}
                                  onChange={(event) => handleChangeFeedback(event, probShow.questionID)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
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
      </div >
    </>
  );
}
