import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [time, setTime] = useState(1500); // 1500 seconds = 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [intervalCount, setIntervalCount] = useState(0);
  const regularPomodoroCount = 3; // Set the number of regular pomodoros before a long break
  const regularPomodoroDuration = 1500; // 1500 seconds = 25 minutes
  const longBreakDuration = 900; // 900 seconds = 15 minutes (adjust as needed)

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      handleIntervalEnd();
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(1500);
    setIsRunning(false);
    setIsBreak(false);
  };

  const handleSkip = () => {
    if (isBreak) {
      // If it's a break, skip to the next pomodoro interval
      setIsBreak(false);
      setTime(1500);
      setIsRunning(true);
    } else {
      // If it's a pomodoro interval, skip to the next break
      setIsBreak(true); // Set it as a break
      setTime(300); // Set the time to 300 seconds (5 minutes for a break)
      setIsRunning(true);
    }
  };
  

  const handleIntervalEnd = () => {
    setIsBreak(!isBreak);
    setIsRunning(false);
    setIntervalCount((prevCount) => prevCount + 1);
  
    if (intervalCount >= regularPomodoroCount) {
      // Take a long break after the specified number of regular pomodoros
      setTimeout(() => {
        setIntervalCount(0);
        setIsBreak(true);
        setTime(longBreakDuration);
        setIsRunning(true);
      }, longBreakDuration * 1000); // Convert to milliseconds
    } else {
      if (isBreak) {
        setTime(regularPomodoroDuration);
      } else {
        setTime(300); // Set the time to 5 minutes for a short break
      }
      setIsRunning(true);
    }
  };  


  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">
        {isBreak ? 'Break Time!' : 'Pomodoro Timer'}
      </h1>
      <div className="text-6xl font-bold mb-6">{formatTime(time)}</div>
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleStart}
          >
            Start
          </button>
        ) : (
          <>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleStop}
            >
              Stop
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={handleSkip}
            >
              Skip
            </button>
          </>
        )}
        <button
          className="bg-gray-500 hover.bg-gray-600 text-white px-4 py-2 rounded"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
