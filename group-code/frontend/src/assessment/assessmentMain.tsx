import React, { useEffect, useState } from 'react';
import AssessmentService from './AssessmentService';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, To, useLocation } from 'react-router-dom';
//import { useDateSelect } from "react-ymd-date-select"
import Dropdown from 'react-dropdown';
import Sidebar from 'common/Sidebar';
import { useSidebar } from 'content/SidebarContext';
import BreadCrumb from 'common/BreadCrumb';

export default function AssessmentMain() {
  const [topics, setTopics] = useState([
    {
      topic: "",
      year: "",
      term: "",
      mark: "",
      topic_id: "",
      enroll_id: "",
    },
  ]);
  // const [topics, setTopics] = useState([
  //   {
  //     topic: 'C++',
  //     year: '2022',
  //     term: 'Term3',
  //     mark: 'N/A',
  //     topic_id: '2',
  //     enroll_id: '1'
  //   },
  //   {
  //     topic: 'Advanced algorithm',
  //     year: '2022',
  //     term: 'Term2',
  //     mark: '89',
  //     topic_id: '3',
  //     enroll_id: '2'
  //   }
  // ]);
  const [searchedTopics, setSearchedTopics] = useState([
    {
      topic: "",
      year: "",
      term: "",
      mark: "",
      topic_id: "",
      enroll_id: "",
    }
  ]);
  // const [searchedTopics, setSearchedTopics] = useState([
  //   {
  //     topic: 'C++',
  //     year: '2022',
  //     term: 'Term3',
  //     mark: 'N/A',
  //     topic_id: '2',
  //     enroll_id: '1'
  //   }
  // ]);
  // const [year, setYear] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === "year") {
      setYear(event.target.value)
    } else if (type === "term") {
      setTerm(event.target.value)
    }
    setSearchVal(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch = () => {
    if (searchVal == "") {
      setSearchedTopics(topics);
      return;
    }
    const filteredTopics = topics.filter(topic =>
      Object.values(topic).some(value => value.toString().toLowerCase().includes(searchVal.toLowerCase()))
    );
    setSearchedTopics(filteredTopics);
  }

  const handleFilters = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === "year") {
      setYear(event.target.value)
    } else if (type === "term") {
      setTerm(event.target.value)
    }
    setSearchVal(event.target.value)
    handleSearch()
  }

  // const handleClick = () => {
  //   //go search service function here
  //   const re = new RegExp("^.*" + year + ".*$", 'i')

  //   if (year == "") {
  //     setSearchedTopics(topics)
  //   }
  //   else {
  //     const arr = []
  //     for (let index = 0; index < topics.length; index++) {
  //       if (topics[index].year.match(re)) {
  //         const item = {
  //           topic: "",
  //           year: "",
  //           term: "",
  //           mark: "",
  //           topic_id: "",
  //           enroll_id: ""
  //         }
  //         item["topic"] = topics[index].topic
  //         item["year"] = topics[index].year
  //         item["term"] = topics[index].term
  //         item["mark"] = topics[index].mark
  //         item["topic_id"] = topics[index].topic_id
  //         item["enroll_id"] = topics[index].enroll_id
  //         arr.push(item)
  //       }
  //     }
  //     setSearchedTopics(arr)
  //   }
  // };
  //const [state, setState] = useState([]);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation()

  const { sidebarOpen, assessmentShow } = useSidebar();
  const navigate = useNavigate();

  // const currentPaths = location.state || [];
  // const updatedPaths = [...currentPaths, { name: "Assessment Overview", path: "/assessmentMain" }];

  const routeChange = (path: To) => {
    navigate(path);
  };

  const [filtersVisible, setFiltersVisible] = useState(false)
  const [year, setYear] = useState("")
  const [term, setTerm] = useState("")

  const handleClear = () => {
    setYear("")
    setTerm("")
    setSearchedTopics(topics);
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const yearValue = event.target.value
    setSearchVal(yearValue)
    if (searchVal == "") {
      setSearchedTopics(topics);
      return;
    }
    setSearchedTopics(topics.filter((topic) =>
      Object.values(topic).some((value) =>
        value.toString().toLowerCase().includes(yearValue.toLowerCase())
      )
    ))
    // const filteredTopics = topics.filter((topic) =>
    //   Object.values(topic).some((value) =>
    //     value.toString().toLowerCase().includes(yearValue.toLowerCase())
    //   )
    // );
    // setSearchedTopics(filteredTopics);
  }
  const handleTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const termValue = event.target.value
    setSearchVal(termValue)
    if (searchVal == "") {
      setSearchedTopics(topics);
      return;
    }
    setSearchedTopics(topics.filter((topic) =>
      Object.values(topic).some((value) =>
        value.toString().toLowerCase().includes(termValue.toLowerCase())
      )
    ));
  }

  // useEffect(() => {
  //   setSearchVal(year)
  //   handleSearch()
  // }, [year])

  // useEffect(() => {
  //   setSearchVal(term)
  //   handleSearch()
  // }, [term])

  useEffect(() => {
    //use this to handle change
    const token = localStorage.getItem('access_token');
    const param = { token: token }
    //console.log(param)
    AssessmentService.loadMain(param)
      .then(res => {
        // console.log(res.data)
        const arr = []
        for (let index = 0; index < res.data.length; index++) {
          //const element = res.data[index];
          const item = {
            topic: "",
            year: "",
            term: "",
            mark: "",
            topic_id: "",
            enroll_id: ""
          }
          item["topic"] = res.data[index].topic.topic_name
          item["year"] = res.data[index].year
          item["term"] = res.data[index].term
          item["mark"] = res.data[index].mark
          item["topic_id"] = res.data[index].topic_id
          item["enroll_id"] = res.data[index].enroll_id
          console.log(item)
          arr.push(item)
        }
        const newData = [{
          topic: 'C++',
          year: '2022',
          term: 'Term 3',
          mark: 'N/A',
          topic_id: '5',
          enroll_id: '5'
        },
        {
          topic: 'Advanced algorithm',
          year: '2022',
          term: 'Term 2',
          mark: '89',
          topic_id: '6',
          enroll_id: '6'
        }]
        newData.map((elem) => {
          arr.push(elem)
        })
        //console.log(arr)
        setTopics(arr)
        setSearchedTopics(arr)
      });

  }, []);

  return (
    <div className='flex flex-row'>
      <div className="z-50 md:fixed md:top-16 md:bottom-0 md:flex md:flex-col">
        {/* <Sidebar isOpened={sidebarOpen}></Sidebar> */}
        <Sidebar></Sidebar>
        {/* </div> */}
      </div>
      {/* Assessment Overview */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className={`w-full top-16 flex flex-col md:w-auto px-4 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto py-10">
              <h1 className="text-3xl font-semibold text-gray-900">Assessment Overview</h1>
              <div className='hidden'>
                {/* <BreadCrumb currName="Assessment Overview" currPath={location.pathname}></BreadCrumb> */}
                <BreadCrumb></BreadCrumb>

              </div>
              {/* <p className="mt-2 text-sm text-gray-700">Assessment overview</p> */}
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="px-3 py-3 bg-slate-100">
            <div className='flex justify-between'>
              {/* Search Section */}
              <div className='relative flex items-stretch overflow-x-auto'>
                <div className="relative max-w-xs">
                  <label htmlFor="hs-table-search" className="sr-only">Search</label>
                  <input type="text" name="hs-table-search" id="hs-table-search" className="p-3 pl-10 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Search" onChange={(e) => { handleChange(e, "search") }} onKeyDown={handleKeyDown} />
                  {/* Search Icon */}
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                    <svg className="h-3.5 w-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </div>
                </div>
                {/* Search Button */}
                <button
                  // onClick={handleClick}
                  onClick={handleSearch}
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 ml-5 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  Search
                </button>
              </div>
              {/* Filters Section */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button onClick={() => { setFiltersVisible(!filtersVisible) }} type="button" className="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1">
                    <span className="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          />
                        </svg>
                      </div>
                      <div className="hidden sm:block">
                        Filters
                      </div>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {filtersVisible &&
            (
              <div className='flex justify-end'>
                <div className="flex flex-col items-center border border-gray-300 rounded-md p-4 space-y-4">
                  <div className='flex space-x-4'>
                    <div className='flex flex-row jsutify-center items-center space-x-4'>
                      <p className='font-medium'>Year</p>
                      <input
                        className="block w-20 appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder='Year'
                        // onChange={handleChange}
                        onChange={(e) => { handleChange(e, "year") }}
                        // onChange={(e) => { handleFilters(e, "year") }}
                        value={year}
                      // onChange={(e) => { setYear(e.target.value) }}
                      // onChange={handleYearChange}
                      />
                    </div>
                    <div className='flex flex-row jsutify-center items-center space-x-4'>
                      <p className='font-medium'>Term</p>
                      <input
                        className="block w-20 appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder='Term'
                        // onChange={(e) => { handleFilters(e, "term") }}
                        onChange={(e) => { handleChange(e, "term") }}
                        value={term}
                      // onChange={(e) => { setTerm(e.target.value) }}
                      // onChange={handleTermChange}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-white ml-5 px-4 py-2 text-sm font-semibold text-indigo-600 drop-shadow shadow-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                      type="button"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                    <button
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 ml-5 px-4 py-2 text-sm font-semibold text-white drop-shadow shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                      type="button"
                      onClick={handleSearch}
                    >
                      Filter
                    </button>
                  </div>
                </div>

              </div>
            )
          }

          {/* Assessment Overview Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full text-sm text-left divide-y divide-gray-300 text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-bold text-gray-900 sm:pl-6"
                        >
                          Topic
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-bold text-gray-900"
                        >
                          Year
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-bold text-gray-900"
                        >
                          Term
                        </th>
                        <th
                          scope="col"
                          className="w-10 px-10 py-3.5 text-sm font-bold text-gray-900"
                        >
                          Mark
                        </th>
                        <th
                          scope="col"
                          className="tex-end px-10 py-3.5 text-sm font-bold text-gray-900"
                        >
                          <span className="sr-only">Detail</span>
                        </th>
                      </tr>
                    </thead>
                    {searchedTopics.map((topic) => (
                      <tbody className="cursor-pointer divide-y divide-gray-200 bg-white"
                        onClick={() => { routeChange('/assessmentDetail/' + topic.enroll_id + '/' + topic.topic + '/' + topic.topic_id) }}>
                        <tr key={topic.topic} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th scope="row" className="whitespace-normal py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6 dark:text-white capitalize">
                            {topic.topic}
                          </th>
                          <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                            {topic.year}
                          </td>
                          <td className="whitespace-normal px-10 py-4 text-sm text-gray-500">
                            {topic.term}
                          </td>
                          <td className="text-center whitespace-normal px-10 py-4 text-sm text-gray-500">
                            {topic.mark}
                          </td>
                          <td className="relative text-end whitespace-normal px-10 py-4 text-sm font-semibold sm:pr-6">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {/* <Link to="/assessmentMain">Detail</Link> */}
                              <Link to={'/assessmentDetail/' + topic.enroll_id + '/' + topic.topic + '/' + topic.topic_id}>
                                Detail
                              </Link>
                              <span className="sr-only">, {topic.topic}</span>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

