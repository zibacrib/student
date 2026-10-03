import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaWhatsapp, FaPhone, FaBuilding } from 'react-icons/fa';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
        phone: '',
        agency_name: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />
            
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Join ZibaCrib in seconds</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="flex gap-4 mb-6">
                    <button type="button" onClick={() => setData('role', 'student')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${data.role === 'student' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-orange-200'}`}>
                        I am a Student
                    </button>
                    <button type="button" onClick={() => setData('role', 'agent')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${data.role === 'agent' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-orange-200'}`}>
                        I am an Agent
                    </button>
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="name" value="Full Name" className="text-gray-700 font-medium" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors shadow-sm"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Full name"
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Email" className="text-gray-700 font-medium" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors shadow-sm"
                            autoComplete="email"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@university.edu.zm"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {data.role === 'agent' && (
                    <>
                        <div className="space-y-2">
                            <InputLabel htmlFor="phone" value="Phone Number (WhatsApp) *" className="text-gray-700 font-medium" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="text-gray-400" />
                                </div>
                                <TextInput
                                    id="phone"
                                    name="phone"
                                    value={data.phone}
                                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors shadow-sm"
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="e.g. 0991234567"
                                    required={data.role === 'agent'}
                                />
                            </div>
                            <InputError message={errors.phone} className="mt-1" />
                        </div>
                        <div className="space-y-2">
                            <InputLabel htmlFor="agency_name" value="Agency / Company Name (Optional)" className="text-gray-700 font-medium" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaBuilding className="text-gray-400" />
                                </div>
                                <TextInput
                                    id="agency_name"
                                    name="agency_name"
                                    value={data.agency_name}
                                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors shadow-sm"
                                    onChange={(e) => setData('agency_name', e.target.value)}
                                    placeholder="e.g. Prime Properties"
                                />
                            </div>
                            <InputError message={errors.agency_name} className="mt-1" />
                        </div>
                    </>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-medium" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="pl-10 pr-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors shadow-sm"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Create password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-gray-700 font-medium" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="pl-10 pr-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors shadow-sm"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                </div>

                <PrimaryButton
                    className="w-full justify-center py-3 rounded-lg bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transition-all duration-200 text-base font-semibold shadow-md active:scale-95"
                    disabled={processing}
                >
                    {processing ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                        </div>
                    ) : (
                        'Create Account'
                    )}
                </PrimaryButton>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
