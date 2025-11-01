// src/components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-bold text-text-primary">
            GraceChurch<span className="text-primary-500">MS</span>
          </span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="#features" className="text-text-secondary hover:text-primary-600 font-medium">
            Features
          </Link>
          <Link href="#testimonials" className="text-text-secondary hover:text-primary-600 font-medium">
            Stories
          </Link>
          <Link href="/contact" className="text-text-secondary hover:text-primary-600 font-medium">
            Contact
          </Link>
        </nav>

        {/* ✅ Updated: Link to /login */}
        <Link 
          href="/login" 
          className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}