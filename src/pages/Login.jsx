import React, {useState} from 'react'
import {loginSVGImg, logoImg} from '../utils';
import '../index.css';
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [showIncorrectFields, setIncorrectFields] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const login = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setModalMessage("Please enter both email and password.");
            setIncorrectFields(true);
            return;
        }

        setLoading(true);
        try {
            const res = await restClient.postWithoutToken('/auth/login', {
                email: username,
                password: password,
            });

            console.log(res)

            if (res != null) {
                if(res.data && res.responseHeader.responseCode === "00" && res.data.token) {
                    const data = res.data
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    const department = data.department;

                    switch (department) {
                        case 'RESTAURANT_BAR':
                            navigate('/restaurant-bar');
                            break;
                        default:
                            navigate('/home');
                            break;
                    }
                }
                else{
                    setModalMessage(res.error)
                    setIncorrectFields(true);
                }
            } else {
                setModalMessage("Something went wrong!");
                setIncorrectFields(true);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setModalMessage("Something went wrong!");
            setIncorrectFields(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen p-6">
            {loading && <LoadingScreen />}

            {/* Left: SVG side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center  p-6">
                <img src={loginSVGImg} alt="Login Illustration" className="w-full max-w-md" />
            </div>

            {/* Right: Form side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 shadow-lg rounded">
                <div className="w-full max-w-md">
                    <div className="flex justify-center pb-5">
                        <img className="w-12 h-12" src={logoImg} alt="logo" />
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">BMH Hotel</h2>

                    <form className="space-y-6 text-start" action="/" method="GET">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={username}
                                required={true}
                                onChange={(e) => setUsername(e.target.value)}
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
                                value={password}
                                required={true}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/*<div className="text-right">*/}
                        {/*    <a href="#" className="text-sm text-blue-600 hover:underline">*/}
                        {/*        Forgot password?*/}
                        {/*    </a>*/}
                        {/*</div>*/}

                        <button
                            type="submit"
                            onClick={login}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>

            {/* ✅ Incorret Credentials */}
            {showIncorrectFields && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setIncorrectFields(false)}
                />
            )}
        </div>

    );
}
export default Login
