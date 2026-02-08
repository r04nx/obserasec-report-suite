const BackCover = () => (
  <div className="a4-page !p-0 page-break relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0d1f3c] to-[#061020]" />

    {/* Geometric pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 800 1130">
      <defs>
        <pattern id="backGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00D4FF" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="800" height="1130" fill="url(#backGrid)" />
    </svg>

    {/* Diagonal accent */}
    <div className="absolute bottom-0 right-0 w-64 h-64">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute h-[1px] w-48 bg-gradient-to-r from-transparent to-[#00D4FF]/20"
          style={{
            bottom: `${i * 20}px`,
            right: 0,
            transform: "rotate(-45deg)",
            transformOrigin: "right center",
          }}
        />
      ))}
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[297mm] text-center px-16">
      <img
        src="https://flem.xo.je/uploads/image_1ab47d1d.png"
        alt="ObseraSEC"
        className="h-16 mb-4"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          el.style.display = "none";
          el.parentElement!.insertAdjacentHTML("afterbegin", `<div class="text-3xl font-bold text-[#00D4FF] tracking-widest mb-4">ObseraSEC</div>`);
        }}
      />
      <div className="text-[10px] font-mono-ibm text-[#00D4FF]/60 tracking-[0.3em] uppercase mb-12">
        Powered by ObseraOne
      </div>

      <div className="w-16 h-[2px] bg-[#00D4FF]/30 mb-12" />

      <div className="space-y-3 text-sm text-white/60">
        <p>ObseraSEC Security Solutions Pvt. Ltd.</p>
        <p className="font-mono-ibm text-[#00D4FF]">info@observasec.com</p>
        <p className="font-mono-ibm text-[#00D4FF]">www.observasec.com</p>
        <p className="text-xs text-white/40 mt-6">
          Bengaluru, India | Dubai, UAE
        </p>
      </div>

      <div className="w-16 h-[2px] bg-[#00D4FF]/30 my-12" />

      <div className="border border-white/10 rounded-lg px-6 py-3">
        <p className="text-[9px] text-white/40 font-mono-ibm">
          This document is the confidential property of ObseraSEC.<br />
          Unauthorized reproduction or distribution is strictly prohibited.
        </p>
      </div>

      <div className="absolute bottom-8 text-[8px] text-white/20 font-mono-ibm">
        © 2026 ObseraSEC. All rights reserved. | Document ID: OSEC-2026-0142
      </div>
    </div>
  </div>
);

export default BackCover;
