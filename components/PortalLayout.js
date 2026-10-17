"use client";

import React, { useState, Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function PortalLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex">
      <Suspense
        fallback={
          <aside className="fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-gray-200/80 hidden lg:block" />
        }
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Suspense
          fallback={
            <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200/80" />
          }
        >
          <Header onOpenSidebar={() => setSidebarOpen(true)} title={title} />
        </Suspense>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
