const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-800 font-sans">
      {/* HERO */}
      <div className="text-center py-20 px-4 bg-gradient-to-r from-indigo-100 via-white to-indigo-100">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
          Simple & Transparent Pricing
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-slate-700">
          Choose a plan that fits your Azure cloning needs. No hidden fees. No surprises.
        </p>
      </div>

      {/* PRICING TIERS */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold text-indigo-500 mb-2">Starter</h3>
          <p className="text-4xl font-bold text-indigo-600 mb-4">$29<span className="text-base font-normal">/month</span></p>
          <ul className="text-slate-700 text-sm space-y-3 mb-6">
            <li>Clone up to 5 resource groups</li>
            <li>Basic resource replication</li>
            <li>Single subscription support</li>
            <li>Email support</li>
          </ul>
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition">Get Started</button>
        </div>

        {/* Professional Plan */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-md text-center scale-105">
          <h3 className="text-xl font-semibold text-indigo-500 mb-2">Professional</h3>
          <p className="text-4xl font-bold text-indigo-600 mb-4">$89<span className="text-base font-normal">/month</span></p>
          <ul className="text-slate-700 text-sm space-y-3 mb-6">
            <li>Unlimited resource groups</li>
            <li>Cross-subscription cloning</li>
            <li>Service-level cloning & RBAC</li>
            <li>Email + chat support</li>
          </ul>
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition">Try Professional</button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold text-indigo-500 mb-2">Enterprise</h3>
          <p className="text-4xl font-bold text-indigo-600 mb-4">Custom</p>
          <ul className="text-slate-700 text-sm space-y-3 mb-6">
            <li>Multi-tenant & region support</li>
            <li>Dedicated migration engineers</li>
            <li>Audit logging, tracking & compliance</li>
            <li>24/7 enterprise support</li>
          </ul>
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition">Contact Sales</button>
        </div>
      </section>

      {/* IMAGE SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">
            Built for Every Stage of Your Azure Journey
          </h2>
          <p className="text-slate-700 text-lg mb-4">
            Whether you're starting small or scaling globally, Azure Clonner adapts to your needs.
            Upgrade anytime with seamless transitions between plans.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-base">
            <li>Flexible billing with monthly or annual options</li>
            <li>Discounts for startups and education</li>
            <li>Cancel anytime — no long-term contracts</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/pricing-azure-clone-dashboard.png"
            alt="Azure Pricing Dashboard"
            className="w-full max-w-md rounded-xl shadow-lg object-contain"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-white via-indigo-50 to-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
          Choose a Plan & Start Cloning Today
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-6">
          Get started in minutes. Enjoy full transparency and powerful Azure replication features at your fingertips.
        </p>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
          View Plans
        </button>
      </section>
    </div>
  );
};

export default Pricing;
