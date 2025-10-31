// src/components/CtaSection.tsx
export default function CtaSection() {
  return (
    <section className="py-16 bg-primary-50">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Honor Every Member’s Journey
        </h2>
        <p className="text-text-secondary mb-8">
          Start your free trial — manage members and leaving requests with grace, from day one.
        </p>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
          Create Your Church Account — Free
        </button>
        <p className="mt-4 text-sm text-text-secondary">
          No credit card needed. Set up in 5 minutes.
        </p>
      </div>
    </section>
  );
}