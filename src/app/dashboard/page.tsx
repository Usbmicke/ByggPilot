// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { WelcomeWidget } from './_components/WelcomeWidget';
import { TodoWidget } from './_components/TodoWidget';
import { RecentEventsWidget } from './_components/RecentEventsWidget';
import { ProjectCard } from './_components/ProjectCard';

export const dynamic = 'force-dynamic'; // Tvinga dynamisk rendering

const DashboardPage = () => {
  return (
    <div className="flex-1 p-6 md:p-10">
      <WelcomeWidget />
      <TodoWidget />
      <RecentEventsWidget />
      <ProjectCard />
    </div>
  );
};

export default DashboardPage;
