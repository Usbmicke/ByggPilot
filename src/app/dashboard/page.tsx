// src/app/dashboard/page.tsx
'use client';

import { Widgets } from '../../components/Widgets'; // Assuming Widgets was imported

const DashboardPage = () => {
  return (
    <div className="flex-1 p-6 md:p-10">
      <Widgets />
    </div>
  );
};

export default DashboardPage;
