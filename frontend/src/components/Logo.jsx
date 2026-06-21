const Logo = ({ size = "md" }) => {
  const dims = {
    sm: { box: "h-7 w-7", text: "text-sm", rounded: "rounded-md" },
    md: { box: "h-9 w-9", text: "text-base", rounded: "rounded-lg" },
    lg: { box: "h-11 w-11", text: "text-lg", rounded: "rounded-xl" },
  };
  const d = dims[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${d.box} ${d.rounded} bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm shrink-0`}
      >
        <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7L12 3L20 7M4 7L12 11M4 7V17L12 21M20 7L12 11M20 7V17L12 21M12 11V21"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={`font-display font-semibold ${d.text} text-ink-900 tracking-tight`}>
        TrackPath
      </span>
    </div>
  );
};

export default Logo;
