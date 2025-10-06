
import { getUserIdFromSession } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';

export default async function TurnosLayout({ children }) {
    const userId = await getUserIdFromSession();

    if (!userId) {
        redirect('/login?callbackUrl=/turnos');
    }

    return (
        <section className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                {children}
            </div>
        </section>
    );
}
