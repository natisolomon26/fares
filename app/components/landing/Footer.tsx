// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="container mx-auto px-4 text-center text-text-secondary">
        <p>© {new Date().getFullYear()} GraceChurchMS. Built with love for the Church.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="#" className="hover:text-primary-600">Privacy</a>
          <a href="#" className="hover:text-primary-600">Terms</a>
          <a href="#" className="hover:text-primary-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}