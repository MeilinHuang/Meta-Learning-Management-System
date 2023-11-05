import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

interface ReportProps {
    setShowReportDialog: (show: boolean) => void;
    pomodoros: Pomodoro[];
}

interface Pomodoro {
    date: string;
    duration: number; // Duration of the pomodoro in minutes
}

const Report: React.FC<ReportProps> = ({ setShowReportDialog, pomodoros }) => {
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [startDate, setStartDate] = useState(calculateStartDate(0));
    const [endDate, setEndDate] = useState(calculateEndDate(0));
    const [hoursFocusedThisWeek, setHoursFocusedThisWeek] = useState(0);
    const [daysFocusedThisWeek, setDaysFocusedThisWeek] = useState(0);
    const [currentDayStreak, setCurrentDayStreak] = useState(0);

    useEffect(() => {
        const start = calculateStartDate(currentWeekIndex);
        const end = calculateEndDate(currentWeekIndex);
        const hoursFocused = calculateHoursFocusedForWeek(pomodoros, start, end);
        const daysFocused = calculateDaysFocusedForWeek(pomodoros, start, end);
        const dayStreak = calculateCurrentDayStreakForWeek(pomodoros, start, end);

        setStartDate(start);
        setEndDate(end);
        setHoursFocusedThisWeek(hoursFocused);
        setDaysFocusedThisWeek(daysFocused);
        setCurrentDayStreak(dayStreak);
    }, [currentWeekIndex, pomodoros]);

    const goToPreviousWeek = () => {
        setCurrentWeekIndex(currentWeekIndex - 1);
    };

    const goToNextWeek = () => {
        setCurrentWeekIndex(currentWeekIndex + 1);
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
                            data: [2, 5, 3, 5, 6, 7, 4],
                        },
                    ]}
                />
            </div>
            <div className="week-navigation flex justify-between mt-4">
                <button
                    onClick={goToPreviousWeek}
                    // disabled={currentWeekIndex === 0}
                    className="text-s bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded-full"
                >
                    Prev
                </button>
                <div className="date-range-pill">
                    {startDate.toLocaleDateString(undefined, { weekday: 'short' })} {startDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })} - {endDate.toLocaleDateString(undefined, { weekday: 'short' })} {endDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                </div>
                <button
                    onClick={goToNextWeek}
                    className="text-s bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded-full"
                >
                    Next
                </button>
            </div>

        </div >
    );
};
// Function to calculate the start date of a specific week
const calculateStartDate = (currentWeekIndex: number): Date => {
    const currentDate = new Date(); // Current date
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - (currentWeekIndex * 7 + currentDate.getDay()));
    return startOfWeek;
};

// Function to calculate the end date of a specific week
const calculateEndDate = (currentWeekIndex: number): Date => {
    const startDate = calculateStartDate(currentWeekIndex);
    const endOfWeek = new Date(startDate);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Assuming a week has 7 days
    return endOfWeek;
};

// Function to calculate hours focused for a specific week
const calculateHoursFocusedForWeek = (pomodoros: Pomodoro[], startDate: Date, endDate: Date): number => {
    const pomodorosThisWeek = pomodoros.filter((pomodoro) => {
        const pomodoroDate = new Date(pomodoro.date);
        return pomodoroDate >= startDate && pomodoroDate <= endDate;
    });

    const hoursFocused = pomodorosThisWeek.reduce((total, pomodoro) => total + pomodoro.duration / 60, 0);
    return hoursFocused;
};

// Function to calculate days focused for a specific week
const calculateDaysFocusedForWeek = (pomodoros: Pomodoro[], startDate: Date, endDate: Date): number => {
    const daysFocused = new Set<string>();
    pomodoros.forEach((pomodoro) => {
        const pomodoroDate = new Date(pomodoro.date);
        if (pomodoroDate >= startDate && pomodoroDate <= endDate) {
            daysFocused.add(pomodoroDate.toDateString());
        }
    });

    return daysFocused.size;
};

// Function to calculate the current day streak for a specific week
const calculateCurrentDayStreakForWeek = (pomodoros: Pomodoro[], startDate: Date, endDate: Date): number => {
    const sortedPomodoros = pomodoros
        .filter((pomodoro) => {
            const pomodoroDate = new Date(pomodoro.date);
            return pomodoroDate >= startDate && pomodoroDate <= endDate;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentDate = new Date();
    let streak = 0;
    let currentStreakDate = currentDate;

    for (const pomodoro of sortedPomodoros) {
        const pomodoroDate = new Date(pomodoro.date);
        const timeDifference = currentStreakDate.getTime() - pomodoroDate.getTime();

        if (timeDifference <= 24 * 60 * 60 * 1000) {
            currentStreakDate = pomodoroDate;
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

export default Report;
