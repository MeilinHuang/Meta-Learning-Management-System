import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import PomodoroService from "./PomodoroService";

interface ReportProps {
    setShowReportDialog: (show: boolean) => void;
    pomodoros: Pomodoro[];
    showReport: boolean
}

class Week {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    totalFocusTime: number;
    pomodoroSessions: { time: string, focusTimeMinutes: number }[];

    constructor(weekNumber: number, startDate: Date, endDate: Date) {
        this.weekNumber = weekNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalFocusTime = 0;
        this.pomodoroSessions = [];
    }

    addPomodoroSession(session: { time: string, focusTimeMinutes: number }) {
        this.pomodoroSessions.push(session);
        this.totalFocusTime += session.focusTimeMinutes;
    }
    getDaysFocused(): number {
        const uniqueDays = new Set<string>();
        this.pomodoroSessions.forEach((session) => {
            const sessionDate = new Date(session.time);
            if (sessionDate >= this.startDate && sessionDate <= this.endDate) {
                uniqueDays.add(sessionDate.toDateString());
            }
        });
        return uniqueDays.size;
    }


    getCurrentDayStreak(): number {
        const sortedSessions = this.pomodoroSessions
            .filter((session) => {
                const sessionDate = new Date(session.time);
                return sessionDate >= this.startDate && sessionDate <= this.endDate;
            })
            .sort((a, b) => {
                const dateA = new Date(a.time);
                const dateB = new Date(b.time);
                return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
            });

        let streak = 0;
        let currentDate = this.endDate;

        for (const session of sortedSessions) {
            const sessionDate = new Date(session.time);
            const timeDifference = currentDate.getTime() - sessionDate.getTime();
            if (timeDifference <= 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
                currentDate = sessionDate;
                streak++;
            } else {
                break;
            }
        }

        // Add 1 to include the current day in the streak
        streak++;

        return streak;
    }
    calculateDailyData(): number[] {
        // Initialize a day dictionary to store daily data
        const dailyData: { [day: number]: number } = {
            0: 0,  // Sunday
            1: 0,  // Monday
            2: 0,  // Tuesday
            3: 0,  // Wednesday
            4: 0,  // Thursday
            5: 0,  // Friday
            6: 0,  // Saturday
        };

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(this.startDate);
            dayDate.setDate(dayDate.getDate() + i);
            if (dayDate >= this.startDate && dayDate <= this.endDate) {
                const dayIndex = dayDate.getDay();
                dailyData[dayIndex] += this.totalFocusTime / 60;
            }
        }

        // Convert the dictionary to an array
        const dailyDataArray: number[] = Object.values(dailyData);

        return dailyDataArray;
    }

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
        // const hoursFocused = calculateHoursFocusedForWeek(pomodoros, start, end);
        // const daysFocused = calculateDaysFocusedForWeek(pomodoros, start, end);
        // const dayStreak = calculateCurrentDayStreakForWeek(pomodoros, start, end);

        setStartDate(start);
        setEndDate(end);
        // setHoursFocusedThisWeek(hoursFocused);
        // setDaysFocusedThisWeek(daysFocused);
        // setCurrentDayStreak(dayStreak);


    }, [currentWeekIndex, pomodoros, graphData]);

    const handlePomodoroLogs = () => {
        const token = localStorage.getItem('access_token')
        console.log(token)
        PomodoroService.getAllPomodoroLogs(token)
            .then(
                (e) => {
                    const logs = e.data.pomodoro_sessions;
                    const weeks = groupLogsIntoPastTwoWeeks(logs)
                    console.log(weeks)
                    setDaysFocusedThisWeek(weeks[currentWeekIndex].getDaysFocused())
                    setCurrentDayStreak(weeks[currentWeekIndex].getCurrentDayStreak())
                    setHoursFocusedThisWeek(weeks[currentWeekIndex].totalFocusTime / 60)
                    const updatedGraphData = weeks[currentWeekIndex].calculateDailyData()
                    setGraphData(updatedGraphData);
                }
            )
    }

    useEffect(() => {
        if (showReport) {
            handlePomodoroLogs()
        }
    }, [showReport])

    const groupLogsIntoPastTwoWeeks = (logs: { time: string; focusTimeMinutes: number }[]): Week[] => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const twoWeeksAgo = new Date(currentDate);
        twoWeeksAgo.setDate(currentDate.getDate() - 14);

        const weeks: Week[] = [];

        for (let i = 0; i < 2; i++) {
            const startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 7 * i);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            const weekNumber = -i; // Negative to represent past weeks

            const week = new Week(weekNumber, startDate, endDate);

            logs.forEach((log) => {
                const logDate = new Date(log.time);

                if (logDate >= startDate && logDate <= endDate) {
                    week.addPomodoroSession(log);
                }
            });

            weeks.push(week);
        }

        return weeks;
    }

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
                            data: graphData
                        },
                    ]}
                />
            </div>
            <div className="week-navigation flex justify-center mt-4">
                {/* <button
                    onClick={goToPreviousWeek}
                    // disabled={currentWeekIndex === 0}
                    className="text-s bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded-full"
                >
                    Prev
                </button> */}
                <div className="date-range-pill">
                    {startDate.toLocaleDateString(undefined, { weekday: 'short' })} {startDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })} - {endDate.toLocaleDateString(undefined, { weekday: 'short' })} {endDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                </div>
                {/* <button
                    onClick={goToNextWeek}
                    className="text-s bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded-full"
                >
                    Next
                </button> */}
                {/* <button
                    onClick={handlePomodoroLogs}  // Add this line to trigger the function
                    className="text-s bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded-full"
                >
                    Get Pomodoro Logs
                </button> */}
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
