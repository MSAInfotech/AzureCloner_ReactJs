import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AccountActivate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid activation link.");
      return;
    }

    const activateAccount = async () => {
      try {
        const response = await fetch(`https://localhost:7245/api/Auth/activate?token=${encodeURIComponent(token)}`);

        if (response.ok) {
          const result = await response.text();
          setStatus("success");
          setMessage(result || "Account activated successfully.");
        } else {
          const error = await response.json();
          setStatus("error");
          setMessage(error.message || "Activation failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong.");
        console.error(err);
      }
    };

    activateAccount();
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        {status === "loading" && <p className="text-blue-600 font-medium">Activating your account...</p>}
        {status === "success" && (
          <>
            <p className="text-green-600 font-semibold mb-4">{message}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-red-600 font-semibold">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountActivate;
