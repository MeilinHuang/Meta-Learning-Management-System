import React, { useEffect, useState } from 'react';
import AssessmentService from './AssessmentService';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import { useDateSelect } from "react-ymd-date-select"
import Dropdown from 'react-dropdown';

export default function AssessmentMain() {
  const [topics, setTopics] = useState([
    {
      topic: 'c++',
      year: '2022',
      term: 'Term3',
      mark: 'N/A',
      topic_id: '2',
      enroll_id: '1'
    },
    {
      topic: 'Advanced algorithm',
      year: '2022',
      term: 'Term2',
      mark: '89',
      topic_id: '3',
      enroll_id: '2'
    }
  ]);
  const [searchedTopics, setsearchedTopics] = useState([
    {
      topic: 'c++',
      year: '2022',
      term: 'Term3',
      mark: 'N/A',
      topic_id: '2',
      enroll_id: '1'
    }
  ]);
  const [year, setYear] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };
  const handleClick = () => {
    //go search service function here
    const re = new RegExp("^.*" + year + ".*$", 'i')

    if (year == "") {
      setsearchedTopics(topics)
    }
    else {
      const arr = []
      for (let index = 0; index < topics.length; index++) {
        if (topics[index].year.match(re)) {
          const item = {
            topic: "",
            year: "",
            term: "",
            mark: "",
            topic_id: "",
            enroll_id: ""
          }
          item["topic"] = topics[index].topic
          item["year"] = topics[index].year
          item["term"] = topics[index].term
          item["mark"] = topics[index].mark
          item["topic_id"] = topics[index].topic_id
          item["enroll_id"] = topics[index].enroll_id
          arr.push(item)
        }
      }
      setsearchedTopics(arr)
    }
  };
  //const [state, setState] = useState([]);
  useEffect(() => {
    //use this to handle change
    const token = localStorage.getItem('access_token');
    const param = { token: token }
    //console.log(param)
    AssessmentService.loadMain(param)
      .then(res => {
        //console.log(res.data)
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
        //console.log(arr)
        setTopics(arr)
        setsearchedTopics(arr)
      });

  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Assessment</h1>
          <p className="mt-2 text-sm text-gray-700">Assessment overview</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <input
            type="text"
            placeholder="Search by Year"
            onChange={handleChange}
          />
          <button
            onClick={handleClick}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Topic
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Term
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      mark
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      detail
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {searchedTopics.map((topic) => (
                    <tr key={topic.topic}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {topic.topic}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {topic.year}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {topic.term}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {topic.mark}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

