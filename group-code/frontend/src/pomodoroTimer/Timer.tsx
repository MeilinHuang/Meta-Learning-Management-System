import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import './Timer.css'; // Import custom CSS for styling

const Timer = () => {
    // Timer durations in seconds
    const [pomodoroDuration, setPomodoroDuration] = useState(5); // 25 minutes
    const [shortBreakDuration, setShortBreakDuration] = useState(5); // 5 minutes
    const [longBreakDuration, setLongBreakDuration] = useState(5); // 10 minutes

    const [currentTimer, setCurrentTimer] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
    const [timerCount, setTimerCount] = useState(0); // Number of completed intervals
    const [skippedTimers, setSkippedTimers] = useState<string[]>([]); // Logs skipped timers

    const [time, setTime] = useState(pomodoroDuration);
    const [isRunning, setIsRunning] = useState(false);
    const [canSkip, setCanSkip] = useState(false);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempPomodoroDuration, setTempPomodoroDuration] = useState(pomodoroDuration);
    const [tempShortBreakDuration, setTempShortBreakDuration] = useState(shortBreakDuration);
    const [tempLongBreakDuration, setTempLongBreakDuration] = useState(longBreakDuration);
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            handleIntervalEnd();
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRunning, time]);

    const handleIntervalEnd = () => {
        setIsRunning(false);
        setCanSkip(false);

        switch (currentTimer) {
            case 'pomodoro':
                if (timerCount < 3) {
                    setCurrentTimer('shortBreak');
                    setTime(shortBreakDuration);
                } else {
                    setCurrentTimer('longBreak');
                    setTimerCount(0);
                    setTime(longBreakDuration);
                }
                break;
            case 'shortBreak':
                setCurrentTimer('pomodoro');
                setTimerCount((prevCount) => prevCount + 1);
                setTime(pomodoroDuration);
                break;
            case 'longBreak':
                setCurrentTimer('pomodoro');
                setTimerCount((prevCount) => prevCount + 1);
                setTime(pomodoroDuration);
                break;
            default:
                break;
        }

        logSkippedTimer();
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
        if (tempPomodoroDuration !== pomodoroDuration || tempShortBreakDuration !== shortBreakDuration || tempLongBreakDuration !== longBreakDuration) {
            setShowSaveDialog(true);
        } else {
            setIsSettingsOpen(false);
        }
    };

    const handleResetToDefault = () => {
        setTempPomodoroDuration(25 * 60);
        setTempShortBreakDuration(5 * 60);
        setTempLongBreakDuration(15 * 60);
    };

    const handleSave = () => {
        setPomodoroDuration(tempPomodoroDuration);
        setShortBreakDuration(tempShortBreakDuration);
        setLongBreakDuration(tempLongBreakDuration);

        // Update the current timer if it's 'pomodoro' or 'shortBreak' to match the new durations
        if (currentTimer === 'pomodoro') {
            setTime(tempPomodoroDuration);
        } else if (currentTimer === 'shortBreak') {
            setTime(tempShortBreakDuration);
        } else {
            setTime(tempLongBreakDuration);
        }

        setIsSettingsOpen(false);
        setShowSaveDialog(false);
    };

    const handleDiscardChanges = () => {
        setIsSettingsOpen(false);
        setShowSaveDialog(false);
    };

    return (
        <div className="pomodoro-timer flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="pomodoro-timer flex flex-col items-center justify-center bg-gray-100 mb-4">
                <div className="buttons flex gap-4">
                    <button
                        className={`${currentTimer === 'pomodoro'
                            ? 'bg-indigo-500'
                            : 'bg-gray-500'
                            } hover:bg-indigo-700 text-white px-4 py-2 rounded-full`}
                        onClick={handlePomodoro}
                    >
                        Pomodoro
                    </button>
                    <button
                        className={`${currentTimer === 'shortBreak'
                            ? 'bg-indigo-500'
                            : 'bg-gray-500'
                            } hover:bg-indigo-700 text-white px-4 py-2 rounded-full`}
                        onClick={handleShortBreak}
                    >
                        Short Break
                    </button>
                    <button
                        className={`${currentTimer === 'longBreak'
                            ? 'bg-indigo-500'
                            : 'bg-gray-500'
                            } hover:bg-indigo-700 text-white px-4 py-2 rounded-full`}
                        onClick={handleLongBreak}
                    >
                        Long Break
                    </button>
                    <div className='Settings'>
                        <button
                            className={`${currentTimer === 'settings'
                                ? 'bg-indigo-500'
                                : 'bg-indigo-700'
                                } hover:bg-indigo-700 text-white px-4 py-2 rounded-full`}
                            onClick={handleCogIconClick}
                        >
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    </div>
                </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
                {currentTimer === 'pomodoro' ? 'Pomodoro Timer' : currentTimer === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </h1>
            <div className="timer text-6xl font-bold mb-6">{formatTime(time)}</div>
            <div className="buttons flex gap-4">
                {!isRunning ? (
                    <button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                        onClick={handleStart}
                    >
                        Start
                    </button>
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
            </div>
            {isSettingsOpen && (
                <div className="settings-menu bg-white shadow-lg rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-100">
                    <div className="flex flex-row gap-10">
                        <h3 className="text-xl font-bold mb-2">Settings</h3>
                        <button className="bg-gray-400 hover:bg-gray-600 text-white px-2 py-1 rounded-full ml-auto" onClick={handleResetToDefault}>
                            Reset to Default
                        </button>
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Pomodoro Duration (minutes):</label>
                        <div className="input-with-buttons flex flex-row gap-2">
                            <button
                                className="decrement-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                                onClick={() => setTempPomodoroDuration(Math.max(tempPomodoroDuration - 60, 0))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="rounded border border-gray-300 px-0 py-1 text-center"
                                value={tempPomodoroDuration / 60}
                                onChange={(e) => setTempPomodoroDuration(Math.max(Number(e.target.value) * 60, 0))}
                                min="0"
                                maxLength={4}
                            />
                            <button
                                className="increment-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                                onClick={() => setTempPomodoroDuration(tempPomodoroDuration + 60)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Short Break Duration (minutes):</label>
                        <div className="input-with-buttons flex flex-row gap-2">
                            <button
                                className="decrement-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                                onClick={() => setTempShortBreakDuration(Math.max(tempShortBreakDuration - 60, 0))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="rounded border border-gray-300 px-0 py-1 text-center"
                                value={tempShortBreakDuration / 60}
                                onChange={(e) => setTempShortBreakDuration(Math.max(Number(e.target.value) * 60, 0))}
                                min="0"
                                maxLength={4}
                            />
                            <button
                                className="increment-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                                onClick={() => setTempShortBreakDuration(tempShortBreakDuration + 60)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Long Break Duration (minutes):</label>
                        <div className="input-with-buttons flex flex-row gap-2">
                            <button
                                className="decrement-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                                onClick={() => setTempLongBreakDuration(Math.max(tempLongBreakDuration - 60, 0))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="rounded border border-gray-300 px-0 py-1 text-center"
                                value={tempLongBreakDuration / 60}
                                onChange={(e) => setTempLongBreakDuration(Math.max(Number(e.target.value) * 60, 0))}
                                min="0"
                                maxLength={4}
                            />
                            <button
                                className="increment-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                                onClick={() => setTempLongBreakDuration(tempLongBreakDuration + 60)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-1">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full" onClick={handleSave}>
                            Save
                        </button>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full" onClick={handleSettingsExit}>
                            Exit
                        </button>
                    </div>
                </div>
            )}

            {showSaveDialog && (
                <div className="save-dialog bg-white shadow-lg rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-64">
                    <h3 className="text-xl font-bold mb-2">Save Changes?</h3>
                    <p className="text-gray-600">Do you want to save the changes to timer durations?</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <div className="flex items-center gap-2">
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full" onClick={handleSave}>
                                Save
                            </button>
                            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full" onClick={handleDiscardChanges}>
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timer;