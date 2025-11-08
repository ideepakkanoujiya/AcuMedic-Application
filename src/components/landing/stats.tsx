const stats = [
  { value: "10,000+", label: "Patients Helped" },
  { value: "98%", label: "Triage Accuracy" },
  { value: "200+", label: "Specialists Online" },
  { value: "24/7", label: "Service Availability" },
];

export default function Stats() {
  return (
    <section className="bg-muted/50 dark:bg-muted/20 py-12 sm:py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">{stat.value}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
