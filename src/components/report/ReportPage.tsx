import React from "react";

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
  light = false,
  showHeader = true,
  showFooter = true,
  showWatermark = true,
  className = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`a4-page page-break ${light ? "a4-page-light" : ""} ${noPadding ? "!p-0" : ""} ${className}`}
    >
      {/* Geometric decorations */}
      <div className="geo-lines" />
      <div className="geo-dots" />

      {/* Watermark */}
      {showWatermark && <div className="watermark">CONFIDENTIAL — ObseraSEC</div>}

      {/* Header */}
      {showHeader && (
        <div className="page-header">
          <div className="flex items-center gap-2">
            <img
              src="https://flem.xo.je/uploads/image_1ab47d1d.png"
              alt="ObseraSEC"
              className="h-4 opacity-60"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-mono-ibm text-[8px] uppercase tracking-wider opacity-60">
              ObseraSEC
            </span>
          </div>
          {sectionTitle && (
            <span className="font-mono-ibm text-[8px] uppercase tracking-wider opacity-60">
              {sectionTitle}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mt-6">{children}</div>

      {/* Footer */}
      {showFooter && (
        <div className="page-footer">
          <span className="font-mono-ibm">CONFIDENTIAL</span>
          <span className="font-mono-ibm">
            OSEC-2026-0142 | Network Infrastructure Security Assessment
          </span>
          {pageNum && <span className="font-mono-ibm">Page {pageNum}</span>}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
