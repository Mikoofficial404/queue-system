import usePusher from '@/hooks/use-pusher';
import DisplayLayout from '@/layouts/display-layout';
import { useState } from 'react';

interface Queue {
    id: number;
    number: string;
    service_name: string;
    counter: number | null;
}

interface DisplayQueueProps {
    currentQueue?: Queue;
    nextQueues?: Queue[];
}

// Payload type for the 'queue-created' event
interface QueueCreatedEvent {
    queue: {
        id: number;
        number: string;
        service_name: string;
        counter?: number | null;
    };
}

export default function DisplayQueue({ currentQueue, nextQueues = [] }: DisplayQueueProps) {
    const [current, setCurrent] = useState<Queue | undefined>(currentQueue);
    const [next, setNext] = useState<Queue[]>(nextQueues.slice(0, 4));
    const [isPulsing, setIsPulsing] = useState(false);

    // Initialize Pusher for real-time updates
    // Lengkapi seperti pada slide PPT
    usePusher('queue-updates', {
        'queue-called': (data: { queue: Queue }) => {
            console.log('Queue called event received:', data);
            setCurrent(data.queue);
            // Remove the called queue from next queues
            setNext((prev) => prev.filter((q) => q.id !== data.queue.id));
            // Trigger pulse animation
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 3000);
            // Play bell.wav
            const bell = new Audio('/bell.wav');
            bell.play();
            setTimeout(() => {
                if ('speechSynthesis' in window) {
                    try {
                        const announcement = `Nomor antrian ${data.queue.number}, silakan menuju ke loket ${data.queue.counter}`;
                        const utterance = new SpeechSynthesisUtterance(announcement);
                        utterance.lang = 'id-ID';
                        utterance.rate = 0.9;
                        window.speechSynthesis.speak(utterance);
                    } catch (error) {
                        console.log('Failed to text-to-speech:', error);
                    }
                }
            }, 2000);
            // Announce the queue number using text-to-speech
        },
        'queue-created': (data: { queue: Queue }) => {
            console.log('Queue created event received:', data);
            // Add new queue to next queues if there's space
            setNext((prev) => {
                const updated = [...prev, data.queue];
                return updated.slice(0, 4);
            });
        },
    });
    return (
        <DisplayLayout>
            {/* Current Serving Section */}
            <div className="flex flex-col justify-center lg:col-span-2">
                <header className="py-8 text-center">
                    <p className="text-2xl font-semibold text-white/80">Welcome to</p>
                    <h1 className="text-4xl font-bold text-white">Bank Central Asia</h1>
                </header>
                <div className="flex h-2/3 flex-col rounded-3xl bg-white p-12 shadow-2xl">
                    <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">NOW SERVING</h2>

                    {current ? (
                        <div
                            className={`flex flex-1 flex-col items-center justify-center rounded-2xl bg-primary p-12 text-white transition-all duration-300 ${
                                isPulsing ? 'shadow-2xl shadow-primary' : ''
                            }`}
                        >
                            <div
                                className={`mb-4 text-9xl font-black transition-all duration-300 ${
                                    isPulsing ? 'scale-110 animate-pulse text-yellow-300' : ''
                                }`}
                            >
                                {current.number}
                            </div>
                            <div className="text-4xl font-semibold">{current.service_name}</div>
                            <div className="mt-8 rounded-full bg-orange-600 px-8 py-4 text-3xl font-medium">Counter {current.counter ?? 'N/A'}</div>
                        </div>
                    ) : (
                        <div className="fllex- rounded-2xl bg-gray-200 p-12 text-gray-500">
                            <div className="mb-4 text-9xl font-black">---</div>
                            <div className="text-3xl font-semibold">No Queue Currently Serving</div>
                        </div>
                    )}
                </div>
                <footer className="py-4 text-center">
                    <p className="text-xl text-white/80">Please wait for your number to be called</p>
                </footer>
            </div>

            {/* Next Queues Section */}
            <div className="py-8 lg:col-span-1">
                <div className="flex h-full flex-col rounded-3xl bg-white p-8 shadow-2xl">
                    <h3 className="mb-6 text-center text-3xl font-bold text-gray-800">Next in line</h3>

                    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto">
                        {next.length > 0 &&
                            next.map((queue, index) => (
                                <div
                                    key={queue.id}
                                    className={`flex flex-1 flex-col justify-center rounded-xl p-6 transition-all duration-300 ${
                                        index === 0 ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <div className="mb-2 text-4xl font-bold">{queue.number}</div>
                                    <div className="text-xl font-medium">{queue.service_name}</div>
                                </div>
                            ))}

                        {/* Fill empty slots */}
                        {Array.from({ length: Math.max(0, 4 - next.length) }).map((_, index) => (
                            <div
                                key={`empty-${index}`}
                                className="flex flex-1 flex-col justify-center rounded-xl bg-gray-50 p-6 text-center text-gray-400"
                            >
                                <div className="mb-2 text-4xl font-bold">---</div>
                                <div className="text-lg font-medium">Waiting</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DisplayLayout>
    );
}
