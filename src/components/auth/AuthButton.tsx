interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

export const AuthButton = ({ text, onClick, variant = 'primary' }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg
        ${variant === 'primary'
                    ? 'bg-[#1a237e] text-white hover:bg-[#12195e] shadow-blue-900/20'
                    : 'bg-transparent text-blue-900 hover:bg-blue-50'}`}
        >
            {text}
        </button>
    );
};