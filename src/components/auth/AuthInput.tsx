import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
    label: string;
    type: 'email' | 'password' | 'text';
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    error?: string;

}

export const AuthInput = ({ label, type, placeholder, value, onChange, error }: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="flex flex-col gap-1.5 w-full mb-4">
            <label className="text-black font-semibold text-[14px] ml-1 -mb-1 w-full text-left">
                {label}
            </label>
            <div className="relative">
                <input
                    type={isPassword && !showPassword ? 'password' : 'text'}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 text-[14px] py-3 rounded-xl border border-gray-300 focus:ring-1 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-600"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-blue-900"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>

            {error && (
                <p className="text-red-600! text-[12px] ml-1! w-full text-left animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};