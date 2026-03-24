"use client";

type Drifter = {
  id: string;
  name: string;
  avatar: string;
};

const NEARBY_DRIFTERS: Drifter[] = [
  { id: "1", name: "Nova", avatar: "https://i.pravatar.cc/150?u=Nova" },
  { id: "2", name: "Kai", avatar: "https://i.pravatar.cc/150?u=Kai" },
  { id: "3", name: "Raine", avatar: "https://i.pravatar.cc/150?u=Raine" },
  { id: "4", name: "Zephyr", avatar: "https://i.pravatar.cc/150?u=Zephyr" },
  { id: "5", name: "Sol", avatar: "https://i.pravatar.cc/150?u=Sol" },
];

export default function DriftersNearby() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Drifters Nearby</h2>
        <span className="bg-[#1f1f22] text-purple-400 text-xs px-1.5 py-0.5 rounded">12</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {NEARBY_DRIFTERS.map((drifter) => (
          <div key={drifter.id} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-purple-500/20 to-transparent group-hover:from-purple-500 group-hover:to-indigo-500 transition-all">
                <img
                src={drifter.avatar}
                alt={drifter.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#0a0a0a]"
                />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{drifter.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
