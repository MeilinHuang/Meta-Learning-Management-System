import React, { useState } from 'react';

interface SettingsProps {
    pomodoroDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
    tempPomodoroDuration: number,
    tempShortBreakDuration: number,
    tempLongBreakDuration: number,
    tempLongBreakInterval: number,
    setTempPomodoroDuration: (duration: number) => void;
    setTempShortBreakDuration: (duration: number) => void;
    setTempLongBreakDuration: (duration: number) => void;
    setTempLongBreakInterval: (interval: number) => void;
    handleResetToDefault: () => void;
    handleSave: () => void;
    handleSettingsExit: () => void;
}


const Settings: React.FC<SettingsProps> = ({
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
}) => {

    return (

        <div className="settings-menu bg-white shadow-lg rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-100">
            <div className="flex flex-row gap-10">
                <h3 className="text-xl font-bold mb-2">Settings</h3>
                <button className="bg-gray-400 hover:bg-gray-600 text-white px-2 py-1 rounded-full ml-auto" onClick={handleResetToDefault}>
                    Reset to Default
                </button>
            </div>
            {[
                {
                    state: tempPomodoroDuration,
                    setState: setTempPomodoroDuration,
                    label: 'Pomodoro Duration (minutes)',
                },
                {
                    state: tempShortBreakDuration,
                    setState: setTempShortBreakDuration,
                    label: 'Short Break Duration (minutes)',
                },
                {
                    state: tempLongBreakDuration,
                    setState: setTempLongBreakDuration,
                    label: 'Long Break Duration (minutes)',
                },
            ].map((input, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <label className="font-medium">{input.label}:</label>
                    <div className="input-with-buttons flex flex-row gap-2">
                        <button
                            className="decrement-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                            onClick={() => input.setState(input.state - 60)}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className="rounded border border-gray-300 px-0 py-1 text-center"
                            value={input.state / 60}
                            onChange={(e) => input.setState(Number(e.target.value) * 60)}
                            min="0"
                            maxLength={4}
                        />
                        <button
                            className="increment-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                            onClick={() => input.setState(input.state + 60)}
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}

            {/* Normal Breaks Before Long Break */}
            <div className="flex flex-col gap-2">
                <label className="font-medium">Normal Breaks Before Long Break:</label>
                <div className="input-with-buttons flex flex-row gap-2">
                    <button
                        className="decrement-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                        onClick={() => setTempLongBreakInterval(Math.max(tempLongBreakInterval - 1, 2))}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className="rounded border border-gray-300 px-0 py-1 text-center"
                        value={tempLongBreakInterval}
                        onChange={(e) => setTempLongBreakInterval(Math.max(Number(e.target.value), 2))}
                        min="2"
                        maxLength={2}
                    />
                    <button
                        className="increment-button bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                        onClick={() => setTempLongBreakInterval(tempLongBreakInterval + 1)}
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
    );
};

export default Settings;
