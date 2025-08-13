const ServiceSync = () => {
  return (
    <section className="bg-slate-50 text-slate-800 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-4">
            Seamless Service Synchronization
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-700">
            Azure Clonner's <strong>Service Sync</strong> ensures your environments stay aligned — mirroring critical Azure services, settings, and dependencies across tenants or subscriptions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/images/service-sync-illustration.png"
              alt="Service Sync Illustration"
              className="w-full max-w-lg rounded-xl shadow-lg object-contain"
            />
          </div>

          {/* Text Details */}
          <div>
            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
              What Gets Synced?
            </h3>
            <ul className="list-disc pl-6 space-y-3 text-slate-700 text-lg">
              <li>Azure App Services & Function Apps configurations</li>
              <li>Storage Accounts (including containers & policies)</li>
              <li>Key Vault settings & access policies</li>
              <li>Event Grid topics and subscriptions</li>
              <li>Service Bus namespaces, queues, and topics</li>
              <li>API Management settings & backends</li>
              <li>Identity settings including Managed Identities</li>
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h4 className="text-lg font-semibold text-indigo-500 mb-2">Consistent Environments</h4>
            <p className="text-sm text-slate-600">
              Ensure development, staging, and production environments remain perfectly aligned.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h4 className="text-lg font-semibold text-indigo-500 mb-2">Time-Saving Automation</h4>
            <p className="text-sm text-slate-600">
              Avoid manual service-by-service exports and copy operations — let Azure Clonner sync them all for you.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h4 className="text-lg font-semibold text-indigo-500 mb-2">Secure & Auditable</h4>
            <p className="text-sm text-slate-600">
              All service sync operations follow RBAC and can be logged for auditing and governance.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
            Keep Your Azure Services in Sync — Automatically
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            Eliminate drift and reduce configuration errors across environments with our intelligent Service Sync engine.
          </p>
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition">
            Try Service Sync
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceSync;
