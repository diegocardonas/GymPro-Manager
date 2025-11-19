import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.6 }} />
            </linearGradient>
        </defs>
        
        {/* Background Circle / Plate */}
        <circle 
            cx="64" 
            cy="64" 
            r="56" 
            stroke="url(#logoGrad)" 
            strokeWidth="10" 
            fill="none" 
            strokeLinecap="round" 
            strokeDasharray="270" 
            strokeDashoffset="40" 
            transform="rotate(-90 64 64)" 
        />
        
        {/* Central Barbell */}
        <line 
            x1="32" 
            y1="64" 
            x2="96" 
            y2="64" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round"
            className="text-gray-800 dark:text-white"
        />

        {/* Weight Plates */}
        <path 
            d="M32 44 V84 M22 48 V80" 
            stroke="url(#logoGrad)" 
            strokeWidth="6" 
            strokeLinecap="round" 
        />
        <path 
            d="M96 44 V84 M106 48 V80" 
            stroke="url(#logoGrad)" 
            strokeWidth="6" 
            strokeLinecap="round" 
        />

        {/* Dynamic upward trend indicator */}
        <path 
            d="M100 100 L115 85 L125 95" 
            stroke="url(#logoGrad)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            transform="translate(-10, -10)"
        />
    </svg>
);