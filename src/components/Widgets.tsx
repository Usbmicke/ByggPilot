// src/components/Widgets.tsx
'use client';
import React from 'react';
import { ProjectCard } from './ProjectCard';

// Ikoner
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const WidgetWrapper = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="bg-card-background-color p-6 rounded-lg shadow-lg">
            {children}
        </div>
    </div>
);

export const WelcomeWidget = ({ name }: { name: string }) => (
    <div className="text-center mb-10">
        <CheckIcon />
        <h1 className="text-3xl font-bold mt-4">Du har inget som kräver din omedelbara uppmärksamhet.</h1>
        <p className="text-text-muted">Snyggt jobbat, {name}!</p>
    </div>
);

export const TodoWidget = () => (
    <WidgetWrapper title="Att Göra">
        <ul className="space-y-3">
            <li className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-3" /> Ring kund för Villa Björkhem</li>
            <li className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded mr-3" /> Beställ virke</li>
        </ul>
        <button className="text-primary-accent-color mt-4 flex items-center"><AddIcon /> Lägg till uppgift</button>
    </WidgetWrapper>
);

export const ProjectsWidget = () => (
    <WidgetWrapper title="Mina Projekt">
        <div className="space-y-4">
            <ProjectCard name="Villa Altanbygge" customer="Anna Andersson" status="I fas" progress={75} nextEvent="Slutbesiktning 2025-08-20" />
            <ProjectCard name="Garageuppfart" customer="BRF Solgläntan" status="Behöver tillsyn" progress={20} nextEvent="Väntar på kundbesked" />
            <ProjectCard name="Fasadmålning" customer="Erik Nilsson" status="Kritisk" progress={90} nextEvent="Slutfaktura försenad" />
        </div>
    </WidgetWrapper>
);

export const EventsWidget = () => (
    <WidgetWrapper title="Senaste Händelser">
        <ul className="space-y-4">
            <li className="text-sm text-text-muted">📧 Nytt mail från "Kalle Svensson"</li>
            <li className="text-sm text-text-muted">✅ Mappstruktur skapad för "Garageuppfart"</li>
            <li className="text-sm text-text-muted">📅 Påminnelse tillagd: "Ring leverantör"</li>
        </ul>
    </WidgetWrapper>
);
