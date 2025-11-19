
import React, { useRef, useEffect, useState } from 'react';
import { User, MembershipStatus, MembershipTier } from '../../types';
import { useTranslation } from 'react-i18next';

interface MembershipCardProps {
    user: User;
    tier?: MembershipTier;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ user, tier }) => {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const CARD_WIDTH = 856;
    const CARD_HEIGHT = 540;

    const [dynamicToken, setDynamicToken] = useState<string>(Math.random().toString(36).substring(7));
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setDynamicToken(Math.random().toString(36).substring(7).toUpperCase());
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
            ctx.fillText(`${t('general.user')}: ${user.id}`, 280, 345);

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
            ctx.fillText(`${t('client.dashboard.endDate')}: ${new Date(user.membership.endDate).toLocaleDateString()}`, CARD_WIDTH - 50, CARD_HEIGHT - 50);

            // Simulated QR Code area (bottom right)
            const qrSize = 120;
            const qrX = CARD_WIDTH - 170;
            const qrY = 50;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(qrX, qrY, qrSize, qrSize);
            
            // Draw "pixels" for mock QR based on dynamic token
            const seed = dynamicToken.charCodeAt(0) + dynamicToken.charCodeAt(dynamicToken.length - 1);
            ctx.fillStyle = 'black';
            const cellSize = qrSize / 10;
            for(let i=0; i<10; i++) {
                for(let j=0; j<10; j++) {
                    // Simple pseudo-random pattern based on time token
                    if (Math.sin(seed * i * j + timeLeft) > 0) {
                        ctx.fillRect(qrX + i*cellSize, qrY + j*cellSize, cellSize, cellSize);
                    }
                }
            }
            // Corner squares
            ctx.fillRect(qrX, qrY, 30, 30);
            ctx.fillRect(qrX + qrSize - 30, qrY, 30, 30);
            ctx.fillRect(qrX, qrY + qrSize - 30, 30, 30);
            ctx.fillStyle = 'white';
            ctx.fillRect(qrX + 5, qrY + 5, 20, 20);
            ctx.fillRect(qrX + qrSize - 25, qrY + 5, 20, 20);
            ctx.fillRect(qrX + 5, qrY + qrSize - 25, 20, 20);
            ctx.fillStyle = 'black';
            ctx.fillRect(qrX + 10, qrY + 10, 10, 10);
            ctx.fillRect(qrX + qrSize - 20, qrY + 10, 10, 10);
            ctx.fillRect(qrX + 10, qrY + qrSize - 20, 10, 10);
        }

        const loadAndDraw = async () => {
            try {
                const response = await fetch(user.avatarUrl);
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${user.avatarUrl}`);
                }
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                
                const avatar = new Image();
                avatar.onload = () => {
                    drawCard(avatar);
                    URL.revokeObjectURL(objectURL); 
                };
                avatar.onerror = () => {
                    drawCard(null);
                    URL.revokeObjectURL(objectURL);
                };
                avatar.src = objectURL;

            } catch (error) {
                console.error(`Failed to fetch avatar image from ${user.avatarUrl}. Drawing fallback.`, error);
                drawCard(null); 
            }
        };

        loadAndDraw();

    }, [user, tier, dynamicToken, timeLeft, t]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `GymPro_Card_${user.name.replace(' ', '_')}.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <div className="w-full max-w-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('client.sidebar.membershipCard')}</h2>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md inline-block w-full max-w-[90%] mx-auto">
                <div className="flex justify-center mb-2">
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        {t('client.membershipCard.dynamicAccessCode')}
                    </span>
                </div>
                
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                    />
                </div>
                
                <canvas ref={canvasRef} className="rounded-lg shadow-sm mx-auto max-w-full h-auto"></canvas>
                
                <p className="mt-2 text-xs text-gray-400">
                     {t('client.membershipCard.refreshNote', { seconds: timeLeft })}
                </p>
            </div>

            <button
                onClick={handleDownload}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
                {t('client.membershipCard.download')}
            </button>
        </div>
    );
};

export default MembershipCard;
