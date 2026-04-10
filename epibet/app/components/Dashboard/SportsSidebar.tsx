"use client";

import { 
  Trophy, 
  Target as Tennis,
  Layout as AllIcon
} from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "Tous les sports", icon: AllIcon },
  { id: "Football", name: "Football", icon: Trophy },
  { id: "Tennis", name: "Tennis", icon: Tennis },
];

interface SportsSidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function SportsSidebar({ activeCategory, onSelectCategory }: SportsSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-1">
        <h3 className="px-4 mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
          Sports
        </h3>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-epitech-blue text-white shadow-lg shadow-epitech-blue/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-epitech-blue transition-colors"}`} />
              <span className="text-sm font-semibold">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
