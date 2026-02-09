import React from "react";
// import { reportMeta } from "@/data/reportData";

const reportMeta = {
  client: "Acme Corporation Ltd.",
  date: "9 February, 2026",
  assessmentId: "OSEC-2026-0142",
};

const CoverPage = () => {
  // Debug log to check if reportMeta is available
  console.log("CoverPage rendering. reportMeta:", reportMeta);

  if (!reportMeta) {
    console.error("reportMeta is undefined or null!");
    return <div className="text-red-500">Error: reportMeta missing</div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;600&display=swap');

        .raw-cover-page {
            width: 210mm;
            height: 297mm;
            background-image: url('/assets/cover_bg.png');
            background-size: cover;
            background-position: center;
            position: relative;
            overflow: hidden;
            margin: 0; 
            padding: 0;
            display: flex;
            justify-content: center;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .issued-in {
            position: absolute;
            top: 123px;
            right: 20px;
            text-align: right;
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            font-size: 14pt;
            color: rgba(0, 0, 0, 0.4);
            z-index: 20;
        }

        .title-container {
            position: absolute;
            top: 270px;
            left: 50px;
            width: 90%;
            z-index: 20;
            text-align: left;
        }

        .report-title {
            font-family: Arial, sans-serif;
            font-size: 51pt;
            font-weight: bold;
            color: #ffffff;
            line-height: 1;
            margin: 0;
            letter-spacing: -1.5px;
            /* Template HTML does not force uppercase, but Title Case. 
               However, to match the visual provided in the template HTML (which has Title Case text), 
               we will render the client name as is. */
        }

        .title-date {
            font-family: Arial, sans-serif;
            font-size: 48pt;
            font-weight: bold;
            color: #44AC96;
            margin-top: 10px;
            letter-spacing: -1px;
        }

        .assessment-label {
            margin-top: 30px;
            display: flex;
            align-items: flex-end;
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            text-transform: uppercase;
            font-size: 13pt;
            letter-spacing: 1px;
            line-height: 1;
        }

        .faint-text {
            color: rgba(255, 255, 255, 0.4);
            margin-right: 8px;
        }

        .main-text {
            color: #ffffff;
        }

        .accent-line {
            height: 2px;
            background: #44AC96;
            flex-grow: 1;
            margin-left: 6px;
            max-width: 120px;
            margin-bottom: 3px;
        }

        .doc-id {
            position: absolute;
            bottom: 40px;
            right: 65px;
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            font-size: 10pt;
            color: #6b7280;
            opacity: 0.8;
            z-index: 20;
        }
      `}</style>

      <div className="raw-cover-page page-break">
        <div className="issued-in">
          <span className="issued-label"></span> {reportMeta.date}
        </div>

        {/* Minimal Curves - Even more subtle */}
        <svg className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.02] pointer-events-none" viewBox="0 0 500 500">
          <path d="M 500 0 C 400 50 100 150 0 500" fill="none" stroke="white" strokeWidth="1" />
        </svg>


        <div className="title-container">
          <h1 className="report-title">{reportMeta.client}</h1>
          <div className="title-date">{reportMeta.date}</div>

          <div className="assessment-label">
            <span className="faint-text">Security</span>
            <span className="main-text">Assessment Report</span>
            <div className="accent-line"></div>
          </div>
          <div className="assessment-label" style={{ marginTop: '10px' }}>
            <span className="faint-text">DPDP</span>
            <span className="main-text">Compliance Report</span>
            <div className="accent-line"></div>
          </div>
        </div>

        <div className="doc-id">
          ID: {reportMeta.assessmentId}
        </div>
      </div>
    </>
  );
};

export default CoverPage;
