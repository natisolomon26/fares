// src/components/Hero.tsx
export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
          Organize Your <span className="text-primary-600">Church</span> with Purpose
        </h1>
        <p className="text-xl text-text-secondary mb-10">
          A simple, secure, and loving platform to manage members, events, donations, and ministries — so you can focus on your mission.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
            Start Free Trial
          </button>
          <button className="border border-text-secondary text-text-secondary hover:bg-surface px-8 py-3 rounded-lg font-medium text-lg transition-colors">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}