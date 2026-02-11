import React from "react";
import ReportPage from "./ReportPage";

interface GenericSectionProps {
    title?: string;
    pageNum?: number;
    content?: string | Array<{ type: 'text' | 'table' | 'grid'; data: any }>;
    meta?: any;
}

const GenericSection: React.FC<GenericSectionProps> = ({ title, pageNum, content, meta }) => {
    const renderItem = (item: any, idx: number) => {
        switch (item.type) {
            case 'text':
                return (
                    <p key={idx} className="text-xs text-foreground/80 leading-relaxed mb-4 whitespace-pre-wrap">
                        {item.data}
                    </p>
                );
            case 'table':
                return (
                    <table key={idx} className="report-table mb-6 w-full">
                        {item.data.headers && (
                            <thead>
                                <tr>
                                    {item.data.headers.map((h: string, i: number) => <th key={i}>{h}</th>)}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {item.data.rows.map((row: any[], i: number) => (
                                <tr key={i}>
                                    {row.map((cell: any, j: number) => <td key={j} className="text-[10px]">{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'grid':
                return (
                    <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {Object.entries(item.data).map(([key, value]: [string, any], i: number) => (
                            <div key={i} className="p-3 rounded bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))]">
                                <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{key}</div>
                                <div className="text-sm font-bold text-[hsl(var(--obsera-cyan))]">{value}</div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ReportPage pageNum={pageNum} sectionTitle={title} meta={meta}>
            {title && (
                <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
                    {title}
                </h2>
            )}

            <div className="dynamic-content">
                {typeof content === 'string' ? (
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{content}</p>
                ) : (
                    Array.isArray(content) && content.map((item, i) => renderItem(item, i))
                )}
            </div>
        </ReportPage>
    );
};

export default GenericSection;
