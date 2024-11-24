import { Map, Moon, StickyNote, Sun } from "lucide-react";
import { useState } from "react";
import LocationMap from "./Map";
import NotesManager from "./Notes";

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            MyApp
          </div>

          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab("map")}
              className={`
                inline-flex items-center px-4 py-2 rounded-md text-sm font-medium gap-2
                transition-colors duration-200
                ${
                  activeTab === "map"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }
              `}
            >
              <Map className="h-4 w-4" />
              Location Map
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`
                inline-flex items-center px-4 py-2 rounded-md text-sm font-medium gap-2
                transition-colors duration-200
                ${
                  activeTab === "notes"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }
              `}
            >
              <StickyNote className="h-4 w-4" />
              Notes
            </button>
          </nav>

          <button
            onClick={toggleDarkMode}
            className="relative h-9 w-9 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Sun className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

            <Moon className="absolute h-4 w-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="relative">
          <div
            className={`transition-opacity duration-300 ${
              activeTab === "map"
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            {activeTab === "map" && <LocationMap />}
          </div>
          <div
            className={`transition-opacity duration-300 ${
              activeTab === "notes"
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            {activeTab === "notes" && <NotesManager />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
