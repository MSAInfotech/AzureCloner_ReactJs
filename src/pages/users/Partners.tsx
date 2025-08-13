import React from "react";

const Partners = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-sky-100 text-slate-800 font-sans">
      {/* HERO */}
      <div className="text-center py-20 px-4 bg-gradient-to-r from-indigo-100 via-white to-indigo-100">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
          Trusted by Partners Worldwide
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-slate-700">
          Azure Clonner collaborates with industry-leading cloud consultancies, resellers, and service integrators to deliver scalable infrastructure replication across the globe.
        </p>
      </div>

      {/* PARTNER BENEFITS */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">
            Why Partner with Azure Clonner?
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
            <li>Offer powerful cloud migration & cloning tools to your clients</li>
            <li>Access exclusive training, technical support & marketing assets</li>
            <li>Boost recurring revenue with our flexible partnership tiers</li>
            <li>Collaborate on enterprise deals & co-sell opportunities</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/azure-partners-network.png"
            alt="Azure Partners Network"
            className="w-full max-w-lg rounded-xl shadow-lg object-contain"
          />
        </div>
      </section>

      {/* LOGO GRID */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8">
            Meet Some of Our Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <img src="/images/partner1.png" alt="Partner 1" className="mx-auto object-contain" />
            <img src="/images/partner2.png" alt="Partner 2" className="mx-auto object-contain" />
            <img src="/images/partner3.png" alt="Partner 3" className="mx-auto object-contain" />
            <img src="/images/partner4.png" alt="Partner 4" className="mx-auto object-contain" />
          </div>
        </div>
      </section>

      {/* PARTNER PROGRAM */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="md:order-1">
          <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">
            Scalable Partner Program
          </h2>
          <p className="text-slate-700 text-lg mb-4">
            Our partner framework grows with your business — from consultants to global integrators.
          </p>
          <ul className="list-disc pl-5 space-y-3 text-slate-700 text-lg">
            <li>Reseller, Referral, and White-Label Options</li>
            <li>Priority support & dedicated success manager</li>
            <li>Real-time usage tracking & client insights</li>
          </ul>
        </div>
        <div className="flex justify-center md:order-2">
          <img
            src="/images/partner-program-dashboard.png"
            alt="Partner Program Dashboard"
            className="w-full max-w-lg rounded-xl shadow-lg object-contain"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-white via-indigo-50 to-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
          Become an Azure Clonner Partner
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-6">
          Let’s build cloud solutions together. Join our global partner ecosystem and unlock powerful Azure migration capabilities for your clients.
        </p>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
          Apply Now
        </button>
      </section>
    </div>
  );
};

export default Partners;
