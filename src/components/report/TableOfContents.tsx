import ReportPage from "./ReportPage";
import { tocSections } from "@/data/reportData";

const TableOfContents = () => {
  return (
    <ReportPage pageNum={3} sectionTitle="Table of Contents">
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-8 section-accent">
        Table of Contents
      </h2>

      <div className="space-y-1">
        {tocSections.map((s) => {
          const isMain = !s.num.includes(".");
          return (
            <div
              key={s.num}
              className={`toc-entry ${isMain ? "mt-4 first:mt-0" : "pl-6"}`}
            >
              <span
                className={`font-mono-ibm shrink-0 ${
                  isMain
                    ? "text-[hsl(var(--obsera-cyan))] font-bold text-sm"
                    : "text-muted-foreground text-xs"
                }`}
              >
                {s.num}
              </span>
              <span className="ml-3 shrink-0 text-xs">
                <span className={isMain ? "font-semibold text-sm" : "text-muted-foreground"}>
                  {s.title}
                </span>
              </span>
              <span className="toc-dots" />
              <span className="font-mono-ibm text-xs text-muted-foreground shrink-0">
                {s.page}
              </span>
            </div>
          );
        })}
      </div>
    </ReportPage>
  );
};

export default TableOfContents;
