import { Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-0 sm:pt-6 bg-white sm:bg-gradient-to-br sm:from-orange-50 sm:to-blue-50">
            <div className="absolute top-4 left-4 hidden sm:block">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
                >
                    <FaArrowLeft className="mr-2" />
                    Back
                </button>
            </div>

            <div className="w-full sm:max-w-md mt-0 sm:mt-6 px-6 py-8 bg-white shadow-none sm:shadow-xl sm:bg-white overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border sm:border-gray-100 min-h-screen sm:min-h-0 flex flex-col justify-center sm:block">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="no-underline">
                        <ApplicationLogo className="h-12 w-auto justify-center" />
                    </Link>
                </div>

                {children}

                <div className="mt-auto sm:hidden text-center text-sm text-gray-500 pb-4">
                    &copy; {new Date().getFullYear()} ZibaCrib.
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 hidden sm:block">
                &copy; {new Date().getFullYear()} ZibaCrib. Making student accommodation easier.
            </div>
        </div>
    );
}
