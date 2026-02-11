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
  meta?: any;
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
  meta,
}) => {
  const metaData = meta || reportMeta;
  const [logoError, setLogoError] = React.useState(false);

  return (
    <div
      className={`a4-page page-break ${light ? "a4-page-light" : ""} ${className} relative`}
    >
      {/* ObseraSEC Logo Watermark */}
      {showWatermark && (
        <div className="watermark absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="opacity-[0.02] transform -rotate-45">
            <img
              src={metaData.watermarkUrl || "https://flem.xo.je/uploads/image_1ab47d1d.png"}
              alt="Watermark"
              className="w-[600px] grayscale"
            />
          </div>
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div className="page-header relative z-20">
          <div className="flex items-center gap-3">
            {/* Client Logo from Meta */}
            {metaData.logoUrl && !logoError && (
              <div className="flex items-center gap-2">
                <img
                  src={metaData.logoUrl}
                  alt="Client logo"
                  className="h-3 object-contain"
                  onError={() => setLogoError(true)}
                />
                <div className="h-3 w-[1px] bg-[#e5e7eb]" />
              </div>
            )}

            {/* Fixed ObseraSEC Logo & Brand */}
            <div className="flex items-center gap-2">
              <img
                src="https://flem.xo.je/uploads/image_1ab47d1d.png"
                alt="Brand Logo"
                className="h-3"
              />
              <div className="flex items-baseline gap-1">
                <span className="font-mono-ibm text-[8.5px] uppercase tracking-widest text-[#6b7280] font-bold">
                  ObseraSEC
                </span>
                <span className="font-mono-ibm text-[7.5px] uppercase tracking-widest text-[#9ca3af] font-medium text-nowrap">
                  ObseraOne
                </span>
              </div>
            </div>
          </div>
          {sectionTitle && (
            <span className="font-mono-ibm text-[8px] uppercase tracking-widest text-[#9ca3af] font-bold">
              {sectionTitle}
            </span>
          )}
        </div>
      )}

      {/* Content Area - uses padding to avoid header/footer overlap */}
      <div className={`relative z-10 ${noPadding ? "" : "pt-[25mm] px-[20mm] pb-[28mm]"} h-full`}>
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="page-footer z-20">
          <span className="font-mono-ibm text-[8px] uppercase tracking-widest">{metaData.classification || "Confidential"}</span>
          <span className="font-mono-ibm text-[8px] opacity-70">
            {metaData.assessmentId} | {metaData.subtitle}
          </span>
          {pageNum && <span className="font-mono-ibm text-[8px] font-bold">Page {pageNum}</span>}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
