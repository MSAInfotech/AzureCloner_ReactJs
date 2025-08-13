const AzureClone = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-800 font-sans">
      {/* HERO */}
      <div className="text-center py-20 px-4 bg-gradient-to-r from-indigo-100 via-white to-indigo-100">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
          Azure Clone
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-slate-700">
          Effortlessly replicate your entire Azure infrastructure — from subscriptions and resource groups to policies and permissions — with just a few clicks.
        </p>
      </div>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">
            What You Can Clone
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
            <li>Azure Subscriptions and Management Groups</li>
            <li>Resource Groups, Policies, and Role Assignments</li>
            <li>App Services, Functions, Storage, Databases</li>
            <li>VNETs, NSGs, Load Balancers, and more</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/azure-clone-diagram.png"
            alt="Azure Clone Diagram"
            className="w-full max-w-lg rounded-xl shadow-lg object-contain"
          />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">
            Why Choose Azure Clonner?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-indigo-500 mb-2">Fast & Accurate</h3>
              <p className="text-sm text-slate-600">
                Skip manual setup with instant replication of resource configurations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-indigo-500 mb-2">Customizable Cloning</h3>
              <p className="text-sm text-slate-600">
                Select exactly what to clone — from full environments to specific services.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-indigo-500 mb-2">Secure & RBAC-Aligned</h3>
              <p className="text-sm text-slate-600">
                Permissions and policies are cloned with precision, preserving governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-white via-indigo-50 to-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
          Ready to Clone Your Azure Environment?
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-6">
          Get started in minutes with our intuitive interface — no scripts required.
        </p>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
          Start Free Trial
        </button>
      </section>
    </div>
  );
};

export default AzureClone;
