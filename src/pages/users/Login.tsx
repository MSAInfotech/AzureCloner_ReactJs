import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("https://localhost:7245/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token); // Store token
                alert(data.message);
                navigate("/admin/Home");
            } else {
                setError(data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1950&q=80')",
            }}
        >
            {/* Top left logo */}
            <div className="absolute top-4 left-4 sm:left-10 md:left-20 cursor-pointer z-10">
                <div
                    onClick={() => navigate("/")}
                    className="text-xl sm:text-2xl font-bold text-white hover:text-slate-200 transition"
                >
                    Azure Clonner
                </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-xl shadow-2xl max-w-md w-full space-y-6 z-10">
                <h2 className="text-3xl font-bold text-center text-indigo-800">Welcome Back</h2>
                <p className="text-center text-gray-600 text-sm">
                    Please enter your credentials to log in.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your business email"
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-indigo-600 hover:underline cursor-pointer"
                    >
                        Sign up
                    </span>
                </p>
                <p className="text-sm text-center text-gray-600">
                    Forgot password?{" "}
                    <span
                        onClick={() => navigate("/forgotPassword")}
                        className="text-indigo-600 hover:underline cursor-pointer"
                    >
                        Reset here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
