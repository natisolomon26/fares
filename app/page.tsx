// src/app/page.tsx
import Header from "@/app/components/landing/Header";
import Hero from "@/app/components/landing/Hero";
import Features from "@/app/components/landing/Features";
import Footer from "@/app/components/landing/Footer";
import CtaSection from "./components/landing/CtaSection";
import Testimonials from "./components/landing/Testimonials";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CtaSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}