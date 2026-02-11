import React from "react";
import ReportPage from "../ReportPage";

const ComplianceRBI = ({ data }: { data: any }) => {
    return (
        <ReportPage sectionTitle="RBI Master Direction - IT Governance & VAPT" light={true}>
            <div className="p-8">
                <h2 className="text-2xl font-bold">RBI VAPT Report</h2>
                <p>Template for RBI IT Governance & VAPT.</p>
            </div>
        </ReportPage>
    );
};

export default ComplianceRBI;
