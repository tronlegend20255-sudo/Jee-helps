import { ExternalLink, Youtube } from 'lucide-react';

const channels = [
  {
    name: "Physics Wallah - Alakh Pandey",
    subject: "All Subjects",
    description: "India's top educational channel for JEE preparation. Comprehensive lectures, motivation, and problem-solving.",
    url: "https://www.youtube.com/c/PhysicsWallah",
    color: "bg-orange-100 text-orange-700"
  },
  {
    name: "MathonGo",
    subject: "Mathematics",
    description: "Best channel for JEE Mathematics. Provides detailed analysis, shortcuts, and high-quality mock tests.",
    url: "https://www.youtube.com/c/MathonGo",
    color: "bg-blue-100 text-blue-700"
  },
  {
    name: "Mohit Tyagi",
    subject: "All Subjects",
    description: "Kota-style detailed lectures. Extremely thorough and complete syllabus coverage for JEE Advanced.",
    url: "https://www.youtube.com/c/MohitTyagi",
    color: "bg-indigo-100 text-indigo-700"
  },
  {
    name: "Unacademy JEE",
    subject: "All Subjects",
    description: "Live interactive classes, quick revisions, and strategy sessions from top educators.",
    url: "https://www.youtube.com/c/UnacademyJEE",
    color: "bg-green-100 text-green-700"
  },
  {
    name: "Physics Galaxy",
    subject: "Physics",
    description: "Concept videos and advanced illustrations by Ashish Arora sir. Highly recommended for JEE Advanced Physics.",
    url: "https://www.youtube.com/c/PhysicsGalaxy",
    color: "bg-purple-100 text-purple-700"
  },
  {
    name: "DexterChem",
    subject: "Chemistry",
    description: "Detailed Chemistry concepts and problem-solving strategies for JEE.",
    url: "https://www.youtube.com/channel/UC... (Search DexterChem)",
    color: "bg-emerald-100 text-emerald-700"
  }
];

export default function Dashboard() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Top JEE Channels</h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Curated list of the best YouTube channels dedicated to JEE Mains & Advanced preparation. Ensure you follow a structured path rather than wandering randomly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {channels.map((channel, idx) => (
          <a
            key={idx}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${channel.color}`}>
                {channel.subject}
              </div>
              <ExternalLink size={18} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Youtube className="text-red-600" size={24} />
              {channel.name}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {channel.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
