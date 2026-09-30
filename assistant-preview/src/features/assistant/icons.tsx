/** Small inline icon set — decorative only (aria-hidden); labels live on the controls. */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const MicIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
);
export const MicOffIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 9v2a3 3 0 0 0 5.1 2.1M15 10V6a3 3 0 0 0-5.7-1.3M5 11a7 7 0 0 0 11.5 5.4M19 11a7 7 0 0 1-.6 2.8M12 18v3M3 3l18 18" /></svg>
);
export const StopIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="7" y="7" width="10" height="10" rx="2" /></svg>
);
export const CameraIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
export const SendIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 12l16-8-6 16-2-7z" /></svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7" /></svg>
);
export const PeopleIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .5 3 2 3 5" /></svg>
);
export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M12 8v5M12 16h.01" /></svg>
);
export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>
);
export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12l5 5 9-10" /></svg>
);
export const RobotIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="5" y="8" width="14" height="10" rx="2" /><path d="M12 4v4M9 13h.01M15 13h.01M3 12v3M21 12v3" /></svg>
);
export const MemoryIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" /></svg>
);
export const SensorIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z" /></svg>
);
export const TaskIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l3 3 5-6" /></svg>
);
export const PanelIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></svg>
);
