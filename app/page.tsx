// src/app/page.tsx
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Footer from "@/app/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}