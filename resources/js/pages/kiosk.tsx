import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import DisplayLayout from '@/layouts/display-layout';
import { BanknoteIcon, HandCoinsIcon, MessageCircleQuestionIcon, PiggyBankIcon } from 'lucide-react';
import { useState } from 'react';

const services = [
    { id: 1, name: 'Customer Service', icon: MessageCircleQuestionIcon },
    { id: 2, name: 'Teller', icon: HandCoinsIcon },
    { id: 3, name: 'Account Opening', icon: PiggyBankIcon },
    { id: 4, name: 'Loan Services', icon: BanknoteIcon },
];

export default function Kiosk({ csrf }: { csrf: string }) {
    const [queueNumber, setQueueNumber] = useState<string | null>(null);

    const handleGetQueue = async (serviceId?: number) => {
        const response = await fetch('/kiosk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({
                service_id: serviceId,
            }),
        });

        const data = await response.json();
        setQueueNumber(data.number);
    };

    return (
        <DisplayLayout>
            <header className="mt-12 text-center">
                <p className="text-2xl font-medium text-white/80">Welcome to</p>
                <h1 className="text-5xl font-bold text-white">Bank Central Asia</h1>
            </header>

            <div className="mx-auto mt-12 w-full max-w-5xl">
                {!queueNumber ? (
                    <div className="rounded-2xl bg-white/95 p-12 shadow-2xl backdrop-blur">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-semibold text-gray-800">Please select the service you need</h2>
                        </div>

                        {/* Service Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {services.map((service) => (
                                <Button
                                    key={service.id}
                                    onClick={() => handleGetQueue(service.id)}
                                    className="flex h-48 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                                >
                                    <Icon iconNode={service.icon} className="mb-4 h-14 w-14 text-primary" />
                                    <span className="text-2xl font-semibold text-gray-800">{service.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white/95 p-16 text-center shadow-2xl backdrop-blur">
                        <h2 className="mb-6 text-3xl font-semibold text-gray-800">Your Queue Number</h2>
                        <div className="mb-10 text-8xl font-extrabold text-primary drop-shadow">{queueNumber}</div>
                        <p className="mb-10 text-xl text-gray-600">
                            Please wait until your number is called.
                            <br />
                            Watch the display screen for your turn.
                        </p>
                        <Button onClick={() => setQueueNumber(null)} size="lg" className="rounded-xl px-8 py-6 text-lg font-medium">
                            Back to Services
                        </Button>
                    </div>
                )}
            </div>
        </DisplayLayout>
    );
}
