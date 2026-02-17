type Theme = 'info' | 'warning' | 'confirm';

interface PopupProps {
  visible: boolean;
  theme?: Theme;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export default function Popup({ visible, theme = 'info', title, message, onConfirm, onClose }: PopupProps) {
  if (!visible) return null;

  const themeConfig = {
    info: {
      borderColor: 'border-zinc-700',
      titleColor: 'text-white',
      defaultTitle: 'Info'
    },
    warning: {
      borderColor: 'border-yellow-600/50',
      titleColor: 'text-yellow-500',
      defaultTitle: 'Warning'
    },
    confirm: {
      borderColor: 'border-zinc-700',
      titleColor: 'text-white',
      defaultTitle: 'Confirm'
    }
  };

  const config = themeConfig[theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className={`
        relative w-full max-w-lg 
        bg-black border ${config.borderColor} 
        rounded-2xl p-8 
        shadow-2xl transform transition-all
      `}>
        <div className="text-center space-y-6">
          <h3 className={`text-3xl font-bold tracking-wide uppercase ${config.titleColor}`}>
            {title ?? config.defaultTitle}
          </h3>
          
          <p className="text-zinc-400 text-lg leading-relaxed">
            {message}
          </p>

          <div className="flex items-center justify-center gap-6 pt-4">
            {theme === 'confirm' ? (
              <>
                <button
                  onClick={onClose}
                  className="text-zinc-500 hover:text-white font-bold tracking-widest transition-colors px-4"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    if (onClose) onClose();
                  }}
                  className="bg-white text-black px-8 py-3 rounded-xl font-extrabold tracking-widest hover:scale-105 transition-transform"
                >
                  CONFIRM
                </button>
              </>
            ) : (
              <button 
                onClick={onClose} 
                className="bg-white text-black px-10 py-3 rounded-xl font-extrabold tracking-widest hover:scale-105 transition-transform"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
