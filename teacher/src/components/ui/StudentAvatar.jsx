const PALETTES = [
  { bg: '#7c3aed', face: '#a78bfa', accent: '#c4b5fd', dark: '#4c1d95' },
  { bg: '#2563eb', face: '#60a5fa', accent: '#93c5fd', dark: '#1e3a8a' },
  { bg: '#059669', face: '#34d399', accent: '#6ee7b7', dark: '#064e3b' },
  { bg: '#dc2626', face: '#f87171', accent: '#fca5a5', dark: '#7f1d1d' },
  { bg: '#d97706', face: '#fbbf24', accent: '#fde68a', dark: '#78350f' },
  { bg: '#db2777', face: '#f472b6', accent: '#fbcfe8', dark: '#831843' },
  { bg: '#0891b2', face: '#22d3ee', accent: '#a5f3fc', dark: '#164e63' },
  { bg: '#7c3aed', face: '#c084fc', accent: '#e9d5ff', dark: '#3b0764' },
]

const ANIMALS = [
  ({ p }) => (
    <g>
      <polygon points="14,18 22,4 30,18" fill={p.bg} />
      <polygon points="34,18 42,4 50,18" fill={p.bg} />
      <polygon points="16,18 22,8 28,18" fill={p.accent} />
      <polygon points="36,18 42,8 48,18" fill={p.accent} />
      <ellipse cx="32" cy="36" rx="20" ry="18" fill={p.face} />
      <ellipse cx="32" cy="42" rx="9" ry="6" fill={p.accent} />
      <ellipse cx="32" cy="39" rx="3" ry="2" fill={p.dark} />
      <ellipse cx="24" cy="32" rx="3.5" ry="4" fill={p.dark} />
      <ellipse cx="40" cy="32" rx="3.5" ry="4" fill={p.dark} />
      <circle cx="25.5" cy="31" r="1.2" fill="white" />
      <circle cx="41.5" cy="31" r="1.2" fill="white" />
    </g>
  ),
  ({ p }) => (
    <g>
      <circle cx="18" cy="16" r="9" fill={p.bg} />
      <circle cx="46" cy="16" r="9" fill={p.bg} />
      <circle cx="18" cy="16" r="5" fill={p.accent} />
      <circle cx="46" cy="16" r="5" fill={p.accent} />
      <ellipse cx="32" cy="36" rx="20" ry="18" fill={p.face} />
      <ellipse cx="32" cy="43" rx="8" ry="5" fill={p.accent} />
      <ellipse cx="32" cy="40" rx="2.5" ry="1.8" fill={p.dark} />
      <ellipse cx="24" cy="32" rx="3" ry="4" fill={p.dark} />
      <ellipse cx="40" cy="32" rx="3" ry="4" fill={p.dark} />
      <circle cx="25" cy="30.5" r="1.2" fill="white" />
      <circle cx="41" cy="30.5" r="1.2" fill="white" />
      <line x1="14" y1="41" x2="26" y2="42" stroke={p.dark} strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="44" x2="26" y2="44" stroke={p.dark} strokeWidth="1" opacity="0.5" />
      <line x1="38" y1="42" x2="50" y2="41" stroke={p.dark} strokeWidth="1" opacity="0.5" />
      <line x1="38" y1="44" x2="50" y2="44" stroke={p.dark} strokeWidth="1" opacity="0.5" />
    </g>
  ),
  ({ p }) => (
    <g>
      <circle cx="16" cy="18" r="10" fill={p.bg} />
      <circle cx="48" cy="18" r="10" fill={p.bg} />
      <circle cx="16" cy="18" r="6" fill={p.accent} />
      <circle cx="48" cy="18" r="6" fill={p.accent} />
      <ellipse cx="32" cy="37" rx="21" ry="19" fill={p.face} />
      <ellipse cx="32" cy="44" rx="10" ry="7" fill={p.accent} />
      <ellipse cx="32" cy="41" rx="3" ry="2.5" fill={p.dark} />
      <ellipse cx="23" cy="32" rx="4" ry="4.5" fill={p.dark} />
      <ellipse cx="41" cy="32" rx="4" ry="4.5" fill={p.dark} />
      <circle cx="24.5" cy="30.5" r="1.5" fill="white" />
      <circle cx="42.5" cy="30.5" r="1.5" fill="white" />
    </g>
  ),
  ({ p }) => (
    <g>
      <ellipse cx="22" cy="12" rx="6" ry="14" fill={p.bg} />
      <ellipse cx="42" cy="12" rx="6" ry="14" fill={p.bg} />
      <ellipse cx="22" cy="12" rx="3.5" ry="11" fill={p.accent} />
      <ellipse cx="42" cy="12" rx="3.5" ry="11" fill={p.accent} />
      <ellipse cx="32" cy="37" rx="19" ry="18" fill={p.face} />
      <ellipse cx="32" cy="43" rx="7" ry="5" fill={p.accent} />
      <circle cx="32" cy="40" r="2.5" fill={p.dark} />
      <ellipse cx="24" cy="32" rx="3" ry="3.5" fill={p.dark} />
      <ellipse cx="40" cy="32" rx="3" ry="3.5" fill={p.dark} />
      <circle cx="25" cy="31" r="1.2" fill="white" />
      <circle cx="41" cy="31" r="1.2" fill="white" />
    </g>
  ),
  ({ p }) => (
    <g>
      <polygon points="24,14 28,4 32,14" fill={p.bg} />
      <polygon points="32,14 36,4 40,14" fill={p.bg} />
      <ellipse cx="32" cy="36" rx="20" ry="19" fill={p.face} />
      <circle cx="24" cy="32" r="7" fill={p.accent} />
      <circle cx="40" cy="32" r="7" fill={p.accent} />
      <circle cx="24" cy="32" r="5" fill={p.dark} />
      <circle cx="40" cy="32" r="5" fill={p.dark} />
      <circle cx="25.5" cy="30.5" r="1.8" fill="white" />
      <circle cx="41.5" cy="30.5" r="1.8" fill="white" />
      <polygon points="29,40 32,46 35,40" fill={p.bg} />
    </g>
  ),
  ({ p }) => (
    <g>
      <circle cx="16" cy="18" r="10" fill={p.bg} />
      <circle cx="48" cy="18" r="10" fill={p.bg} />
      <ellipse cx="32" cy="37" rx="21" ry="19" fill={p.face} />
      <ellipse cx="23" cy="32" rx="7" ry="6" fill={p.dark} />
      <ellipse cx="41" cy="32" rx="7" ry="6" fill={p.dark} />
      <ellipse cx="23" cy="32" rx="3.5" ry="3.5" fill={p.bg} />
      <ellipse cx="41" cy="32" rx="3.5" ry="3.5" fill={p.bg} />
      <circle cx="23" cy="32" r="2" fill={p.dark} />
      <circle cx="41" cy="32" r="2" fill={p.dark} />
      <circle cx="24" cy="31" r="0.9" fill="white" />
      <circle cx="42" cy="31" r="0.9" fill="white" />
      <ellipse cx="32" cy="44" rx="8" ry="5" fill={p.accent} />
      <circle cx="32" cy="41" r="2.5" fill={p.dark} />
    </g>
  ),
  ({ p }) => (
    <g>
      <circle cx="20" cy="18" r="9" fill={p.face} />
      <circle cx="44" cy="18" r="9" fill={p.face} />
      <circle cx="20" cy="18" r="6" fill={p.dark} />
      <circle cx="44" cy="18" r="6" fill={p.dark} />
      <circle cx="21.5" cy="16.5" r="2" fill="white" />
      <circle cx="45.5" cy="16.5" r="2" fill="white" />
      <ellipse cx="32" cy="38" rx="21" ry="17" fill={p.face} />
      <path d="M22 44 Q32 52 42 44" stroke={p.dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="44" rx="9" ry="5" fill={p.accent} opacity="0.5" />
    </g>
  ),
  ({ p }) => (
    <g>
      <ellipse cx="13" cy="30" rx="8" ry="14" fill={p.bg} />
      <ellipse cx="51" cy="30" rx="8" ry="14" fill={p.bg} />
      <ellipse cx="32" cy="36" rx="20" ry="18" fill={p.face} />
      <ellipse cx="32" cy="43" rx="9" ry="6" fill={p.accent} />
      <ellipse cx="32" cy="40" rx="3" ry="2.2" fill={p.dark} />
      <ellipse cx="24" cy="31" rx="3.5" ry="4" fill={p.dark} />
      <ellipse cx="40" cy="31" rx="3.5" ry="4" fill={p.dark} />
      <circle cx="25.5" cy="29.5" r="1.3" fill="white" />
      <circle cx="41.5" cy="29.5" r="1.3" fill="white" />
    </g>
  ),
]

function seed(name) {
  return [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

const SIZES = {
  sm: { box: 'w-9 h-9',   px: 36 },
  md: { box: 'w-11 h-11', px: 44 },
  lg: { box: 'w-14 h-14', px: 56 },
}

export default function StudentAvatar({ name = '?', size = 'md' }) {
  const s      = seed(name)
  const p      = PALETTES[s % PALETTES.length]
  const Animal = ANIMALS[s % ANIMALS.length]
  const { box, px } = SIZES[size] ?? SIZES.md

  return (
    <div className={`${box} rounded-full shrink-0 overflow-hidden`}
      style={{ background: p.bg, boxShadow: `0 0 0 2px ${p.accent}` }}>
      <svg viewBox="0 0 64 64" width={px} height={px} xmlns="http://www.w3.org/2000/svg">
        <Animal p={p} />
      </svg>
    </div>
  )
}
