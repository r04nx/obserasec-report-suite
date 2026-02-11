import React from "react";
import { Info } from "lucide-react";

interface EmptyStateProps {
    message?: string;
    icon?: React.ReactNode;
    height?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    message = "No data available for this section.",
    icon,
    height = "200px"
}) => {
    return (
        <div
            className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--obsera-surface-elevated))]/30 opacity-60"
            style={{ height }}
        >
            <div className="mb-3 text-[hsl(var(--obsera-cyan))] opacity-40">
                {icon || <Info size={32} />}
            </div>
            <p className="text-xs font-mono-ibm uppercase tracking-widest text-muted-foreground text-center max-w-[250px]">
                {message}
            </p>
        </div>
    );
};

export default EmptyState;
