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
import { CheckIcon } from "@heroicons/react/24/outline";
import AssessmentService from "./AssessmentService";
import { json } from "stream/consumers";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import e from "express";
import { capitalise } from "content/contentHelpers";
import BreadCrumb from "common/BreadCrumb";

export default function AssessmentAttemptDetail() {
  const param = useParams();
  const navigate = useNavigate();
  const routeChange = (path: To) => {
    //let path = `newPath`;
    navigate(path);
  };
  const [isActive, setIsActive] = useState("-1");
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
    },
  ]);

  const [probShow, setProbShow] = useState(problem[0]);
  //flag to see if back service loaded
  const [loaded, setLoaded] = useState(true);

  const [attempt, setAttempt] = useState([""]);
  const [result, setResult] = useState([""]);
  const [status, setStatus] = useState(false);

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = "Changes you made may not be saved.";
  };

  useEffect(() => {
    console.log(param);
    const para = { assessment_attempt_id: param.assessmentAttemptID };
    AssessmentService.renderAssessmentAttemptMark(para).then((res) => {
      console.log(res.data);
      const arr = [];
      for (let index = 0; index < res.data.length; index++) {
        const question = {
          questionID: "",
          problemDescription: "",
          type: "",
          choice: [""],
          answerAttempt: [""],
          answer: [""],
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
      // arr.map((elem) => {
      console.log(arr.length);
      // })
      // const newData = [
      //   {
      //     questionID: "1",
      //     problemDescription:
      //       "What is a correct syntax to output 'Hello World' in C++?",
      //     type: "singleChoice",
      //     choice: [
      //       "A. cout << 'Hello World';",
      //       "B. Console.WriteLine('Hello World');",
      //       "C. print ('Hello World');",
      //       "D. System.out.println('Hello World');"
      //     ],
      //     answerAttempt: ["A. cout << 'Hello World';"],
      //     answer: ["A. cout << 'Hello World';"]
      //   },
      //     {
      //         questionID: "2",
      //         problemDescription: "which of the functions below can be used Allocate space for array in memory",
      //         type: "multipleChoice",
      //         choice: ["A. calloc()", "B. malloc()", "C. realloc()", "D. free()"],
      //         answerAttempt: ["A. calloc()", "B. malloc()"],
      //         answer: ["A. calloc()", "B. malloc()"]
      //     },
      //     {
      //         questionID: "3",
      //         problemDescription: "What is the best programming language",
      //         type: "Essay",
      //         choice: [""] as any,
      //         answerAttempt: [""] as any,
      //         answer: [""] as any
      //     }
      // ]

      // newData.map((elem) => {
      //   arr.push(elem)
      // })
      // arr.push(newData[0])
      // arr.push(newData[1])
      // arr.push(newData[2])
      setProblem(arr);
      setLoaded(!loaded);

      //setProbShow()
      //console.log(problem)
      //window.addEventListener('beforeunload', listener)
    });
  }, []);

  useEffect(() => {
    // console.log("After update" + JSON.stringify(problem))
    setProbShow(problem[0]);
    setIsActive(problem[0].questionID);
    setAttempt(probShow.answerAttempt);
    setResult(probShow.answer);
    setStatus(attempt === result);
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
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 bg-gray-100">
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
              {/* <div className="hidden">
                                <BreadCrumb currName="Attempt Detail" currPath="loca"></BreadCrumb>
                            </div> */}
            </div>
            <div className="mt-5 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {problem.map((prob) => (
                  <div
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${prob.questionID == isActive
                      ? "text-white bg-indigo-500"
                      : ""
                      }`}
                  >
                    <button
                      onClick={() => {
                        setIsActive(prob.questionID);
                        console.log("length: " + problem.length);
                        setProbShow(prob);
                      }}
                    >
                      {"Question " + (problem.indexOf(prob) + 1)}
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
                    {"Question " + (problem.indexOf(probShow) + 1)}
                  </h1>
                </div>
                <div className="px-4 sm:px-6 md:px-0">
                  {/* Replace with your content */}
                  <div className="py-4">
                    {/* Question */}
                    <div className="h-max rounded-lg border-4 border-gray-200">
                      <div className="flex flex-row whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                        {capitalise(probShow.problemDescription)}
                        {probShow.type == "singleChoice" && (
                          <h2>(single choice)</h2>
                        )}
                        {probShow.type == "multipleChoice" && (
                          <h2>(multiple choice)</h2>
                        )}
                      </div>
                      <div className="flex flex-col whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {/* {compareAnswers[parseInt(probShow.questionID) - 1].attempt === compareAnswers[parseInt(probShow.questionID) - 1].correct} */}
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
                    {/* Answer section */}
                    <div className="h-max rounded-lg border-4 border-gray-200 mt-6">
                      <div className="ml-3 text-sm font-semibold">
                        Answer Attempt:{" "}
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
                      </div>
                      <div className="mt-2 ml-3 text-sm font-semibold text-green-600">
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
                      </div>
                      {/* <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => {
                                                    //assessmentAttemptsList/10/Topic%206/6/quiz1/1/a
                                                    routeChange(
                                                        '/assessmentAttemptsList' +
                                                        '/' +
                                                        param.enrollId +
                                                        '/' +
                                                        param.topicName +
                                                        '/' +
                                                        param.topicId +
                                                        '/' +
                                                        param.assessmentName +
                                                        '/' +
                                                        param.assessmentId +
                                                        '/' +
                                                        'a'
                                                    )
                                                }}
                                            >
                                                Back
                                            </button> */}
                    </div>
                  </div>
                  {/* /End replace */}
                </div>
                <div className="flex flex-row justify-between">
                  <button
                    type="button"
                    // the last effect is not working, hence add one duplicate hover effect to avoid the problem
                    className={`${problem[0] == probShow ? "invisible" : ""
                      } inline-flex items-center justify-center rounded-md border border-transparent text-indigo-600 px-3 py-2 text-sm font-medium leading-4 shadow-md hover:bg-indigo-700 hover:text-white hover:text-white}`}
                    onClick={() => {
                      const currentIndex = problem.findIndex(
                        (item) => item.questionID === probShow.questionID
                      );
                      if (currentIndex > 0) {
                        const prevQuestion = problem[currentIndex - 1];
                        setIsActive(prevQuestion.questionID);
                        setProbShow(prevQuestion);
                      }
                    }}
                  >
                    <ChevronLeftIcon className="h-6 w-6"></ChevronLeftIcon>
                    <p>Prev</p>
                  </button>
                  <button
                    type="button"
                    // the last effect is not working, hence add one duplicate hover effect to avoid the problem
                    className={`${problem[problem.length - 1] == probShow ? "invisible" : ""
                      } inline-flex items-center justify-center rounded-md border border-transparent text-indigo-600 px-3 py-2 text-sm font-medium leading-4 shadow-md hover:bg-indigo-700 hover:text-white hover:text-white}`}
                    onClick={() => {
                      const currentIndex = problem.findIndex(
                        (item) => item.questionID === probShow.questionID
                      );
                      7;
                      if (currentIndex < problem.length - 1) {
                        const nextQuestion = problem[currentIndex + 1];
                        setIsActive(nextQuestion.questionID);
                        setProbShow(nextQuestion);
                      }
                    }}
                  >
                    <p>Next</p>
                    <ChevronRightIcon className="h-6 w-6"></ChevronRightIcon>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
