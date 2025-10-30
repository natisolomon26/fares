// src/components/Features.tsx
const features = [
  {
    title: "Member Directory",
    description: "Keep track of your congregation with profiles, families, and contact info.",
    icon: "👥",
  },
  {
    title: "Event Management",
    description: "Plan services, Bible studies, and community events with reminders.",
    icon: "📅",
  },
  {
    title: "Online Giving",
    description: "Secure donation tracking with reports and donor recognition.",
    icon: "💸",
  },
  {
    title: "Ministry Teams",
    description: "Coordinate volunteers, assign roles, and communicate easily.",
    icon: "🤝",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Everything Your Church Needs
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Built by church leaders, for church leaders — with love and simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-surface p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}