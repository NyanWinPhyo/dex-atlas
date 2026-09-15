import { createBrowserRouter } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { PokedexPage } from "../pages/PokedexPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,

    children: [
      {
        index: true,
        Component: DashboardPage,
      },

      {
        path: "pokedex",
        Component: PokedexPage,
      },

      {
        path: "team",
        element: (
          <PlaceholderPage
            title="Team Builder"
            description="Build a team of up to six Pokémon and analyse its strengths, weaknesses and coverage."
          />
        ),
      },

      {
        path: "collection",
        element: (
          <PlaceholderPage
            title="My Collection"
            description="Track caught Pokémon, Shinies, Alpha Pokémon, favourites and your personal collection."
          />
        ),
      },

      {
        path: "zones",
        element: (
          <PlaceholderPage
            title="Wild Zones"
            description="Explore Wild Zones, encounter data and personal completion progress."
          />
        ),
      },

      {
        path: "types",
        element: (
          <PlaceholderPage
            title="Type Matchups"
            description="Quickly calculate weaknesses, resistances, immunities and offensive effectiveness."
          />
        ),
      },

      {
        path: "settings",
        element: (
          <PlaceholderPage
            title="Settings"
            description="Application preferences, save management, import and export will live here."
          />
        ),
      },

      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);