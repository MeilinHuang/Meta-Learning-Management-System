import React from 'react';

interface SettingsSaveProps {
    handleSave: () => void;
    handleDiscardChanges: () => void;
}

const SettingsSaveDialog: React.FC<SettingsSaveProps> = ({ handleSave, handleDiscardChanges }) => {
    return (
        <div className="save-dialog bg-white shadow-lg rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-64">
            <h3 className="text-xl font-bold mb-2">Save Changes?</h3>
            <p className="text-gray-600">Do you want to save the changes to timer durations?</p>
            <div className="flex justify-end gap-2 mt-4">
                <div className="flex items-center gap-2">
                    <button className="bg-indigo-500 hover-bg-indigo-600 text-white px-4 py-2 rounded-full" onClick={handleSave}>
                        Save
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full" onClick={handleDiscardChanges}>
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsSaveDialog;
