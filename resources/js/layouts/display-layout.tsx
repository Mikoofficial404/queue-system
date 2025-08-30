import { Head } from '@inertiajs/react';
import React, { type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const DisplayLayout: React.FC<Props> = ({ children }) => {
    return (
        <>
            <Head title="Queue Display">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-4 text-white">
                <main
                    className="grid min-h-screen grid-cols-3 gap-8 px-12"
                    style={{
                        background: "url('/bg-emerald.png')",
                        backgroundSize: 'cover',
                    }}
                >
                    {children}
                </main>
            </div>
        </>
    );
};

export default DisplayLayout;
