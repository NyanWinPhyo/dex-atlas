import {
  ArrowRight,
  Boxes,
  Compass,
  Search,
  Sparkles,
  Star,
  Swords,
} from "lucide-react";

import { Link } from "react-router";

const stats = [
  {
    label: "Pokémon Caught",
    value: "0",
    icon: Boxes,
  },
  {
    label: "Shinies",
    value: "0",
    icon: Sparkles,
  },
  {
    label: "Alpha Pokémon",
    value: "0",
    icon: Star,
  },
  {
    label: "Current Team",
    value: "0 / 6",
    icon: Swords,
  },
];

const quickActions = [
  {
    title: "Browse Pokédex",
    description: "Search Pokémon and view detailed information.",
    path: "/pokedex",
    icon: Search,
  },
  {
    title: "Build a Team",
    description: "Create and analyse a six-Pokémon team.",
    path: "/team",
    icon: Swords,
  },
  {
    title: "Explore Wild Zones",
    description: "Track encounters and zone completion.",
    path: "/zones",
    icon: Compass,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-cyan-300">
          Pokémon Legends: Z-A Companion
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Welcome to Lumiose
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Track your adventure, explore Pokémon data, plan your team and quickly
          check the information you need while playing.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Icon size={20} />
                </div>

                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                {stat.label}
              </p>
            </article>
          );
        })}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          Quick actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Jump directly to the tools you'll use most often.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.path}
                to={action.path}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.055]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Icon size={21} />
                </div>

                <h3 className="mt-5 font-semibold text-white">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {action.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-cyan-300">
                  Open
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}