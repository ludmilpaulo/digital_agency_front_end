"use client";

import { useEffect } from "react";

export default function CacheCleaner() {
  useEffect(() => {
    // Function to aggressively clear all caches and storage on every reload
    const clearAllCachesAndStorage = async () => {
      try {
        console.log("🧹 Clearing all browser cache and storage...");

        // 1. Clear ALL localStorage (including auth - user will need to re-login)
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.clear();
          console.log("✅ LocalStorage completely cleared");
        }

        // 2. Clear ALL sessionStorage
        if (typeof window !== "undefined" && window.sessionStorage) {
          sessionStorage.clear();
          console.log("✅ SessionStorage completely cleared");
        }

        // 3. Clear ALL Service Worker caches
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
          console.log("✅ All Service Worker caches cleared");
        }

        // 4. Clear ALL IndexedDB databases
        if (window.indexedDB && window.indexedDB.databases) {
          try {
            const databases = await window.indexedDB.databases();
            if (databases) {
              await Promise.all(
                databases.map((db) => {
                  if (db.name) {
                    return new Promise((resolve) => {
                      const deleteRequest = window.indexedDB.deleteDatabase(db.name as string);
                      deleteRequest.onsuccess = () => resolve(true);
                      deleteRequest.onerror = () => resolve(false);
                      deleteRequest.onblocked = () => resolve(false);
                    });
                  }
                  return Promise.resolve(true);
                })
              );
              console.log("✅ All IndexedDB databases cleared");
            }
          } catch (err) {
            console.log("ℹ️ IndexedDB clear skipped:", err);
          }
        }

        // 5. Clear cookies (except essential ones)
        if (typeof document !== "undefined") {
          const cookies = document.cookie.split(";");
          cookies.forEach((cookie) => {
            const cookieName = cookie.split("=")[0].trim();
            // Don't clear essential Next.js cookies
            if (!cookieName.startsWith("__") && !cookieName.includes("session")) {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
          });
          console.log("✅ Non-essential cookies cleared");
        }

        // 6. Clear browser cache (if supported)
        if ("storage" in navigator && "estimate" in navigator.storage) {
          try {
            const estimate = await navigator.storage.estimate();
            console.log(`📊 Storage before clear: ${(estimate.usage! / 1024 / 1024).toFixed(2)} MB`);
          } catch (err) {
            console.log("ℹ️ Storage estimate not available");
          }
        }

        // 7. Unregister service workers (force fresh install)
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => registration.unregister())
          );
          console.log("✅ Service workers unregistered");
        }

        // 8. Clear extension storage (if accessible)
        // Note: This only works if the app has permissions
        if (typeof window !== "undefined" && (window as any).chrome?.storage) {
          try {
            await (window as any).chrome.storage.local.clear();
            await (window as any).chrome.storage.sync.clear();
            console.log("✅ Extension storage cleared");
          } catch (err) {
            console.log("ℹ️ Extension storage not accessible (normal for web apps)");
          }
        }

        console.log("✅ Complete cache and storage cleanup finished!");
        console.log("🔄 Page will always load fresh content");
        
      } catch (error) {
        console.error("❌ Error during cleanup:", error);
      }
    };

    // Clear on EVERY page load/reload
    clearAllCachesAndStorage();

    // Also clear before page unload (for next reload)
    const handleBeforeUnload = () => {
      console.log("🔄 Preparing for page reload - clearing caches...");
      // Synchronous clears for unload event
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (err) {
          console.log("Error clearing on unload:", err);
        }
      }
    };

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("👁️ Page became visible - clearing caches");
        clearAllCachesAndStorage();
      }
    };

    // Listen for storage events (other tabs/windows)
    const handleStorageChange = () => {
      console.log("🔄 Storage changed - ensuring clean state");
      clearAllCachesAndStorage();
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);

    // Also clear on focus (when user returns to tab)
    const handleFocus = () => {
      console.log("🎯 Window focused - clearing caches");
      clearAllCachesAndStorage();
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup all listeners on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []); // Runs once on component mount, but listeners trigger on events

  return null; // This component doesn't render anything
}

// Alternative: Clear on specific events
export function ClearCacheButton() {
  const handleClearCache = async () => {
    try {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear cookies (optional)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      alert("✅ Cache cleared! Page will reload.");
      window.location.reload();
    } catch (error) {
      console.error("Error clearing cache:", error);
      alert("❌ Failed to clear cache");
    }
  };

  return (
    <button
      onClick={handleClearCache}
      className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors text-sm font-medium z-50"
      title="Clear Cache & Reload"
    >
      🧹 Clear Cache
    </button>
  );
}

