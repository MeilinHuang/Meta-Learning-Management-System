import React from "react";

interface ReportProps {
    setShowReportDialog: (show: boolean) => void;
}

const Report: React.FC<ReportProps> = ({ setShowReportDialog }) => {
    return (
        <div className="report-dialog bg-white shadow-lg rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-64">
            <p>Report Analytics Content</p>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full" onClick={() => setShowReportDialog(false)} >
                Exit
            </button >
        </div>
    );
};

export default Report;