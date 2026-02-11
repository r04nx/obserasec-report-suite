import React from "react";
import ReportPage from "./ReportPage";

interface CoverPageProps {
  data?: any;
  meta?: any;
  client?: string;
  date?: string;
  assessmentId?: string;
}

const CoverPage = ({ data, meta, client, date, assessmentId }: CoverPageProps) => {
  const metaData = meta || data?.meta;
  const clientName = client || metaData?.client || "Acme Corporation Ltd.";
  const reportDate = date || metaData?.date || "11 February 2026";
  const finalAssessmentId = assessmentId || metaData?.assessmentId || "OSEC-2026-0142";

  // helper to format title date as "February 2026"
  const getTitleDate = (dateStr: string) => {
    // console.log("CoverPage received date:", dateStr); 
    if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    try {
      // Check if it's already "Month Year" format
      if (/^[A-Za-z]+ \d{4}$/.test(dateStr)) return dateStr;

      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }

      const parts = dateStr.split(' ');
      if (parts.length >= 2) return dateStr; // Return original if it looks like a date
    } catch (e) {
      console.warn("Date parse error", e);
    }
    return dateStr;
  };

  const titleDate = getTitleDate(reportDate);

  return (
    <ReportPage noPadding={true} showFooter={false} showHeader={false} showWatermark={false} meta={metaData}>
      <style>{`
        .raw-cover-page {
            width: 210mm;
            height: 297mm;
            background-image: url('${metaData?.coverUrl || "/assets/cover_bg.png"}');
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
            right: 15px;
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
          <span className="font-bold mr-1"></span> {reportDate}
        </div>

        {/* Minimal Curves - Even more subtle */}
        <svg className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.02] pointer-events-none" viewBox="0 0 500 500">
          <path d="M 500 0 C 400 50 100 150 0 500" fill="none" stroke="white" strokeWidth="1" />
        </svg>

        <div className="title-container">
          <h1 className="report-title">{clientName}</h1>
          <div className="title-date">{titleDate}</div>

          <div className="assessment-label">
            <span className="faint-text">Security</span>
            <span className="main-text">Assessment Report</span>
            <div className="accent-line"></div>
          </div>
          <div className="assessment-label" style={{ marginTop: '10px' }}>
            <span className="faint-text">Infrastructure</span>
            <span className="main-text">& Compliance</span>
            <div className="accent-line"></div>
          </div>
        </div>

        <div className="doc-id">
          ID: {finalAssessmentId}
        </div>
      </div>
    </ReportPage>
  );
};

export default CoverPage;
