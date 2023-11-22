import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import PomodoroService from "./PomodoroService";

interface ReportProps {
    setShowReportDialog: (show: boolean) => void;
    pomodoros: Pomodoro[];
    showReport: boolean
}

interface Pomodoro {
    date: string;
    duration: number; // Duration of the pomodoro in minutes
}

const Report: React.FC<ReportProps> = ({ setShowReportDialog, pomodoros, showReport }) => {
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [startDate, setStartDate] = useState(calculateStartDate(0));
    const [endDate, setEndDate] = useState(calculateEndDate(0));
    const [hoursFocusedThisWeek, setHoursFocusedThisWeek] = useState(0);
    const [daysFocusedThisWeek, setDaysFocusedThisWeek] = useState(0);
    const [currentDayStreak, setCurrentDayStreak] = useState(0);
    const [graphData, setGraphData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])

    useEffect(() => {
        const start = calculateStartDate(currentWeekIndex);
        const end = calculateEndDate(currentWeekIndex);
        setStartDate(start);
        setEndDate(end);
        console.log(start, end)
    }, [currentWeekIndex, pomodoros, graphData]);

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    const handlePomodoroLogs = () => {
        const token = localStorage.getItem('access_token')
        console.log(token)
        const startDateFormatted = formatDate(startDate)
        const endDateFormatted = formatDate(endDate)

        console.log(startDateFormatted, endDateFormatted)
        PomodoroService.getThisWeeksLogs(token, startDateFormatted, endDateFormatted)
            .then(
                (e) => {
                    const aggregate = e.data.Sessions
                    console.log(aggregate)
                    const aggregateValues: number[] = Object.values(aggregate)
                    console.log(aggregateValues)
                    const updateGraphData = aggregateValues.map(value => value / 60)

                    // Calculate total hours focused this week
                    const totalHoursFocused = aggregateValues.reduce((acc, value) => acc + value / 60, 0);

                    // Calculate the fraction of days focused
                    const daysFocused = aggregateValues.filter(value => value > 0).length

                    // Calculate the day streak
                    const dayStreak = calculateDayStreak(aggregateValues);

                    setGraphData(updateGraphData)
                    setHoursFocusedThisWeek(totalHoursFocused)
                    setCurrentDayStreak(dayStreak)
                    setDaysFocusedThisWeek(daysFocused)
                })
    }

    function calculateDayStreak(aggregateValues: number[]): number {
        let streak = 0;
        let currentStreak = 0;

        for (let i = aggregateValues.length - 1; i >= 0; i--) {
            if (aggregateValues[i] > 0) {
                currentStreak++;
            } else {
                // Reset the streak if encountering a day with zero focus time
                currentStreak = 0;
            }

            // Update the overall streak if the current streak is longer
            streak = Math.max(streak, currentStreak);
        }

        return streak;
    }

    useEffect(() => {
        if (showReport) {
            handlePomodoroLogs()
        }
    }, [showReport])

    const goToPreviousWeek = () => {
        setCurrentWeekIndex(currentWeekIndex - 1);
        handlePomodoroLogs();
    };

    const goToNextWeek = () => {
        setCurrentWeekIndex(currentWeekIndex + 1);

        handlePomodoroLogs();
    };

    return (
        <div className="report-dialog bg-white shadow-lg rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-96">
            <div className="flex justify-between">
                <h3 className="text-xl font-bold mb-2">Reports</h3>
                <button
                    className="bg-gray-500 hover:bg-indigo-500 text-white px-2 py-1 rounded-full"
                    onClick={() => setShowReportDialog(false)}
                >
                    Close
                </button>
            </div>
            <div className="report-statistics flex flex-row p-2 space-x-1">
                <div className="report-statistic rounded border p-4 py-6 pb-2">
                    <div className="flex flex-row justify-between">
                        <i className="report-statistic-icon fa-regular fa-clock fa-2xl" />
                        <p className="report-statistic-value text-right">
                            {hoursFocusedThisWeek.toFixed(2)}
                        </p>
                    </div>
                    <p className="text-xs">Hours Focused</p>
                </div>
                <div className="report-statistic rounded border p-4 py-6 pb-2">
                    <div className="flex flex-row justify-between">
                        <i className="report-statistic-icon fa-solid fa-calendar-days fa-2xl" />
                        <p className="report-statistic-value text-right">{daysFocusedThisWeek}/7</p>
                    </div>
                    <p className="text-xs">Days Focused</p>
                </div>
                <div className="report-statistic rounded border p-4 py-6 pb-2">
                    <div className="flex flex-row justify-between">
                        <i className="report-statistic-icon fa-solid fa-fire-flame-curved fa-2xl" />
                        <p className="report-statistic-value">{currentDayStreak}</p>
                    </div>
                    <p className="text-xs">Day Streak</p>
                </div>
            </div>
            <div className="chart-container" style={{ width: "100%", height: "300px" }}>
                <BarChart
                    xAxis={[
                        {
                            id: "barCategories",
                            data: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
                            scaleType: "band",
                        },
                    ]}
                    series={[
                        {
                            data: graphData
                        },
                    ]}
                />
            </div>
            <div className="week-navigation flex justify-center mt-4">
                {/* <button
                    onClick={goToNextWeek}
                    className="text-s bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded-full mr-2"
                >
                    Prev
                </button> */}
                <div className="date-range-pill mx-2">
                    {startDate.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('/', '/')}
                    {" - "}
                    {endDate.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('/', '/')}
                </div>

                {/* <button
                    onClick={goToPreviousWeek}
                    disabled={currentWeekIndex === 0}
                    className={`text-s bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded-full ${currentWeekIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Next
                </button> */}
            </div>


        </div >
    );
};
// Function to calculate the start date of a specific week
const calculateStartDate = (currentWeekIndex: number): Date => {
    const currentDate = new Date(); // Current date
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - currentDate.getDay() + 1 - (currentWeekIndex * 7));
    return startOfWeek;
};

// Function to calculate the end date of a specific week
const calculateEndDate = (currentWeekIndex: number): Date => {
    const startDate = calculateStartDate(currentWeekIndex);
    const endOfWeek = new Date(startDate);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return endOfWeek;
};

export default Report;