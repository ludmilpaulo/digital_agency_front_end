"use client";

import { useEffect } from "react";

export default function CacheCleaner() {
  useEffect(() => {
    // Function to clear all caches and storage
    const clearAllCachesAndStorage = async () => {
      try {
        console.log("🧹 Starting cache and storage cleanup...");

        // Clear localStorage
        if (typeof window !== "undefined" && window.localStorage) {
          const itemsToKeep = ["auth_token", "user_data"]; // Keep authentication
          const allKeys = Object.keys(localStorage);
          
          allKeys.forEach(key => {
            if (!itemsToKeep.includes(key)) {
              localStorage.removeItem(key);
            }
          });
          console.log("✅ LocalStorage cleared (except auth)");
        }

        // Clear sessionStorage
        if (typeof window !== "undefined" && window.sessionStorage) {
          sessionStorage.clear();
          console.log("✅ SessionStorage cleared");
        }

        // Clear Service Worker caches
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => {
              // Don't delete Next.js build caches
              if (!cacheName.includes("next-static") && !cacheName.includes("webpack")) {
                return caches.delete(cacheName);
              }
            })
          );
          console.log("✅ Service Worker caches cleared");
        }

        // Clear IndexedDB (optional, be careful)
        if (window.indexedDB) {
          const databases = await window.indexedDB.databases?.();
          if (databases) {
            databases.forEach((db) => {
              if (db.name && !db.name.includes("firebase")) {
                window.indexedDB.deleteDatabase(db.name);
              }
            });
            console.log("✅ IndexedDB cleared");
          }
        }

        // Force reload of API data by clearing API cache
        if ("caches" in window) {
          const apiCaches = await caches.keys();
          await Promise.all(
            apiCaches.filter(name => name.includes("api") || name.includes("data")).map(name => caches.delete(name))
          );
        }

        console.log("✅ All caches and storage cleared successfully!");
        
        // Set a flag to prevent clearing on every page load
        sessionStorage.setItem("cache_cleared", "true");
        
      } catch (error) {
        console.error("❌ Error clearing caches:", error);
      }
    };

    // Only clear if not already cleared in this session
    const cacheCleared = sessionStorage.getItem("cache_cleared");
    
    if (!cacheCleared) {
      clearAllCachesAndStorage();
    } else {
      console.log("ℹ️ Cache already cleared in this session");
    }
  }, []);

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

