import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Input } from './input';
import { cn } from '../../lib/utils';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    validator?: (value: string) => Promise<{ isValid: boolean; message: string }> | { isValid: boolean; message: string };
    debounceTime?: number;
    initialStatus?: 'idle' | 'validating' | 'valid' | 'invalid';
}

export const ValidatedInput = ({
    value,
    onChange,
    validator,
    debounceTime = 500,
    className,
    ...props
}: ValidatedInputProps) => {
    const [validation, setValidation] = useState({
        status: 'idle', // idle | validating | valid | invalid
        message: ''
    });

    useEffect(() => {
        const validateValue = async () => {
            // Safely handle value
            const val = String(value || '');

            if (!val) {
                setValidation({ status: 'idle', message: '' });
                return;
            }

            // If no validator provided, just behave like normal input
            if (!validator) return;

            setValidation({ status: 'validating', message: 'Checking...' });

            try {
                const result = await validator(val);

                if (result.isValid) {
                    setValidation({
                        status: 'valid',
                        message: result.message || 'Valid input'
                    });
                } else {
                    setValidation({
                        status: 'invalid',
                        message: result.message
                    });
                }
            } catch (error) {
                setValidation({
                    status: 'invalid',
                    message: 'Validation failed'
                });
            }
        };

        const timer = setTimeout(validateValue, debounceTime);
        return () => clearTimeout(timer);
    }, [value, validator, debounceTime]);

    return (
        <div className="w-full">
            <div className="relative">
                <Input
                    value={value}
                    onChange={onChange}
                    className={cn(
                        "pr-12 transition-all duration-300",
                        validation.status === 'valid' && "border-green-500 bg-green-50 focus-visible:ring-green-500",
                        validation.status === 'invalid' && "border-red-500 bg-red-50 focus-visible:ring-red-500",
                        validation.status === 'validating' && "border-blue-500 focus-visible:ring-blue-500",
                        className
                    )}
                    {...props}
                />

                {/* Validation icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {validation.status === 'validating' && (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                    {validation.status === 'valid' && (
                        <CheckCircle className="w-4 h-4 text-green-500 animate-in zoom-in" />
                    )}
                    {validation.status === 'invalid' && (
                        <XCircle className="w-4 h-4 text-red-500 animate-in zoom-in" />
                    )}
                </div>
            </div>

            {/* Feedback message */}
            {validation.message && validation.status !== 'idle' && (
                <p className={cn(
                    "mt-2 text-xs font-medium animate-in slide-in-from-top-1",
                    validation.status === 'valid' && "text-green-600",
                    validation.status === 'invalid' && "text-red-600",
                    validation.status === 'validating' && "text-blue-600"
                )}>
                    {validation.message}
                </p>
            )}
        </div>
    );
};
