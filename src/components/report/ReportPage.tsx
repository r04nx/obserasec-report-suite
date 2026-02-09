import React from "react";
import { reportMeta } from "@/data/reportData";

interface ReportPageProps {
  children: React.ReactNode;
  pageNum?: number;
  sectionTitle?: string;
  light?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showWatermark?: boolean;
  className?: string;
  noPadding?: boolean;
}

const ReportPage: React.FC<ReportPageProps> = ({
  children,
  pageNum,
  sectionTitle,
  light = true,
  showHeader = true,
  showFooter = true,
  showWatermark = true,
  className = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`a4-page page-break ${light ? "a4-page-light" : ""} ${className} relative`}
    >
      {/* ObseraSEC Logo Watermark */}
      {showWatermark && (
        <div className="watermark absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="opacity-[0.02] transform -rotate-45">
            <img
              src="https://flem.xo.je/uploads/image_1ab47d1d.png"
              alt="Watermark"
              className="w-[600px] grayscale"
            />
          </div>
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div className="page-header relative z-20">
          <div className="flex items-center gap-2">
            <img
              src="https://flem.xo.je/uploads/image_1ab47d1d.png"
              alt="ObseraSEC"
              className="h-3"
            />
            <span className="font-mono-ibm text-[8px] uppercase tracking-widest text-[#6b7280] font-semibold">
              ObseraSEC
            </span>
          </div>
          {sectionTitle && (
            <span className="font-mono-ibm text-[8px] uppercase tracking-widest text-[#9ca3af]">
              {sectionTitle}
            </span>
          )}
        </div>
      )}

      {/* Content Area - uses 15mm top margin to avoid header overlap */}
      <div className={`relative z-10 ${noPadding ? "" : "pt-[25mm] px-[20mm] pb-[20mm]"} h-full`}>
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="page-footer relative z-20">
          <span className="font-mono-ibm text-[8px] uppercase tracking-widest">Confidential</span>
          <span className="font-mono-ibm text-[8px] opacity-70">
            {reportMeta.assessmentId} | {reportMeta.subtitle}
          </span>
          {pageNum && <span className="font-mono-ibm text-[8px] font-bold">Page {pageNum}</span>}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
