import React from 'react';
import { SubjectDefinition } from '../data/curriculum';

interface SubjectVisual3DProps {
  theme: SubjectDefinition['visualTheme'];
  size?: 'sm' | 'lg';
}

export const SubjectVisual3D: React.FC<SubjectVisual3DProps> = ({
  theme,
  size = 'sm',
}) => {
  const dimensions =
    size === 'lg' ? 'w-44 h-44 sm:w-52 sm:h-52' : 'w-14 h-14';

  const renderGraphic = () => {
    switch (theme) {
      case 'python':
        return (
          <g>
            <rect x="20" y="24" width="80" height="72" rx="14" stroke="#8DBBFF" strokeWidth="2.5" fill="rgba(141,187,255,0.08)" />
            <path d="M44 48 L32 60 L44 72" stroke="#8DBBFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M76 48 L88 60 L76 72" stroke="#C4ACFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="65" y1="42" x2="55" y2="78" stroke="#F1F5FF" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'mathematics':
        return (
          <g>
            <circle cx="60" cy="60" r="38" stroke="rgba(141,187,255,0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M22 76 Q46 20 60 60 T98 44" stroke="#8DBBFF" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M36 32 L36 88 M24 80 L96 80" stroke="#C4ACFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="60" r="5" fill="#C4ACFF" />
          </g>
        );
      case 'eee':
        return (
          <g>
            <circle cx="60" cy="60" r="36" stroke="#8DBBFF" strokeWidth="2.2" fill="rgba(141,187,255,0.08)" />
            <path d="M64 32 L46 62 H62 L56 88 L76 56 H60 L64 32 Z" stroke="#C4ACFF" strokeWidth="2.4" fill="rgba(196,172,255,0.22)" strokeLinejoin="round" />
          </g>
        );
      case 'mechanical':
        return (
          <g>
            <circle cx="52" cy="64" r="22" stroke="#8DBBFF" strokeWidth="3" strokeDasharray="8 5" />
            <circle cx="52" cy="64" r="9" stroke="#F1F5FF" strokeWidth="2.2" />
            <circle cx="82" cy="40" r="14" stroke="#C4ACFF" strokeWidth="2.8" strokeDasharray="6 4" />
            <circle cx="82" cy="40" r="5" fill="#C4ACFF" />
          </g>
        );
      case 'physics':
        return (
          <g>
            <ellipse cx="60" cy="60" rx="40" ry="15" transform="rotate(30 60 60)" stroke="#8DBBFF" strokeWidth="2.2" />
            <ellipse cx="60" cy="60" rx="40" ry="15" transform="rotate(-30 60 60)" stroke="#C4ACFF" strokeWidth="2.2" />
            <ellipse cx="60" cy="60" rx="15" ry="40" stroke="rgba(141,187,255,0.5)" strokeWidth="1.6" />
            <circle cx="60" cy="60" r="7" fill="#8DBBFF" />
          </g>
        );
      case 'environmental':
        return (
          <g>
            <circle cx="60" cy="60" r="34" stroke="#8DBBFF" strokeWidth="2.2" fill="rgba(141,187,255,0.06)" />
            <path d="M40 74 C40 46 68 34 84 36 C84 58 68 78 40 74 Z" stroke="#C4ACFF" strokeWidth="2.5" fill="rgba(196,172,255,0.16)" />
            <path d="M40 74 L70 48" stroke="#8DBBFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'epd':
        return (
          <g>
            <polygon points="60,22 92,40 92,78 60,96 28,78 28,40" stroke="#8DBBFF" strokeWidth="2.5" fill="rgba(141,187,255,0.08)" />
            <polyline points="28,40 60,58 92,40" stroke="#C4ACFF" strokeWidth="2.2" fill="none" />
            <line x1="60" y1="58" x2="60" y2="96" stroke="#C4ACFF" strokeWidth="2.2" />
          </g>
        );
      case 'mechanics':
        return (
          <g>
            <polygon points="24,84 60,28 96,84" stroke="#8DBBFF" strokeWidth="2.5" fill="rgba(141,187,255,0.08)" />
            <line x1="60" y1="28" x2="44" y2="84" stroke="#C4ACFF" strokeWidth="1.8" />
            <line x1="60" y1="28" x2="76" y2="84" stroke="#C4ACFF" strokeWidth="1.8" />
            <circle cx="60" cy="28" r="4" fill="#8DBBFF" />
          </g>
        );
      case 'chemistry':
        return (
          <g>
            <path d="M50 26 H70 M54 26 V46 L34 84 C32 88 35 92 40 92 H80 C85 92 88 88 86 84 L66 46 V26" stroke="#8DBBFF" strokeWidth="2.6" fill="rgba(141,187,255,0.09)" strokeLinejoin="round" />
            <path d="M41 72 H79" stroke="#C4ACFF" strokeWidth="2.4" />
            <circle cx="54" cy="80" r="3.5" fill="#C4ACFF" />
            <circle cx="66" cy="77" r="2.5" fill="#8DBBFF" />
          </g>
        );
      case 'constitution':
        return (
          <g>
            <line x1="60" y1="26" x2="60" y2="88" stroke="#8DBBFF" strokeWidth="2.6" strokeLinecap="round" />
            <line x1="32" y1="42" x2="88" y2="42" stroke="#C4ACFF" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M26 62 H44 L35 42 Z" stroke="#8DBBFF" strokeWidth="2" fill="rgba(141,187,255,0.14)" />
            <path d="M76 62 H94 L85 42 Z" stroke="#8DBBFF" strokeWidth="2" fill="rgba(141,187,255,0.14)" />
            <line x1="42" y1="88" x2="78" y2="88" stroke="#C4ACFF" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <div
      className={`${dimensions} relative flex items-center justify-center rounded-2xl bg-[#0B1328]/90 dark:bg-[#0B1328] border border-[#8DBBFF]/20 shadow-inner shrink-0`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none">
        {renderGraphic()}
      </svg>
    </div>
  );
};
