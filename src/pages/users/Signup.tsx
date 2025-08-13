import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        notifications: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First Name is required.";
        if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format.";
        if (formData.password.length < 12) newErrors.password = "Password must be at least 12 characters.";
        if (!formData.phone) newErrors.phone = "Phone number is required.";
        if (!formData.role) newErrors.role = "Please select a role.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch("https://localhost:7245/api/Auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! Please check your email to activate your account.");
                navigate("/login");
            } else {
                if (data?.message) {
                    setErrors({ email: data.message });
                } else {
                    alert("Registration failed.");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-sky-100 relative">
            {/* Top left logo */}
            <div className="absolute top-4 left-4 sm:left-10 md:left-20 cursor-pointer z-10">
                <div
                    onClick={() => navigate("/")}
                    className="text-xl sm:text-2xl font-bold text-blue-700 md:text-white hover:text-white transition"
                >
                    Azure Clonner
                </div>
            </div>

            {/* Left Side */}
            <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
                <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Azure Clonner</h1>
                <p className="text-lg text-center">
                    Start your journey with secure and effortless cloud replication.
                </p>
                <img
                    src="/images/azure-clonner-feature.png"
                    alt="Azure Feature"
                    className="mt-8 w-3/4 max-w-md rounded-lg shadow-xl"
                />
            </div>

            {/* Signup Form */}
            <div className="flex flex-1 items-center justify-center px-4 py-10">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 sm:p-8 space-y-6"
                >
                    <h2 className="text-2xl font-bold text-center text-indigo-700">Create Your Account</h2>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            placeholder="John"
                            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            placeholder="Doe"
                            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Email</label>
                        <input
                            type="email"
                            placeholder="john.doe@example.com"
                            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="12+ characters"
                            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="mt-1">
                            <PhoneInput
                                country="in"
                                value={formData.phone}
                                onChange={(phone: string) => setFormData({ ...formData, phone })}
                                inputClass="!w-full !py-2 !pl-12 !pr-3 !border !rounded-md !border-gray-300 !focus:outline-none !focus:ring-2 !focus:ring-indigo-500"
                                containerClass="w-full"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="">Select Role</option>
                            <option value="IT Admin">IT Admin</option>
                            <option value="Consultant">Consultant</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="notifications"
                            className="mr-2"
                            checked={formData.notifications}
                            onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                        />
                        <label htmlFor="notifications" className="text-sm text-gray-700">
                            I want to receive future notifications.
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Sign Up
                    </button>

                    {/* Already have an account */}
                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-indigo-600 hover:underline cursor-pointer"
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
