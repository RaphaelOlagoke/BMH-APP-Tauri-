import React from 'react'
import { loginSVGImg } from '../utils';
import '../index.css';

const Login = () => {
    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
            {/* Left: SVG side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-200 p-6">
                <img src={loginSVGImg} alt="Login Illustration" className="w-full max-w-md" />
            </div>

            {/* Right: Form side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">BMH Hotel</h2>

                    <form className="space-y-6" action="/" method="GET">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
}
export default Login
