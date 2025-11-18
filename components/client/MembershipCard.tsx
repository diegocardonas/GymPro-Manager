import React, { useRef, useEffect } from 'react';
import { User, MembershipStatus, MembershipTier } from '../../types';

interface MembershipCardProps {
    user: User;
    tier?: MembershipTier;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ user, tier }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const CARD_WIDTH = 856;
    const CARD_HEIGHT = 540;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set high-resolution canvas
        const dpr = window.devicePixelRatio || 1;
        canvas.width = CARD_WIDTH * dpr;
        canvas.height = CARD_HEIGHT * dpr;
        canvas.style.width = `${CARD_WIDTH / 2}px`;
        canvas.style.height = `${CARD_HEIGHT / 2}px`;
        ctx.scale(dpr, dpr);

        const drawCard = (avatarImage: HTMLImageElement | null) => {
            // Card Background
            const gradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
            gradient.addColorStop(0, '#1e3a8a'); // dark blue
            gradient.addColorStop(1, '#064e3b'); // dark teal
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
            
            // Brand Logo
            ctx.font = 'bold 48px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText('GymPro', 50, 80);
            ctx.font = '24px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText('Manager', 55, 115);

            // Draw Avatar or Fallback
            if (avatarImage) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(150, 290, 80, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatarImage, 70, 210, 160, 160);
                ctx.restore();
                
                 // Avatar Border
                ctx.beginPath();
                ctx.arc(150, 290, 84, 0, Math.PI * 2, true);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 4;
                ctx.stroke();
            } else {
                // Fallback if image fails
                ctx.save();
                ctx.beginPath();
                ctx.arc(150, 290, 80, 0, Math.PI * 2, true);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fill();
                ctx.font = 'bold 70px sans-serif';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                ctx.fillText(initials, 150, 290);
                ctx.restore();
            }
            
            // Text Info
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(user.name, 280, 260);

            if (tier) {
                ctx.font = 'bold 32px sans-serif';
                ctx.fillStyle = tier.color;
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 5;
                ctx.fillText(tier.name, 280, 305);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }

            ctx.font = '24px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(`ID de Miembro: ${user.id}`, 280, 345);


            // Status Badge
            const status = user.membership.status;
            const statusInfo = {
                [MembershipStatus.ACTIVE]: { text: 'ACTIVO', color: '#10B981' },
                [MembershipStatus.EXPIRED]: { text: 'VENCIDO', color: '#EF4444' },
                [MembershipStatus.PENDING]: { text: 'PENDIENTE', color: '#F59E0B' },
            };
            ctx.fillStyle = statusInfo[status].color;
            ctx.fillRect(280, 380, 150, 40);
            ctx.font = 'bold 24px sans-serif';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(statusInfo[status].text, 355, 400);

            // Expiration Date
            ctx.textAlign = 'right';
            ctx.font = '24px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(`Vence el: ${new Date(user.membership.endDate).toLocaleDateString()}`, CARD_WIDTH - 50, CARD_HEIGHT - 50);
        }

        const loadAndDraw = async () => {
            try {
                // Fetch the image as a blob to bypass CORS issues with canvas
                const response = await fetch(user.avatarUrl);
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${user.avatarUrl}`);
                }
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                
                const avatar = new Image();
                avatar.onload = () => {
                    drawCard(avatar);
                    URL.revokeObjectURL(objectURL); // Clean up the object URL
                };
                avatar.onerror = () => {
                    // This error is less likely but good to have as a fallback
                    console.error(`Failed to load avatar image from blob for ${user.avatarUrl}. Drawing fallback.`);
                    drawCard(null);
                    URL.revokeObjectURL(objectURL);
                };
                avatar.src = objectURL;

            } catch (error) {
                console.error(`Failed to fetch avatar image from ${user.avatarUrl}. Drawing fallback.`, error);
                drawCard(null); // Draw fallback if fetch fails
            }
        };

        loadAndDraw();

    }, [user, tier]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `GymPro_Tarjeta_de_Miembro_${user.name.replace(' ', '_')}.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tu Tarjeta de Miembro</h2>
            <canvas ref={canvasRef} className="rounded-2xl shadow-2xl mx-auto"></canvas>
            <button
                onClick={handleDownload}
                className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
                Descargar Tarjeta
            </button>
        </div>
    );
};

export default MembershipCard;