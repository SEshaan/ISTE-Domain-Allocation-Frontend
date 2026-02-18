import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to: string;
  text: string;
  theme?: 'light' | 'dark';
  onClick?: () => void;
}

export default function BackButton({ to, text, theme = 'dark', onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const themeClasses = theme === 'dark'
    ? 'text-zinc-400 hover:text-white'
    : 'text-zinc-600 hover:text-black';

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(to);
  };

  return (
    <button onClick={handleClick} className={`text-xl flex items-center gap-2 transition font-semibold ${themeClasses}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      {text}
    </button>
  );
}