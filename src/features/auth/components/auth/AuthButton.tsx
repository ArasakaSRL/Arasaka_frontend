interface ButtonProps {
    text: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    type?: 'submit' | 'button';
}

export const AuthButton = ({ text, onClick, variant = 'primary', disabled, type = 'button' }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg
            ${disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : variant === 'primary'
                        ? 'bg-[#1a237e] text-white hover:bg-[#12195e] shadow-blue-900/20 active:scale-95'
                        : 'bg-transparent text-blue-900 hover:bg-blue-50'
                }`}
        >
            {text}
        </button>
    );
};