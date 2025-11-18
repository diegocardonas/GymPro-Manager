import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.7 }} />
            </linearGradient>
        </defs>
        <g stroke="url(#logoGradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 20 50 H 80" />
            <path d="M 20 40 V 60" />
            <path d="M 25 35 V 65" />
            <path d="M 80 40 V 60" />
            <path d="M 75 35 V 65" />
        </g>
    </svg>
);