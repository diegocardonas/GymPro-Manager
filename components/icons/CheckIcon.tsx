import React from 'react';

export const CheckIcon: React.FC<{ double?: boolean } & React.SVGProps<SVGSVGElement>> = ({ double, ...props }) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    {double && <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 12.75 6 6 9-13.5" />}
  </svg>
);
