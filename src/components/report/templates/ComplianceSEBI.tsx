import React from "react";
import ReportPage from "../ReportPage";

const ComplianceSEBI = ({ data }: { data: any }) => {
    return (
        <ReportPage sectionTitle="SEBI Cyber Security & Cyber Resilience Framework (CSCRF)" light={true}>
            <div className="p-8">
                <h2 className="text-2xl font-bold">SEBI CSCRF Report</h2>
                <p>Template for SEBI Cyber Audit Report (CAR).</p>
            </div>
        </ReportPage>
    );
};

export default ComplianceSEBI;
