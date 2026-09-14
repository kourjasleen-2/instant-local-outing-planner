const nodes = [
  { className: 'spiral-node-one', label: 'Indiranagar', detail: 'coffee + first turn' },
  { className: 'spiral-node-two', label: 'Church Street', detail: 'the long way' },
  { className: 'spiral-node-three', label: 'Koramangala', detail: 'stay a little longer' },
];

export default function InfiniteSpiral() {
  return (
    <figure className="spiral-art" role="img" aria-labelledby="spiral-description">
      <figcaption id="spiral-description" className="sr-only">
        A decorative route spiral connecting Bengaluru outing areas: Indiranagar, Church Street, and Koramangala.
      </figcaption>
      <svg className="spiral-svg" viewBox="0 0 540 500" aria-hidden="true">
        <defs>
          <linearGradient id="spiral-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#9EC2FF" />
          </linearGradient>
        </defs>
        <g className="spiral-orbit">
          <path className="spiral-track spiral-track-soft" d="M269 245 C 390 110, 494 190, 415 309 C 339 423, 121 426, 105 286 C 91 164, 221 83, 350 123 C 468 160, 456 337, 318 376 C 190 412, 101 300, 160 205 C 214 116, 376 128, 386 242 C 395 341, 245 375, 191 298 C 145 232, 208 169, 282 181 C 358 194, 352 293, 286 305 C 223 317, 190 255, 224 218 C 256 182, 316 204, 313 247 C 311 282, 266 289, 250 260" />
          <path className="spiral-track spiral-track-main" d="M269 245 C 390 110, 494 190, 415 309 C 339 423, 121 426, 105 286 C 91 164, 221 83, 350 123 C 468 160, 456 337, 318 376" />
          <path className="spiral-track spiral-track-accent" d="M318 376 C 190 412, 101 300, 160 205 C 214 116, 376 128, 386 242" />
          <circle className="spiral-dot spiral-dot-yellow" cx="105" cy="286" r="8" />
          <circle className="spiral-dot spiral-dot-blue" cx="386" cy="242" r="8" />
          <circle className="spiral-dot spiral-dot-white" cx="269" cy="245" r="11" />
        </g>
      </svg>
      <div className="spiral-center" aria-hidden="true">go<br /><span>somewhere good</span></div>
      {nodes.map((node) => (
        <div className={`spiral-node ${node.className}`} key={node.label}>
          <strong>{node.label}</strong>
          <small>{node.detail}</small>
        </div>
      ))}
      <span className="spiral-caption">places → movement → connection</span>
    </figure>
  );
}