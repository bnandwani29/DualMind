import Welcome from "./pages/Welcome";
import Calibration from "./pages/Calibration";
import Dashboard from "./pages/Dashboard";
import FocusSession from "./pages/FocusSession";
import Tasks from "./pages/Tasks";
import AdaptiveQueue from "./pages/AdaptiveQueue";
import BreakSuggestion from "./pages/BreakSuggestion";
import Breather from "./pages/Breather";
import AmbientMode from "./pages/AmbientMode";
import Analytics from "./pages/Analytics";
import Groups from "./pages/Groups";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";

export const routes = [
  { path: "/welcome", label: "Welcome", element: <Welcome /> },
  { path: "/calibration", label: "Calibration", element: <Calibration /> },
  { path: "/dashboard", label: "Dashboard", element: <Dashboard /> },
  { path: "/focus", label: "Focus Session", element: <FocusSession /> },
  { path: "/tasks", label: "Tasks", element: <Tasks /> },
  { path: "/queue", label: "Adaptive Queue", element: <AdaptiveQueue /> },
  {
    path: "/break-suggestion",
    label: "Break Suggestion",
    element: <BreakSuggestion />,
  },
  { path: "/breather", label: "Breather", element: <Breather /> },
  { path: "/ambient", label: "Ambient Mode", element: <AmbientMode /> },
  { path: "/analytics", label: "Analytics", element: <Analytics /> },
  { path: "/groups", label: "Groups", element: <Groups /> },
  { path: "/achievements", label: "Achievements", element: <Achievements /> },
  { path: "/settings", label: "Settings", element: <Settings /> },
];
