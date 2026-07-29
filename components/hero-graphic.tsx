export function HeroGraphic() {
  return (
    <aside className="hero-graphic" aria-label="A visual map of Labish's work">
      <div className="graphic-bar">
        <span>LABISH.SYS</span>
        <span className="graphic-live">● LIVE</span>
      </div>
      <div className="graphic-canvas">
        <svg viewBox="0 0 540 390" role="img" aria-labelledby="signal-map-title">
          <title id="signal-map-title">A signal map connecting curiosity, code, research, and care.</title>
          <defs>
            <pattern id="grid" width="27" height="27" patternUnits="userSpaceOnUse">
              <path d="M 27 0 L 0 0 0 27" fill="none" stroke="currentColor" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="540" height="390" fill="url(#grid)" className="signal-grid" />
          <path className="signal-path signal-path-main" d="M78 263 C130 176, 190 216, 238 148 S352 84, 416 145 S457 239, 488 97" />
          <path className="signal-path signal-path-dashed" d="M78 263 C162 328, 256 300, 340 260 S429 196, 488 97" />
          <circle className="signal-node signal-node-mint" cx="78" cy="263" r="13" />
          <circle className="signal-node signal-node-violet" cx="238" cy="148" r="15" />
          <circle className="signal-node signal-node-ink" cx="416" cy="145" r="13" />
          <circle className="signal-node signal-node-mint" cx="488" cy="97" r="18" />
          <circle className="signal-node signal-node-ink" cx="340" cy="260" r="10" />
        </svg>
        <span className="signal-label label-curiosity">CURIOSITY</span>
        <span className="signal-label label-research">RESEARCH</span>
        <span className="signal-label label-care">CARE</span>
        <span className="signal-label label-code">CODE</span>
      </div>
      <div className="graphic-footer">
        <span>signal map / in progress</span>
        <span>01—04</span>
      </div>
    </aside>
  );
}
