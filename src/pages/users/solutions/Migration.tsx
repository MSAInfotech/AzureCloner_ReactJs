import React from "react";

const Migration = () => {
    return (
        <section className="bg-slate-50 text-slate-800">
            <div className="w-full max-w-none mx-auto">
                {/* Hero */}
                <div className="text-center bg-gradient-to-r from-indigo-100 via-white to-indigo-100 py-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-4">
                        Azure Migration Made Simple
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-slate-700">
                        Migrate your Azure workloads confidently with Azure Clonner — preserving structure, services, and permissions with minimal effort.
                    </p>
                </div>

                {/* Migration Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-20 px-4 md:px-20">
                    <div>
                        <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
                            Full-Fidelity Migrations
                        </h3>
                        <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
                            <li>Retain ARM templates, tags, and configurations</li>
                            <li>Preserve RBAC and policy assignments</li>
                            <li>Migrate services like App Services, VNETs, Functions</li>
                            <li>Lift-and-shift or selectively migrate components</li>
                            <li>Clone across subscriptions, tenants, or regions</li>
                        </ul>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src="/images/azure-migration-architecture.png"
                            alt="Azure Migration Architecture"
                            className="w-full max-w-md rounded-xl shadow-lg object-contain"
                        />
                    </div>
                </div>

                {/* Image + Feature */}
                <div className="flex flex-col md:flex-row gap-12 items-center mt-20 px-4 md:px-20">
                    {/* TEXT FIRST */}
                    <div className="md:w-1/2">
                        <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
                            Migration Dashboard & Tracking
                        </h3>
                        <p className="text-slate-700 text-lg mb-3">
                            Visualize and control every step of your migration from a centralized dashboard.
                        </p>
                        <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
                            <li>Track real-time status of ongoing migrations</li>
                            <li>Audit logs for every operation</li>
                            <li>Rollback support and dry-run capability</li>
                        </ul>
                    </div>

                    {/* IMAGE SECOND */}
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="/images/migration-dashboard-preview.png"
                            alt="Migration Dashboard Preview"
                            className="w-full max-w-md rounded-xl shadow-lg object-contain"
                        />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-20 bg-gradient-to-r from-white via-indigo-50 to-white py-14">
                    <h3 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
                        Start Your Azure Migration Today
                    </h3>
                    <p className="text-slate-600 max-w-xl mx-auto mb-6">
                        Whether you're moving between regions or rebuilding environments — Azure Clonner ensures your cloud journey is frictionless.
                    </p>
                    <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
                        Begin Migration
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Migration;
