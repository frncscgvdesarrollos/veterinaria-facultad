'use client';

import { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
    const [strength, setStrength] = useState({ score: 0, label: '', color: 'bg-gray-200', textColor: 'text-gray-500' });

    const checkStrength = (pwd) => {
        let score = 0;
        let label = 'Muy débil';
        let color = 'bg-red-500';
        let textColor = 'text-red-500';

        if (pwd.length === 0) {
            setStrength({ score: -1, label: '', color: 'bg-gray-200', textColor: 'text-gray-500' });
            return;
        }

        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        
        const percentage = (score / 5) * 100;

        if (score <= 2) {
            label = 'Débil';
            color = 'bg-orange-500';
            textColor = 'text-orange-500';
        } else if (score === 3) {
            label = 'Normal';
            color = 'bg-yellow-500';
            textColor = 'text-yellow-500';
        } else if (score === 4) {
            label = 'Fuerte';
            color = 'bg-blue-500';
            textColor = 'text-blue-500';
        } else if (score >= 5) {
            label = 'Muy Fuerte';
            color = 'bg-green-500';
            textColor = 'text-green-500';
        }

        setStrength({ score, label, color, textColor, percentage });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => checkStrength(password), 300);
        return () => clearTimeout(timeoutId);
    }, [password]);

    if (strength.score === -1) return null;

    return (
        <div className="mb-4 transition-all duration-300">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                    style={{ width: `${strength.percentage}%` }}
                ></div>
            </div>
            <p className={`text-xs mt-1 text-right font-semibold transition-colors duration-500 ${strength.textColor}`}>
                {strength.label}
            </p>
        </div>
    );
};

export default PasswordStrengthMeter;
