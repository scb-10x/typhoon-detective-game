import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
    // Version information
    const versionInfo = {
        version: '1.0.0',
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'development',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(versionInfo);
} 