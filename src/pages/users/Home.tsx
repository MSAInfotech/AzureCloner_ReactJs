
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 text-gray-800 font-sans">
      {/* HERO SECTION */}
      <section
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: "url('/images/azure-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black flex items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Effortless Azure Environment Replication
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200">
              Simplify and accelerate your Azure infrastructure cloning — zero configuration, total control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Start Cloning
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        {[
          { title: "Discovery", desc: "Scan your Azure environment to identify components ready for replication." },
          { title: "Validation", desc: "Check configurations, policies, and dependencies before cloning." },
          { title: "One-Click Deployment", desc: "Launch fully configured Azure environments instantly with minimal effort." },
        ].map((item, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* PROTECT SECTION */}
      <section className="w-full bg-gradient-to-r from-orange-50 via-orange-100 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-800">Protect</h2>
            <h3 className="text-xl font-semibold text-gray-700">Total data governance</h3>
            <p className="text-gray-600 text-base md:text-lg">
              Build a secure, AI-ready Microsoft 365 environment without breaking a sweat.
            </p>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition">
              Discover Protect
            </button>
          </div>
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <img
              src="/images/protect-section.png"
              alt="Protect Section"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* AZURE CLONNER FEATURE SECTION */}
      <section className="w-full bg-gradient-to-r from-blue-100 via-indigo-50 to-violet-100 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="flex justify-center items-center">
            <img
              src="/images/azure-clonner-feature.png"
              alt="Azure Clonner Feature"
              className="w-full max-w-md md:max-w-lg h-auto object-contain"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800">Accelerate Your Azure Strategy</h2>
            <h3 className="text-xl font-semibold text-gray-700">Designed for DevOps and IT Teams</h3>
            <p className="text-gray-600 text-base md:text-lg">
              Azure Clonner helps you replicate entire Azure environments with precision, supporting faster development,
              streamlined testing, and effortless environment synchronization across regions or tenants.
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Clone resource groups and policies in one go</li>
              <li>Eliminate manual configuration errors</li>
              <li>Speed up environment provisioning</li>
            </ul>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Learn How It Works
            </button>
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="bg-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">Why Choose Azure Clonner?</h2>
          <p className="text-gray-700 mb-6">
            Azure Clonner simplifies the duplication of subscriptions, resource groups, services, permissions, and settings,
            enabling IT admins and DevOps teams to quickly replicate sandbox, test, or production environments without manual setup.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <strong className="text-blue-700">Secure & Compliant</strong>
              <p className="text-sm text-gray-600">We ensure full compliance with Azure RBAC and policy guidelines.</p>
            </li>
            <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <strong className="text-blue-700">Granular Control</strong>
              <p className="text-sm text-gray-600">Select and replicate only what you need — from entire subscriptions to individual services.</p>
            </li>
            <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <strong className="text-blue-700">Automated Scheduling</strong>
              <p className="text-sm text-gray-600">Plan regular cloning tasks with full visibility and logs.</p>
            </li>
            <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <strong className="text-blue-700">Scalable & Fast</strong>
              <p className="text-sm text-gray-600">Built to handle small teams or enterprise-wide environments without slowdowns.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* OUR CLIENTS */}
      <section className="bg-indigo-50 py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8">Our Clients</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-10 px-4 md:px-12 py-4 min-w-max">
            {["/images/partner1.png", "/images/partner2.png", "/images/partner3.png", "/images/partner4.png", "/images/partner5.png","/images/partner6.png","/images/partner7.png","/images/partner8.png","/images/partner9.png"].map(
              (src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Client ${idx + 1}`}
                  className="h-80 w-auto object-contain flex-shrink-0 grayscale-0 hover:grayscale transition"
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* TRUSTED REVIEWS */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8">Trusted to Just Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-50 p-6 rounded-xl shadow-md text-left">
            <p className="text-slate-700 italic">
              “Azure Clonner has revolutionized the way we manage Dev environments. Zero errors, seamless migrations.”
            </p>
            <p className="mt-4 text-slate-600 text-sm">— Priya Shah, Lead Cloud Architect</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl shadow-md text-left">
            <p className="text-slate-700 italic">
              “We cut our environment setup time from days to minutes. No scripts, just smooth UI workflows.”
            </p>
            <p className="mt-4 text-slate-600 text-sm">— James Kirk, Infrastructure Manager</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
