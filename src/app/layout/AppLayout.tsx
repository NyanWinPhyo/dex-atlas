import {
  BookOpen,
  Boxes,
  CircleGauge,
  Compass,
  Grid2X2,
  Search,
  Settings,
  Shield,
  Swords,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router";

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    path: "/",
    icon: CircleGauge,
  },
  {
    label: "Pokédex",
    path: "/pokedex",
    icon: BookOpen,
  },
  {
    label: "Team",
    path: "/team",
    icon: Swords,
  },
  {
    label: "Collection",
    path: "/collection",
    icon: Boxes,
  },
  {
    label: "Wild Zones",
    path: "/zones",
    icon: Compass,
  },
  {
    label: "Types",
    path: "/types",
    icon: Grid2X2,
  },
];

const mobileNavigationItems = navigationItems.slice(0, 5);

function DesktopNavigation() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0b101b] lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950 shadow-lg shadow-cyan-400/20">
            LF
          </div>

          <div>
            <p className="font-semibold tracking-tight text-white">
              Lumiose
            </p>

            <p className="text-xs text-slate-400">
              Field Guide
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
              isActive
                ? "bg-cyan-400/10 text-cyan-300"
                : "text-slate-400 hover:bg-white/5 hover:text-white",
            ].join(" ")
          }
        >
          <Settings size={19} />
          Settings
        </NavLink>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Shield size={14} className="text-emerald-400" />
            Local save
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Your gameplay data will stay on this device during the MVP.
          </p>
        </div>
      </div>
    </aside>
  );
}

function MobileNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b101b]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {mobileNavigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex min-w-16 flex-col items-center gap-1 px-2 py-3 text-[11px] font-medium transition",
                  isActive ? "text-cyan-300" : "text-slate-500",
                ].join(" ")
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100">
      <DesktopNavigation />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080b12]/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-sm font-black text-slate-950">
                LF
              </div>

              <span className="hidden font-semibold sm:inline">
                Lumiose Field Guide
              </span>
            </div>

            <div className="ml-auto flex w-full max-w-md items-center">
              <div className="relative w-full">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="search"
                  readOnly
                  placeholder="Search Pokémon..."
                  aria-label="Search Pokémon"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}