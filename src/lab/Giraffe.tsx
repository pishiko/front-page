interface GiraffeProps {
  className?: string;
}

export default function Giraffe({ className = "" }: GiraffeProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 400"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="キリンのイラスト"
    >
      {/* Left-facing silhouette, with a gently curved neck and long muzzle. */}
      <g fill="#4a2e18">
        <path d="M 111 91 L 107 57 Q 107 53 111 53 Q 115 53 115 57 L 120 90 Z" />
        <circle cx="110" cy="52" r="7" />
        <path d="M 133 89 L 137 49 Q 137 45 141 46 Q 145 46 145 50 L 142 93 Z" />
        <circle cx="142" cy="44" r="8" />
        <path d="M 113 94 C 96 92 84 79 86 66 C 103 65 117 77 120 90 Z" />
        <path d="M 144 91 C 149 73 165 65 180 69 C 177 85 164 97 147 98 Z" />
        <path d="M 81 400 C 87 331 98 250 108 181 C 111 162 108 149 99 140
                 L 62 137 C 47 136 40 128 43 118 C 45 111 53 106 65 103
                 L 94 95 C 106 81 124 79 138 88 C 151 97 154 114 153 133
                 C 151 187 161 276 180 400 Z" />
      </g>

      {/* Sparse geometric patches suggest the coat without facial details. */}
      <g fill="#ffffff">
        <path d="M 119 158 L 138 154 L 142 178 L 124 188 L 114 175 Z" />
        <path d="M 106 210 L 128 201 L 138 225 L 123 243 L 103 235 Z" />
        <path d="M 126 260 L 148 253 L 154 281 L 136 294 L 119 278 Z" />
        <path d="M 98 308 L 121 301 L 132 328 L 117 346 L 94 334 Z" />
        <path d="M 135 358 L 158 349 L 168 381 L 147 393 L 128 378 Z" />
      </g>
    </svg>
  );
}
