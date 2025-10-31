// src/components/Testimonials.tsx
const testimonials = [
  {
    name: "Pastor Daniel",
    church: "New Life Assembly",
    quote: "When families move or transfer, we used to lose track. Now every exit request is documented with care — and we stay connected.",
  },
  {
    name: "Admin Team, Cornerstone Church",
    church: "",
    quote: "Managing 1,200+ members felt chaotic. GraceChurchMS gave us clarity — especially during transitions.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary">Churches Trust Us With Their Flock</h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-text-secondary italic mb-4">“{t.quote}”</p>
              <p className="font-semibold text-text-primary">{t.name}</p>
              {t.church && <p className="text-text-secondary text-sm">{t.church}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}