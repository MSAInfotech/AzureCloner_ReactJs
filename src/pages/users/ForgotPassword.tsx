import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }

        try {
            const res = await fetch(
                `https://localhost:7245/api/Auth/forgotPassword?email=${encodeURIComponent(email)}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: null
                }
            );
            if (res.ok) {
                const result = await res.text();
                setMessage(result || "Request processed.");
            } else {
                const error = await res.json();
                setMessage(error.message || "Request failed.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again later.");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')", // new image
            }}
        >
            <div className="bg-white/90 backdrop-blur-sm w-full max-w-md rounded-xl shadow-2xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-indigo-700">Forgot Password</h2>
                <p className="text-sm text-center text-gray-700">
                    Enter your email address and we’ll send you instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Email</label>
                        <input
                            type="email"
                            placeholder="john.doe@example.com"
                            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Send Reset Link
                    </button>
                </form>

                {message && (
                    <p className="text-sm text-center text-green-600 font-medium mt-2">{message}</p>
                )}

                <div className="flex justify-between text-sm pt-4 border-t border-gray-200">
                    <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </button>
                    <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
