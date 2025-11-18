import React from 'react';
import { MinusIcon } from '../icons/MinusIcon';
import { PlusIcon } from '../icons/PlusIcon';

interface NumberInputWithButtonsProps {
    value: number | string;
    onChange: (value: number | string) => void;
    step?: number;
    min?: number;
    max?: number;
    className?: string;
}

// Helper to parse complex rep strings like "8-12" or "10"
const parseRepValue = (rep: string): [number | null, string | null] => {
    const match = rep.match(/^(\d+)(.*)/);
    if (match) {
        return [parseInt(match[1], 10), match[2]];
    }
    return [null, null];
};

export const NumberInputWithButtons: React.FC<NumberInputWithButtonsProps> = ({
    value,
    onChange,
    step = 1,
    min = 0,
    max,
    className = ''
}) => {
    const handleIncrement = () => {
        if (typeof value === 'number') {
            const newValue = value + step;
            if (max === undefined || newValue <= max) {
                onChange(newValue);
            }
        } else if (typeof value === 'string') {
            const [num, suffix] = parseRepValue(value);
            if (num !== null) {
                const newValue = num + step;
                if (max === undefined || newValue <= max) {
                    onChange(`${newValue}${suffix}`);
                }
            }
        }
    };

    const handleDecrement = () => {
        if (typeof value === 'number') {
            const newValue = value - step;
            if (min === undefined || newValue >= min) {
                onChange(newValue);
            }
        } else if (typeof value === 'string') {
            const [num, suffix] = parseRepValue(value);
            if (num !== null) {
                const newValue = num - step;
                if (min === undefined || newValue >= min) {
                    onChange(`${newValue}${suffix}`);
                }
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(typeof value === 'number') {
            const numValue = parseFloat(e.target.value);
            onChange(isNaN(numValue) ? 0 : numValue);
        } else {
             onChange(e.target.value);
        }
    }

    const [num] = typeof value === 'string' ? parseRepValue(value) : [null];
    const isDisabled = typeof value === 'string' && num === null;

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <button
                type="button"
                onClick={handleDecrement}
                disabled={isDisabled}
                className="p-1.5 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrement"
            >
                <MinusIcon className="w-4 h-4" />
            </button>
            <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={handleInputChange}
                className="w-full text-center bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm p-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
            />
            <button
                type="button"
                onClick={handleIncrement}
                disabled={isDisabled}
                className="p-1.5 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increment"
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    );
};
