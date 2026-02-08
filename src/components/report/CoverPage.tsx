import { reportMeta } from "@/data/reportData";

const CoverPage = () => {
  return (
    <div className="a4-page !p-0 page-break relative overflow-hidden">
      {/* Cover background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://flem.xo.je/uploads/cover-page-template_869a6c69.png)`,
        }}
      />

      {/* Fallback gradient if image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0d1f3c] to-[#061020]" style={{ zIndex: 0 }} />

      {/* Geometric overlay pattern */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00D4FF]/5 to-transparent" />
        <svg className="absolute bottom-0 left-0 w-full h-48 opacity-10" viewBox="0 0 800 200">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00D4FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="800" height="200" fill="url(#grid)" />
        </svg>
        {/* Diagonal accent lines */}
        <div className="absolute top-20 right-20 w-48 h-48">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-[1px] w-32 bg-gradient-to-r from-[#00D4FF]/40 to-transparent"
              style={{
                top: `${i * 16}px`,
                right: 0,
                transform: "rotate(-45deg)",
                transformOrigin: "right center",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full min-h-[297mm] p-16">
        {/* Logo */}
        <div className="mb-auto">
          <img
            src="https://flem.xo.je/uploads/image_1ab47d1d.png"
            alt="ObseraSEC"
            className="h-12"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.parentElement!.innerHTML = `<div class="text-2xl font-bold text-[#00D4FF] tracking-widest">ObseraSEC</div>`;
            }}
          />
          <div className="mt-1 text-[10px] font-mono-ibm text-[#00D4FF]/60 tracking-[0.3em] uppercase">
            Powered by ObseraOne
          </div>
        </div>

        {/* Title */}
        <div className="mb-auto">
          <div className="w-16 h-[3px] bg-[#00D4FF] mb-8" />
          <h1 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
            Network Infrastructure<br />
            <span className="text-[#00D4FF]">Security Assessment</span>
          </h1>
          <p className="text-lg text-white/70 font-light">{reportMeta.subtitle}</p>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="text-[#00D4FF] font-mono-ibm text-xs uppercase tracking-wider w-24">Client</span>
            <span>{reportMeta.client}</span>
          </div>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="text-[#00D4FF] font-mono-ibm text-xs uppercase tracking-wider w-24">Date</span>
            <span>{reportMeta.date}</span>
          </div>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="text-[#00D4FF] font-mono-ibm text-xs uppercase tracking-wider w-24">Report ID</span>
            <span className="font-mono-ibm">{reportMeta.assessmentId}</span>
          </div>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="text-[#00D4FF] font-mono-ibm text-xs uppercase tracking-wider w-24">Version</span>
            <span>{reportMeta.version}</span>
          </div>

          {/* Classification badge */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#FF4444]/40 bg-[#FF4444]/10 rounded">
              <div className="w-2 h-2 rounded-full bg-[#FF4444] animate-pulse" />
              <span className="text-[#FF4444] font-mono-ibm text-xs tracking-wider uppercase">
                {reportMeta.classification}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;
