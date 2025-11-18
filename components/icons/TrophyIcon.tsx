import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1 0 0-13.5h9a9.75 9.75 0 1 0 0 13.5ZM10.5 6.75h3v6h-3v-6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a.75.75 0 0 1-.75-.75V12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-.008Z" />
    </svg>
);