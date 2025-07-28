// src/app/dashboard/page.tsx
'use client';
import { useAuth } from '../AuthContext';
import React from 'react';
import { WelcomeWidget, TodoWidget, ProjectsWidget, EventsWidget } from '../../components/Widgets';

const DashboardPage = () => {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return <div className="min-h-screen bg-background-color flex items-center justify-center text-text-color">Laddar användardata...</div>;
    }

    return (
        <div>
            <WelcomeWidget name={user.displayName || 'Användare'} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <TodoWidget />
                    <ProjectsWidget />
                </div>
                <div className="space-y-8">
                    <EventsWidget />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
