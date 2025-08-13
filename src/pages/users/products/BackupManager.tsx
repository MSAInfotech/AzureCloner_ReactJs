const BackupManager = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Hero Section */}
            <section className="w-full bg-gradient-to-r from-sky-50 via-white to-sky-100 text-slate-800 py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">Backup Manager</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-700">
                        Secure your Azure workloads with smart, scalable, and automated backup solutions — built for enterprise resilience.
                    </p>
                </div>
            </section>

            {/* Feature Overview Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-indigo-600">Why Use Backup Manager?</h2>
                    <p className="text-slate-700 text-lg">
                        Azure Clonner's Backup Manager gives you peace of mind with continuous protection, instant recovery, and full control over your data protection lifecycle.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600">
                        <li>One-click restores with granular retention options</li>
                        <li>End-to-end encryption and compliance coverage</li>
                        <li>Instant disaster recovery with geo-redundancy</li>
                        <li>Multi-tenant & multi-region backup policies</li>
                    </ul>
                </div>
                <div className="flex justify-center">
                    <img
                        src="/images/backup-dashboard.png"
                        alt="Backup Dashboard"
                        className="rounded-xl shadow-lg max-w-full h-auto border border-slate-200"
                    />
                </div>
            </section>

            {/* Smart Protection Section */}
            <section className="bg-indigo-100 py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-indigo-600">Seamless Azure-native Integration</h2>
                        <p className="text-slate-700 text-lg">
                            Automate protection across your Azure VMs, SQL databases, and more with built-in policies and tight integration with Backup Vaults and Azure Monitor.
                        </p>
                        <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
                            Start Free Trial
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src="/images/azure-backup-automation.png"
                            alt="Azure Backup Automation"
                            className="rounded-lg shadow-xl max-w-full h-auto border border-slate-200"
                        />
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-white text-center py-16 px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-indigo-600">Ready to Safeguard Your Azure Environment?</h2>
                    <p className="text-lg text-slate-700">
                        Get started with Azure Clonner's Backup Manager to automate, protect, and restore with confidence.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <button className="bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition">
                            Try Now
                        </button>
                        <button className="border border-slate-200 text-indigo-500 px-6 py-3 rounded-lg hover:bg-slate-100 transition">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BackupManager;
