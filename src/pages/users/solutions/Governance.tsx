const Goverance = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-800 font-sans">
      {/* HERO */}
      <div className="text-center py-20 px-4 bg-gradient-to-r from-indigo-100 via-white to-indigo-100">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
          Governance Built Into Every Clone
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-slate-700">
          Azure Clonner ensures every replicated environment adheres to your organizational standards — from policy enforcement to RBAC alignment and auditing.
        </p>
      </div>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">
            Enforce Compliance at Every Step
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
            <li>Automatic application of Azure Policy and Blueprints</li>
            <li>Built-in RBAC hierarchy preservation</li>
            <li>Tagging standards enforced across cloned resources</li>
            <li>Activity and compliance logs for audit readiness</li>
            <li>Consistent naming conventions and region control</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/governance-overview.png"
            alt="Governance Overview"
            className="w-full max-w-lg rounded-xl shadow-lg object-contain"
          />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">
            Governance You Can Trust
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-indigo-500 mb-2">Policy-First Cloning</h3>
              <p className="text-sm text-slate-600">
                Automatically apply policies and ensure governance from the start — no post-deployment fixes needed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-indigo-500 mb-2">Audit-Friendly Design</h3>
              <p className="text-sm text-slate-600">
                Every action, assignment, and configuration is logged — making compliance checks seamless and transparent.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-indigo-500 mb-2">RBAC Consistency</h3>
              <p className="text-sm text-slate-600">
                Preserve original permission sets and role inheritance to maintain security posture without manual intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-white via-indigo-50 to-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
          Secure and Governed Azure Cloning Starts Now
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-6">
          Get full visibility and control over your cloud environments — without compromising on compliance or security.
        </p>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
          Explore Governance Tools
        </button>
      </section>
    </div>
  );
};

export default Goverance;
