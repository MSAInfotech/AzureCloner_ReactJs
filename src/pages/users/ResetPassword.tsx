import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [params] = useSearchParams();
    const token = params.get("token");
    const navigate = useNavigate();

    const validate = () => {
        if (!newPassword.trim()) {
            return "Password is required.";
        }
        else if (newPassword.length < 12) {
            return "Password must be at least 12 characters.";
        }
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const res = await fetch("https://localhost:7245/api/Auth/resetPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-indigo-800 mb-2">
                    Reset Your Password
                </h2>
                <p className="text-center text-gray-600 text-sm mb-6">
                    Enter a new password to update your account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            placeholder="12+ characters"
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Update Password
                    </button>

                    {message && (
                        <p className="text-green-600 text-sm text-center mt-2">{message}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
