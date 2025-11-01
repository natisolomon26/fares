// src/components/Features.tsx
const coreFeatures = [
  {
    title: "Member Management",
    description: "Maintain a living directory with profiles, family links, baptism dates, ministry involvement, and contact history.",
    icon: "👥",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Leaving Request System",
    description: "Receive, review, and respond to transfer or exit requests with dignity. Track status, add notes, and notify leaders.",
    icon: "🚪",
    color: "bg-green-100 text-green-700",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Built for What Matters Most
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Focus on shepherding — not spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {coreFeatures.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-surface p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${feature.color} mb-6 text-2xl`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">{feature.title}</h3>
              <p className="text-text-secondary text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}