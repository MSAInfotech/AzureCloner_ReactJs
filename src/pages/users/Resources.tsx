const Resources = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-800 font-sans">
            {/* HERO */}
            <div className="text-center py-20 px-4 bg-gradient-to-r from-indigo-100 via-white to-indigo-100">
                <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
                    Manage & Clone Azure Resources Seamlessly
                </h1>
                <p className="max-w-3xl mx-auto text-lg text-slate-700">
                    Azure Clonner provides granular control over your resource landscape — clone, customize, and replicate services across subscriptions, tenants, and regions effortlessly.
                </p>
            </div>

            {/* RESOURCE TYPES */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">
                        Supported Resource Types
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
                        <li>Virtual Machines, Scale Sets, and Availability Sets</li>
                        <li>App Services, Functions, and Logic Apps</li>
                        <li>Azure SQL, Cosmos DB, Blob & Table Storage</li>
                        <li>Resource Groups, Tags, and Policy Definitions</li>
                        <li>VNETs, NSGs, Load Balancers, VPN Gateways</li>
                        <li>Key Vaults, Managed Identities, Role Assignments</li>
                    </ul>
                </div>
                <div className="flex justify-center">
                    <img
                        src="/images/resources-diagram.png"
                        alt="Azure Resources Diagram"
                        className="w-full max-w-lg rounded-xl shadow-lg object-contain"
                    />
                </div>
            </section>

            {/* RESOURCE CAPABILITIES */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl mx-auto px-6 py-12 items-center">

                <div className="md:order-1">
                    <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">
                        Smart Resource Management
                    </h2>
                    <p className="text-slate-700 text-lg mb-4">
                        Gain fine-grained control over what resources are cloned, how they are structured, and how dependencies are handled during replication.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
                        <li>Selective cloning of individual services</li>
                        <li>Preserve or override tags, policies, and RBAC</li>
                        <li>Track resources through an intuitive dashboard</li>
                        <li>Support for resource dependencies and templates</li>
                    </ul>
                </div>
                <div className="flex justify-center md:order-2">
                    <img
                        src="/images/resource-management-dashboard.png"
                        alt="Resource Management Dashboard"
                        className="w-full max-w-lg rounded-xl shadow-lg object-contain"
                    />
                </div>
            </section>

            {/* BENEFITS */}
            <section className="bg-slate-50 py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-indigo-600 mb-8">
                        Why Azure Clonner for Resource Management?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                            <h3 className="text-lg font-semibold text-indigo-500 mb-2">Highly Granular</h3>
                            <p className="text-sm text-slate-600">
                                Control which resources to replicate and how they are provisioned.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                            <h3 className="text-lg font-semibold text-indigo-500 mb-2">Template-Driven</h3>
                            <p className="text-sm text-slate-600">
                                Use pre-configured or custom templates to maintain consistency and speed.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                            <h3 className="text-lg font-semibold text-indigo-500 mb-2">Cross-Region Ready</h3>
                            <p className="text-sm text-slate-600">
                                Clone resources across regions, subscriptions, or tenants with full context.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-gradient-to-r from-white via-indigo-50 to-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
                    Take Full Control of Your Azure Resources
                </h2>
                <p className="text-slate-600 max-w-xl mx-auto mb-6">
                    Use Azure Clonner to intelligently manage and replicate your critical cloud assets — effortlessly and securely.
                </p>
                <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
                    Start Managing Resources
                </button>
            </section>
        </div>
    );
};

export default Resources;
