import ReportPage from "./ReportPage";
import { vulnTrending } from "@/data/reportData";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const chartTooltipStyle = {
  background: "#0A1628",
  border: "1px solid hsl(190, 100%, 50%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#fff",
};

const donutColors = ["hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)"];

const VulnTrending = () => (
  <>
    <ReportPage pageNum={33} sectionTitle="Vulnerability Trending">
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
        Vulnerability Trending & Analytics
      </h2>

      {/* Discovery by Phase */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Vulnerability Discovery by Phase
      </h3>
      <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={vulnTrending.byPhase}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
            <XAxis dataKey="phase" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <YAxis tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Line type="monotone" dataKey="discovered" stroke="hsl(190, 100%, 50%)" strokeWidth={2} dot={{ fill: "hsl(190, 100%, 50%)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* By Service - Grouped Bar */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Vulnerabilities by Service Type
      </h3>
      <div className="h-56 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vulnTrending.byService}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
            <XAxis dataKey="service" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <YAxis tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="critical" fill="hsl(0, 84%, 60%)" />
            <Bar dataKey="high" fill="hsl(25, 95%, 53%)" />
            <Bar dataKey="medium" fill="hsl(45, 93%, 47%)" />
            <Bar dataKey="low" fill="hsl(142, 71%, 45%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReportPage>

    <ReportPage pageNum={34} sectionTitle="Vulnerability Trending">
      {/* Patched vs Unpatched Donut */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        Patch Status Distribution
      </h3>
      <div className="flex items-center gap-8 mb-8">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vulnTrending.patchStatus}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {vulnTrending.patchStatus.map((_, index) => (
                  <Cell key={index} fill={donutColors[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {vulnTrending.patchStatus.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded" style={{ background: donutColors[i] }} />
              <div>
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground font-mono-ibm">{s.value} systems ({((s.value / 86) * 100).toFixed(0)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Exposure Area */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        Risk Exposure Timeline
      </h3>
      <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={vulnTrending.riskExposure}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
            <XAxis dataKey="day" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <YAxis tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="exposure" stroke="hsl(190, 100%, 50%)" fill="url(#riskGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ReportPage>
  </>
);

export default VulnTrending;
