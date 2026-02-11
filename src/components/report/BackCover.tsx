import React from "react";
const BackCover = ({ meta }: { meta?: any }) => {
  const metaData = meta || { assessmentId: "OSEC-2026-0142" };

  return (
    <>
      <style>{`
        .raw-back-page {
            width: 210mm;
            height: 297mm;
            background-image: url('${metaData.coverUrl || '/assets/cover_bg.png'}');
            background-size: cover;
            background-position: center;
            position: relative;
            overflow: hidden;
            margin: 0; 
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            page-break-before: always;
        }

        .back-content {
            position: relative;
            z-index: 20;
            text-align: center;
            width: 80%;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(4px);
            padding: 40px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .back-logo {
            height: 64px;
            margin-bottom: 24px;
            filter: invert(1) brightness(2); /* Invert to make the black logo white */
        }

        .back-powered {
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            font-size: 10pt;
            color: rgba(255, 255, 255, 0.6);
            letter-spacing: 0.3em;
            text-transform: uppercase;
            margin-bottom: 48px;
        }

        .back-accent {
            width: 64px;
            height: 2px;
            background: #44AC96;
            margin: 0 auto 48px;
        }

        .back-contact {
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            font-size: 12pt;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.8;
            margin-bottom: 48px;
        }

        .back-contact p {
            margin: 8px 0;
        }

        .back-legal {
            padding: 12px 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            font-size: 9pt;
            color: rgba(255, 255, 255, 0.5);
            max-width: 400px;
            margin: 0 auto;
        }

        .back-copyright {
            position: absolute;
            bottom: 40px;
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            font-size: 8pt;
            color: rgba(255, 255, 255, 0.3);
            text-align: center;
            width: 100%;
        }
      `}</style>

      <div className="raw-back-page page-break">
        <div className="back-content">
          <img
            src="https://flem.xo.je/uploads/image_1ab47d1d.png"
            alt="ObseraSEC"
            className="back-logo m-auto"
          />
          <div className="back-powered">
            Powered by ObseraSEC
          </div>

          <div className="back-accent" />

          <div className="back-contact text-white">
            <p className="font-bold text-xl mb-2">{metaData.company || "ObseraSEC"}</p>
            <p className="text-[#44AC96] text-sm">info@obserasec.com</p>
            <p className="text-[#44AC96] text-sm">www.obserasec.com</p>
            <p className="text-[10pt] opacity-60 mt-4 font-normal">
              Mumbai, India
            </p>
          </div>

          <div className="back-legal">
            <p>
              This document is the confidential property of ObseraSEC.<br />
              Unauthorized reproduction or distribution is strictly prohibited.
            </p>
          </div>
        </div>

        <div className="back-copyright">
          © {new Date().getFullYear()} ObseraSEC. All rights reserved. | Document ID: {metaData.assessmentId}
        </div>
      </div>
    </>
  );
};

export default BackCover;
