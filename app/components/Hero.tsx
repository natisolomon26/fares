// src/components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
          Care for Your Members —{" "}
          <span className="text-primary-600">From Welcome to Farewell</span>
        </h1>
        <p className="text-xl text-text-secondary mb-10">
          GraceChurchMS helps you manage your congregation with love — including respectful handling of transfer or exit requests.
        </p>

        {/* ✅ Only one button now — links to signup */}
        <Link
          href="/signup"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg"
        >
          Start Free Trial
        </Link>
      </div>
    </section>
  );
}