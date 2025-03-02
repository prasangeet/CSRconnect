"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function SDGPage() {
  const data = {
    sdgs: Array.from({ length: 17 }, (_, i) => ({
      id: i + 1,
      name: getSDGName(i + 1),
      picture: `/sdgs/image${i + 1}.png`,
      route: `/dashboard/sdgs/${i + 1}?name=${getSDGName(i + 1)}`, // Pass name & number
      color: getSDGColor(i + 1),
      hoverColor: getSDGHoverColor(i + 1),
    })),
  };

  function getSDGName(id) {
    const sdgNames = [
      "No Poverty", "Zero Hunger", "Good Health and Well-being", "Quality Education",
      "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy",
      "Decent Work and Economic Growth", "Industry, Innovation and Infrastructure",
      "Reduced Inequalities", "Sustainable Cities and Communities",
      "Responsible Consumption and Production", "Climate Action",
      "Life Below Water", "Life on Land", "Peace, Justice, and Strong Institutions",
      "Partnerships for the Goals",
    ];
    return sdgNames[id - 1] || `SDG ${id}`;
  }

  function getSDGColor(id) {
    // Solid SDG colors
    const colors = [
      "bg-red-600",      // SDG 1
      "bg-yellow-500",   // SDG 2
      "bg-green-500",    // SDG 3
      "bg-red-400",      // SDG 4
      "bg-red-600",      // SDG 5
      "bg-blue-400",     // SDG 6
      "bg-yellow-400",   // SDG 7
      "bg-red-500",      // SDG 8
      "bg-orange-500",   // SDG 9
      "bg-pink-500",     // SDG 10
      "bg-orange-400",   // SDG 11
      "bg-amber-600",    // SDG 12
      "bg-green-600",    // SDG 13
      "bg-blue-600",     // SDG 14
      "bg-green-500",    // SDG 15
      "bg-blue-700",     // SDG 16
      "bg-blue-500",     // SDG 17
    ];
    return colors[id - 1] || "bg-slate-500";
  }

  function getSDGHoverColor(id) {
    // Hover colors (slightly darker)
    const colors = [
      "group-hover:bg-red-700",      // SDG 1
      "group-hover:bg-yellow-600",   // SDG 2
      "group-hover:bg-green-600",    // SDG 3
      "group-hover:bg-red-500",      // SDG 4
      "group-hover:bg-red-700",      // SDG 5
      "group-hover:bg-blue-500",     // SDG 6
      "group-hover:bg-yellow-500",   // SDG 7
      "group-hover:bg-red-600",      // SDG 8
      "group-hover:bg-orange-600",   // SDG 9
      "group-hover:bg-pink-600",     // SDG 10
      "group-hover:bg-orange-500",   // SDG 11
      "group-hover:bg-amber-700",    // SDG 12
      "group-hover:bg-green-700",    // SDG 13
      "group-hover:bg-blue-700",     // SDG 14
      "group-hover:bg-green-600",    // SDG 15
      "group-hover:bg-blue-800",     // SDG 16
      "group-hover:bg-blue-600",     // SDG 17
    ];
    return colors[id - 1] || "group-hover:bg-slate-600";
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Sustainable Development Goals
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The 17 SDGs are integrated—action in one area will affect outcomes in others, and development must balance social, economic and environmental sustainability.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
          {data.sdgs.map((sdg) => (
            <Link key={sdg.id} href={sdg.route} className="block">
              <div className="group h-full bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-border">
                <div className={`h-2 ${sdg.color} transition-colors duration-300 ${sdg.hoverColor}`}></div>
                <div className="p-4 flex flex-col items-center h-full">
                  <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                    <Image
                      src={sdg.picture || "/placeholder.svg"}
                      alt={sdg.name}
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className={`absolute top-1 left-1 ${sdg.color} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-colors duration-300 ${sdg.hoverColor}`}>
                      {sdg.id}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-center line-clamp-2 flex-grow text-card-foreground">
                    {sdg.name}
                  </h3>
                  <div className="mt-3 w-full">
                    <span className={`block text-xs text-center py-1.5 px-2 rounded-md ${sdg.color} text-white font-medium transition-colors duration-300 ${sdg.hoverColor}`}>
                      View Projects
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SDGPage;