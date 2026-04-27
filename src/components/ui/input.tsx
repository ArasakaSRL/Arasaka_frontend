/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Calendar } from 'lucide-react';

interface Props {
    label: string;
    type: 'text' | 'textarea' | 'date' | 'url';
    placeholder: string; // texto de ayuda dentro del input
    value: string; // valor actual del input
    onChange: (val: string) => void;
    error?: string;
    maxLength?: number;
    showCounter?: boolean;
    required?: boolean;
    min?: string;
    max?: string;
    icon?: LucideIcon; // icono opcional de lucide-react
    disabled?: boolean;
    readOnly?: boolean;
    readOnlyMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, type, placeholder, value, onChange, error, maxLength, showCounter, required, icon: Icon, min, max, disabled, readOnly, readOnlyMessage }, ref) => {
        const isAtLimit = maxLength !== undefined && value.length === maxLength;
        const [showReadOnlyMsg, setShowReadOnlyMsg] = useState(false);

        return (
            <div className="flex flex-col gap-1.5 w-full">
                <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1 -mb-1 w-full text-left">
                    {Icon && <Icon size={15} className="text-gray-500" />}
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">

                    {type === 'textarea' ? (
                        <textarea
                            ref={ref as React.Ref<HTMLTextAreaElement>}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            rows={4}
                            disabled={disabled}
                            className={`w-full px-3 py-2 text-[14px] rounded-xl border transition-all outline-none placeholder:text-gray-400 text-gray-600 resize-none
                            ${disabled 
                                ? "bg-gray-100 cursor-not-allowed" 
                                : "border-gray-300 focus:ring-1 focus:ring-blue-600 focus:border-transparent"
                            }
                            ${isAtLimit
                                    ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                                    : 'border-gray-300 focus:ring-1 focus:ring-blue-600 focus:border-transparent'
                                }`}
                        />
                    ) : (
                        <input
                            ref={ref}
                            maxLength={maxLength}
                            type={type}
                            placeholder={placeholder}
                            min={min}
                            max={max}
                            value={value}
                            disabled={disabled}
                            readOnly={readOnly}
                            onClick={() => readOnly && setShowReadOnlyMsg(true)}
                            onBlur={() => setShowReadOnlyMsg(false)}
                            onChange={(e) => onChange(e.target.value)}
                            className={`w-full px-3 text-[14px] py-2 rounded-xl border transition-all outline-none placeholder:text-gray-400
                            ${readOnly
                                ? 'bg-gray-50 text-gray-600 cursor-default border-gray-200 select-none'
                                : disabled
                                ? 'bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200'
                                : 'text-gray-600 border-gray-300 focus:ring-1 focus:ring-blue-600 focus:border-transparent'
                            }
                            ${isAtLimit ? 'border-gray-300 caret-red-500' : ''}`}
                        />
                    )}
                    {type === "date" && (
                        <Calendar
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    )}
                </div>

                {(showCounter || error) && (
                <div className="flex justify-between items-center ml-1">
                    <div>
                    {error ? (
                        <p className="text-red-500 text-[12px] animate-in fade-in slide-in-from-top-1">
                        {error}
                        </p>
                    ) : isAtLimit ? (
                        <p className="text-red-500 text-[11px] animate-in fade-in slide-in-from-top-1">
                        Se alcanzó el límite de caracteres permitidos
                        </p>
                    ) : null}
                    </div>

                    {maxLength !== undefined && showCounter && (
                    <span className={`text-[11px] ${isAtLimit ? 'text-red-500' : 'text-gray-400'}`}>
                        {value.length}/{maxLength}
                    </span>
                    )}
                    
                </div>
                )}
            </div>
        );
    });