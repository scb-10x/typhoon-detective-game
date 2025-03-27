import React from 'react';
import { CasePageClient } from './CasePageClient';

interface CasePageProps {
    params: {
        id: string;
    };
}

export default async function CasePage({ params }: CasePageProps) {
    // Simply use params.id directly without React.use
    const id = params.id;

    // Render the client component with the id
    return <CasePageClient id={id} />;
} 