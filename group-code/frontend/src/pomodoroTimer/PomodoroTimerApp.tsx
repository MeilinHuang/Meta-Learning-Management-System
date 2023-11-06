import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faChartBar, faChartColumn, faChartArea } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import './Timer.css'; // Import custom CSS for styling
import CircleRating from './CircleRating';
import Report from './Report';
import Settings from './Settings';
import SettingsSaveDialog from './SettingsSaveDialog';

type PomodoroSession = {
    time: Date;
    focusTimeMinutes: number;
};

const Timer = () => {
    // Timer durations in seconds
    const [cookies, setCookie] = useCookies(['timerSettings']);

    const [defaultSettings] = useState({
        pomodoroDuration: 25 * 60,
        shortBreakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        longBreakInterval: 3,
    })

    // Retrieve settings from cookies or use default settings
    const [pomodoroDuration, setPomodoroDuration] = useState(
        cookies.timerSettings?.pomodoroDuration || defaultSettings.pomodoroDuration
    );
    const [shortBreakDuration, setShortBreakDuration] = useState(
        cookies.timerSettings?.shortBreakDuration || defaultSettings.shortBreakDuration
    );
    const [longBreakDuration, setLongBreakDuration] = useState(
        cookies.timerSettings?.longBreakDuration || defaultSettings.longBreakDuration
    );
    const [longBreakInterval, setLongBreakInterval] = useState(cookies.timerSettings?.longBreakInterval || defaultSettings.longBreakInterval);

    const [currentTimer, setCurrentTimer] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
    const [timerCount, setTimerCount] = useState(0);
    const [skippedTimers, setSkippedTimers] = useState<string[]>([]); // Logs skipped timers

    const [time, setTime] = useState(pomodoroDuration);
    const [isRunning, setIsRunning] = useState(false);
    const [canSkip, setCanSkip] = useState(false);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempPomodoroDuration, setTempPomodoroDuration] = useState(pomodoroDuration);
    const [tempShortBreakDuration, setTempShortBreakDuration] = useState(shortBreakDuration);
    const [tempLongBreakDuration, setTempLongBreakDuration] = useState(longBreakDuration);
    const [tempLongBreakInterval, setTempLongBreakInterval] = useState(longBreakInterval);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    const [showReportDialog, setShowReportDialog] = useState(false);
    const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);



    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime: number) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            handleIntervalEnd();
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRunning, time]);

    let pomodoroSession: PomodoroSession = {
        time: new Date(), // Initialize with default values
        focusTimeMinutes: 0,
    };
    const pomodoroSkipped = false; // Initialize with false

    const handleIntervalEnd = () => {
        setIsRunning(false);
        setCanSkip(false);
        let pomodoroSkipped = false; // Initialize with false

        switch (currentTimer) {
            case 'pomodoro':
                if (timerCount < longBreakInterval) {
                    // Check if a full Pomodoro interval is completed
                    setCurrentTimer('shortBreak');
                    setTime(shortBreakDuration);
                    setTimerCount((prevCount: number) => prevCount + 1);
                } else {
                    setCurrentTimer('longBreak');
                    setTimerCount(0); // Reset the timer count when a long break starts
                    setTime(longBreakDuration);
                }

                // Log the pomodoro session
                pomodoroSession = {
                    time: pomodoroSession.time,
                    focusTimeMinutes: (pomodoroDuration - time) / 60, // Time focused in minutes
                };
                logPomodoroSession(pomodoroSession);
                // Update pomodoroSkipped based on canSkip
                pomodoroSkipped = !canSkip;

                setPomodoroSessions([...pomodoroSessions, pomodoroSession]);
                break;

            case 'shortBreak':
                setCurrentTimer('pomodoro');
                setTime(pomodoroDuration);
                break;

            case 'longBreak':
                setCurrentTimer('pomodoro');
                setTime(pomodoroDuration);
                break;

            default:
                break;
        }

        // You can now use pomodoroSkipped and pomodoroSession for logging.
    };



    const logPomodoroSession = (pomodoroSession: PomodoroSession,) => {
        const { time, focusTimeMinutes } = pomodoroSession;

        console.log('Pomodoro Session Log:');
        console.log('Start Time:', time);
        console.log('Focus Time (minutes):', focusTimeMinutes);
    };


    const logSkippedTimer = () => {
        if (canSkip) {
            const skippedTimer = `${currentTimer} skipped at: ${new Date().toLocaleString()}`;
            setSkippedTimers((prevLogs) => [...prevLogs, skippedTimer]);
        }
    };

    const handleStart = () => {
        setIsRunning(true);
        setCanSkip(true); // Enable skipping after the timer starts
    };

    const handleStop = () => {
        setIsRunning(false);
        setCanSkip(false); // Disable skipping when the timer is stopped
    };

    const handleSkip = () => {
        if (canSkip) {
            handleIntervalEnd();
        }
    };

    const handleReset = () => {
        setTime(pomodoroDuration);
        setIsRunning(false);
        setCanSkip(false);
        setCurrentTimer('pomodoro');
        setTimerCount(0);
        // setProgress(0);
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePomodoro = () => {
        setCurrentTimer('pomodoro');
        setTime(pomodoroDuration);
        setCanSkip(false);
        setIsRunning(false);
    };

    const handleShortBreak = () => {
        setCurrentTimer('shortBreak');
        setTime(shortBreakDuration);
        setCanSkip(false);
        setIsRunning(false);
    };

    const handleLongBreak = () => {
        setCurrentTimer('longBreak');
        setTime(longBreakDuration);
        setCanSkip(false);
        setIsRunning(false);
    };

    const handleCogIconClick = () => {
        setTempPomodoroDuration(pomodoroDuration);
        setTempShortBreakDuration(shortBreakDuration);
        setTempLongBreakDuration(longBreakDuration);
        setIsSettingsOpen(true);
    };

    const handleSettingsExit = () => {
        if (
            tempPomodoroDuration !== pomodoroDuration ||
            tempShortBreakDuration !== shortBreakDuration ||
            tempLongBreakDuration !== longBreakDuration ||
            tempLongBreakInterval !== longBreakInterval
        ) {
            // If changes were made, show the save dialog.
            setShowSaveDialog(true);
        } else {
            // If no changes were made, simply exit the settings.
            setIsSettingsOpen(false);
        }
    };


    const handleResetToDefault = () => {
        setTempPomodoroDuration(defaultSettings.pomodoroDuration);
        setTempShortBreakDuration(defaultSettings.shortBreakDuration);
        setTempLongBreakDuration(defaultSettings.longBreakDuration);
        setTempLongBreakInterval(defaultSettings.longBreakInterval);
    };


    const handleSave = () => {
        setPomodoroDuration(tempPomodoroDuration);
        setShortBreakDuration(tempShortBreakDuration);
        setLongBreakDuration(tempLongBreakDuration);
        setLongBreakInterval(tempLongBreakInterval);

        // Update the current timer if it's 'pomodoro' or 'shortBreak' to match the new durations
        if (currentTimer === 'pomodoro') {
            setTime(tempPomodoroDuration);
        } else if (currentTimer === 'shortBreak') {
            setTime(tempShortBreakDuration);
        } else {
            setTime(tempLongBreakDuration);
        }

        // Update the cookies with the new settings
        setCookie('timerSettings', {
            pomodoroDuration: tempPomodoroDuration,
            shortBreakDuration: tempShortBreakDuration,
            longBreakDuration: tempLongBreakDuration,
            longBreakInterval: tempLongBreakInterval,
        });

        setIsSettingsOpen(false);
        setShowSaveDialog(false);
    };

    const handleDiscardChanges = () => {
        setIsSettingsOpen(false);
        setShowSaveDialog(false);
        setTempLongBreakInterval(longBreakInterval)
        setTempLongBreakDuration(longBreakDuration)
        setTempPomodoroDuration(pomodoroDuration)
        setTempShortBreakDuration(shortBreakDuration)
    };

    const settingsConfig = {
        pomodoroDuration,
        shortBreakDuration,
        longBreakDuration,
        longBreakInterval,
        tempPomodoroDuration,
        tempShortBreakDuration,
        tempLongBreakDuration,
        tempLongBreakInterval,
        setTempPomodoroDuration,
        setTempShortBreakDuration,
        setTempLongBreakDuration,
        setTempLongBreakInterval,
        handleResetToDefault,
        handleSave,
        handleSettingsExit,
    };


    return (
        <div className="pomodoro-timer flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="pomodoro-timer flex flex-col items-center justify-center bg-gray-100 mb-4">
                <div className="buttons flex gap-4">
                    {[
                        { type: 'pomodoro', label: 'Pomodoro', onClick: handlePomodoro },
                        { type: 'shortBreak', label: 'Short Break', onClick: handleShortBreak },
                        { type: 'longBreak', label: 'Long Break', onClick: handleLongBreak },
                        { type: 'settings', label: <FontAwesomeIcon icon={faCog} />, onClick: handleCogIconClick },
                    ].map((button) => (
                        <button
                            key={button.type}
                            className={`${currentTimer === button.type ? 'bg-indigo-500' : 'bg-gray-500'} hover:bg-indigo-700 text-white px-4 py-2 rounded-full`}
                            onClick={button.onClick}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
                {currentTimer === 'pomodoro' ? 'Pomodoro Timer' : currentTimer === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </h1>
            <div className="timer text-6xl font-bold mb-3">{formatTime(time)}</div>
            <div className="mb-3">
                <CircleRating value={timerCount} total={longBreakInterval} />
            </div>
            <div className="buttons flex gap-4">
                {!isRunning ? (
                    <button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                        onClick={handleStart}
                    > Start</button>
                ) : (
                    <>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
                            onClick={handleStop}
                        >
                            Stop
                        </button>
                        <button
                            className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full ${canSkip ? '' : 'opacity-50 pointer-events-none'
                                }`}
                            onClick={handleSkip}
                            disabled={!canSkip} // Disable the button when canSkip is false
                        >
                            Skip
                        </button>
                    </>
                )}
                <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
                    onClick={handleReset}
                >
                    Reset
                </button>
                <div className='report-button'>
                    <button
                        className="bg-gray-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
                        onClick={() => { setShowReportDialog(true) }}
                    >
                        <i className="fa-solid fa-chart-simple fa-lg"></i>
                    </button>
                </div>
            </div>
            {showReportDialog && (
                <Report setShowReportDialog={setShowReportDialog} pomodoros={[]} />
            )}
            {isSettingsOpen &&
                <Settings {...settingsConfig} />
            }
            {showSaveDialog &&
                <SettingsSaveDialog
                    handleSave={handleSave}
                    handleDiscardChanges={handleDiscardChanges}
                />}
        </div>
    );
};

export default Timer;