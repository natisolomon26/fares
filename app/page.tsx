// src/app/page.tsx
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Footer from "@/app/components/Footer";
import CtaSection from "./components/CtaSection";
import Testimonials from "./components/Testimonials";

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