// src/components/ProjectCard.tsx
'use client';
import React from 'react';

interface ProjectCardProps {
    name: string;
    customer: string;
    status: 'I fas' | 'Behöver tillsyn' | 'Kritisk';
    progress: number; // Procent, 0-100
    nextEvent: string;
}

export const ProjectCard = ({ name, customer, status, progress, nextEvent }: ProjectCardProps) => {
    const statusInfo = {
        'I fas': { color: 'border-status-green', text: 'text-status-green' },
        'Behöver tillsyn': { color: 'border-status-yellow', text: 'text-status-yellow' },
        'Kritisk': { color: 'border-status-red', text: 'text-status-red' },
    };

    return (
        <div className={`bg-card-background-color p-4 rounded-lg shadow-lg border-l-4 ${statusInfo[status].color} flex flex-col gap-3`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-md">{name}</h3>
                    <p className="text-text-muted text-sm">{customer}</p>
                </div>
                <p className={`font-semibold text-sm ${statusInfo[status].text}`}>{status}</p>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-text-muted">Framsteg</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-secondary-bg rounded-full h-2.5">
                    <div className="bg-primary-accent-color h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <p className="text-sm text-text-muted mt-1"><span className="font-semibold">Nästa:</span> {nextEvent}</p>
        </div>
    );
};
