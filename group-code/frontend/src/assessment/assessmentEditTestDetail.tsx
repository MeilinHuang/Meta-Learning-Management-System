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
import MessageModal from './messageModal';

export default function AssessmentEditTestDetail() {
    const param = useParams();
    const navigate = useNavigate();
    const routeChange = (path: To) => {
        //let path = `newPath`;
        navigate(path);
    };
    const [showMessage, setShowMessage] = useState(false);
    const [mesg, setMesg] = useState("");
    const [isActive, setIsActive] = useState('-1');
    const [add, setAdd] = useState(true)
    const [edit, setEdit] = useState(true)
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
        }
    ]);

    const [probShow, setProbShow] = useState(problem[0]);
    //flag to see if back service loaded
    const [loaded, setLoaded] = useState(true)
    const [loaded2, setLoaded2] = useState(true)
    const [addType, setAddType] = useState("")
    const [addQuestionDescription, setAddQuestionDescription] = useState("")
    const [addChoices, setAddChoices] = useState("")
    const [addAnswer, setAddAnswer] = useState("")

    const [editType, setEditType] = useState("")
    const [editQuestionDescription, setEditQuestionDescription] = useState("")
    const [editChoices, setEditChoices] = useState("")
    const [editAnswer, setEditAnswer] = useState("")
    const [editQuestionId, setEditQuestionId] = useState("")
    const [deleteQuestionId, setDeleteQuestionId] = useState("")

    const handleChangeAddType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddType(event.target.value);
    };
    const handleChangeAddQuestionDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddQuestionDescription(event.target.value);
    };
    const handleChangeAddChoices = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddChoices(event.target.value);
    };
    const handleChangeAddAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddAnswer(event.target.value);
    };

    const handleChangeEditType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditType(event.target.value);
    };
    const handleChangeEditQuestionDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditQuestionDescription(event.target.value);
    };
    const handleChangeEditChoices = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditChoices(event.target.value);
    };
    const handleChangeEditAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditAnswer(event.target.value);
    };

    useEffect(() => {
        if (deleteQuestionId != "") {
            const para = { question_id: deleteQuestionId }
            console.log(para)
            AssessmentService.deleteQuestionInAssessment(para)
                .then((res) => {
                    alert("success")
                    window.location.reload();
                })
        }
    }, [deleteQuestionId])

    useEffect(() => {
        console.log(param)
        const para = { assessment_id: param.assessmentId }
        AssessmentService.renderAssessmentAttempt(para)
            .then(res => {
                console.log(res.data)
                const arr = []
                for (let index = 0; index < res.data.length; index++) {
                    const question = {
                        questionID: "",
                        problemDescription: "",
                        type: "",
                        choice: [],
                        answerAttempt: [],
                        answer: [""]
                    }
                    question["questionID"] = res.data[index].id
                    question["problemDescription"] = res.data[index].question_description
                    question["type"] = res.data[index].type
                    if (res.data[index].type != "Essay") {
                        question["choice"] = JSON.parse(res.data[index].choices).choices
                    }
                    question["answerAttempt"] = []
                    if (JSON.parse(res.data[index].answer).answer == "") {
                        question["answer"] = [""]
                    }
                    else {
                        question["answer"] = JSON.parse(res.data[index].answer).answer
                    }
                    console.log(question)
                    arr.push(question)
                }
                setProblem(arr);
                setLoaded(!loaded)
                //setProbShow()
                //console.log(arr)
                if (arr.length == 0) {
                    setProblem(
                        [
                            {
                                questionID: '0',
                                problemDescription:
                                    'Sample problem(Need to be delete after editing)',
                                type: 'singleChoice',
                                choice: [
                                    'A. cout << "Hello World";',
                                    'B. Console.WriteLine("Hello World");',
                                    'C. print ("Hello World");',
                                    'D. System.out.println("Hello World");'
                                ],
                                answerAttempt: [] as any,
                                answer: ['A. cout << "Hello World";']
                            }
                        ]
                    )
                }
            })
    }, [])


    useEffect(() => {
        console.log("After update" + JSON.stringify(problem))
        setProbShow(problem[0])
        //console.log("probShow: " + JSON.stringify(probShow))
        setIsActive(problem[0].questionID)
        setLoaded2(!loaded2)

    }, [loaded])



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
                                                {probShow.problemDescription}
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
                                                        < div className="relative flex items-start" >
                                                            <div className="ml-3 text-sm" >
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
                                                        // onChange={essayAnswer}
                                                        />
                                                    </div>
                                                }
                                                <div className="ml-3 text-sm">
                                                    CorrectAnswer: {
                                                        probShow.answer?.map((ans: any) => (
                                                            < div className="relative flex items-start" >
                                                                <div className="ml-3 text-sm" >
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
                                                        ))
                                                    }
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        onClick={(() => {
                                                            setEdit(!edit)
                                                            setEditQuestionId(probShow.questionID)
                                                        })}
                                                    >
                                                        {edit ? "Edit" : "Close"}
                                                    </button>
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        onClick={() => {
                                                            console.log("delete api")
                                                            setDeleteQuestionId(probShow.questionID)

                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={(() => {
                                                    setAdd(!add)
                                                })}
                                            >
                                                {add ? "Add " : "Close"}
                                            </button>

                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => {
                                                    routeChange(
                                                        '/assessmentDetailEdit' +
                                                        '/' +
                                                        param.topicName +
                                                        '/' +
                                                        param.topicId
                                                    )
                                                }}
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0"
                                        style={{ display: add ? 'none' : 'block' }}
                                    >
                                        <h2>Add Question</h2>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Type
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeAddType}
                                                    placeholder='singleChoice/multipleChoice/Essay'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Question Description
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeAddQuestionDescription}
                                                    placeholder='Put your decription here'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Choices
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeAddChoices}
                                                    placeholder='format["A.xxx","B.xxx","C.xxx"] or nothing if Essay'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Answer
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeAddAnswer}
                                                    placeholder='format["A.xxx","B.xxx","C.xxx"] or nothing if Essay'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <button
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                                onClick={() => {
                                                    console.log("add Question api")
                                                    let choices
                                                    let answer
                                                    if (addChoices == "") {
                                                        choices = [""]
                                                    }
                                                    if (addAnswer == "") {
                                                        answer = [""]
                                                    }

                                                    choices = { "choices": JSON.parse(addChoices) }
                                                    answer = { "answer": JSON.parse(addAnswer) }

                                                    const para = {
                                                        assessment_id: param.assessmentId,
                                                        type: addType,
                                                        question_description: addQuestionDescription,
                                                        choices: JSON.stringify(choices),
                                                        answer: JSON.stringify(answer)
                                                    }
                                                    console.log(para)
                                                    AssessmentService.addNewQuestionInAssessment(para)
                                                        .then((res) => {
                                                            console.log(res.data)
                                                            alert("success")
                                                            window.location.reload();
                                                        })
                                                }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0"
                                        style={{ display: edit ? 'none' : 'block' }}
                                    >
                                        <h2>Edit Question</h2>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Type
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeEditType}
                                                    placeholder='singleChoice/multipleChoice/Essay'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Question Description
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeEditQuestionDescription}
                                                    placeholder='Put your decription here'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Choices
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeEditChoices}
                                                    placeholder='format["A.xxx","B.xxx","C.xxx"] or nothing if Essay'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                                Answer
                                            </label>
                                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    onChange={handleChangeEditAnswer}
                                                    placeholder='format["A.xxx","B.xxx","C.xxx"] or nothing if Essay'
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                            <button
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                                onClick={() => {
                                                    console.log("edit Question api")
                                                    let choices
                                                    let answer
                                                    if (editChoices == "") {
                                                        choices = [""]
                                                    }
                                                    if (editAnswer == "") {
                                                        answer = [""]
                                                    }
                                                    choices = { "choices": JSON.parse(editChoices) }
                                                    answer = { "answer": JSON.parse(editAnswer) }
                                                    const para = {
                                                        question_id: editQuestionId,
                                                        type: editType,
                                                        question_description: editQuestionDescription,
                                                        choices: JSON.stringify(choices),
                                                        answer: JSON.stringify(answer)
                                                    }
                                                    console.log(para)
                                                    const regType = ["singleChoice", "multipleChoice", "Essay"]
                                                    if (regType.includes(editType) == false) {
                                                        setMesg("type should be singleChoice/multipleChoice/Essay")
                                                        setShowMessage(true);
                                                    }
                                                    else {
                                                        AssessmentService.updateQuestionInAssessment(para)
                                                            .then((res) => {
                                                                console.log(res.data)
                                                                alert("success")
                                                                window.location.reload();
                                                            })
                                                    }

                                                }}
                                            >
                                                edit
                                            </button>
                                        </div>
                                    </div>
                                    <MessageModal
                                        show={showMessage}
                                        close={() => setShowMessage(false)}
                                        message={"The section is open you can not delete it"}
                                    />
                                    {/* /End replace */}
                                </div>
                            </div>
                        </main>
                    </div>
                </div >
            </div >
        </>
    );
}
