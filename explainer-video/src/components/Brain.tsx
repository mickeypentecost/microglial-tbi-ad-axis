import { color } from "../theme";

// A calm, stylized side-view brain. Renders as an SVG <g>; place inside a
// scene <svg>. Local artwork is ~480×360 centered on (cx,cy), scaled by `scale`.
export const Brain: React.FC<{
  cx: number;
  cy: number;
  scale?: number;
  appear?: number;
}> = ({ cx, cy, scale = 1, appear = 1 }) => {
  // Cerebrum silhouette (facing left), hand-authored with cubic beziers.
  const outline =
    "M 150 300 " +
    "C 96 302 60 262 74 216 " +
    "C 52 188 66 142 108 132 " +
    "C 114 96 166 88 200 112 " +
    "C 228 82 292 86 314 122 " +
    "C 364 110 414 142 404 188 " +
    "C 430 214 418 258 378 268 " +
    "C 380 296 342 302 316 288 " +
    "C 308 314 286 318 278 298 " +
    "C 252 302 230 296 214 284 " +
    "C 196 300 168 304 150 300 Z";

  // Gyri — flowing internal folds.
  const gyri = [
    "M 96 210 C 150 190 150 246 208 224",
    "M 120 158 C 170 150 178 196 236 178",
    "M 200 120 C 214 160 268 150 286 190",
    "M 316 140 C 330 176 300 204 344 224",
    "M 250 232 C 300 220 320 250 366 244",
  ];

  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-240} ${-190})`} opacity={appear}>
      <defs>
        <radialGradient id="brainFill" cx="45%" cy="42%" r="65%">
          <stop offset="0%" stopColor={color.hub} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color.hub} stopOpacity={0.08} />
        </radialGradient>
      </defs>
      {/* Soft glow */}
      <ellipse cx={240} cy={200} rx={210} ry={150} fill={color.hub} opacity={0.06 * appear} />
      {/* Body */}
      <path d={outline} fill="url(#brainFill)" stroke={color.hubBright} strokeWidth={2.5} strokeLinejoin="round" opacity={0.9} />
      {/* Gyri */}
      {gyri.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color.hub} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
      ))}
      {/* Brainstem accent */}
      <path d="M 278 298 C 282 312 288 316 292 306" fill="none" stroke={color.hubBright} strokeWidth={2} opacity={0.6} />
    </g>
  );
};
