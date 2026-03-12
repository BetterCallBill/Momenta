import Link from "next/link";

const sections = [
  { href: "/admin/events", label: "Events", description: "Create and manage events" },
  { href: "/admin/registrations", label: "Registrations", description: "View sign-ups and export Excel" },
  { href: "/admin/gallery", label: "Gallery", description: "Add or remove photos and videos" },
  { href: "/admin/sponsors", label: "Sponsors", description: "Manage partner organisations" },
  { href: "/admin/team", label: "Team", description: "Edit team member profiles" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-neutral-400 mb-8">Welcome to the Momenta admin panel.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="bg-neutral-900 border border-neutral-800 hover:border-gold-500/50 rounded-xl p-5 transition-colors group"
          >
            <p className="font-semibold text-white group-hover:text-gold-400 transition-colors">
              {label}
            </p>
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
