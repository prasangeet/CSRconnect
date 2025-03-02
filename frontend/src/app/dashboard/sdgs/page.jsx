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
    // Official SDG colors
    const colors = [
      "from-red-500 to-red-600",         // SDG 1
      "from-yellow-500 to-yellow-600",   // SDG 2
      "from-green-500 to-green-600",     // SDG 3
      "from-red-400 to-red-500",         // SDG 4
      "from-red-600 to-red-700",         // SDG 5
      "from-blue-400 to-blue-500",       // SDG 6
      "from-yellow-400 to-yellow-500",   // SDG 7
      "from-red-500 to-red-600",         // SDG 8
      "from-orange-500 to-orange-600",   // SDG 9
      "from-pink-500 to-pink-600",       // SDG 10
      "from-orange-400 to-orange-500",   // SDG 11
      "from-amber-600 to-amber-700",     // SDG 12
      "from-green-600 to-green-700",     // SDG 13
      "from-blue-600 to-blue-700",       // SDG 14
      "from-green-500 to-green-600",     // SDG 15
      "from-blue-700 to-blue-800",       // SDG 16
      "from-blue-500 to-blue-600",       // SDG 17
    ];
    return colors[id - 1] || "from-gray-500 to-gray-600";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
            Sustainable Development Goals
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The 17 SDGs are integrated—action in one area will affect outcomes in others, and development must balance social, economic and environmental sustainability.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
          {data.sdgs.map((sdg) => (
            <Link key={sdg.id} href={sdg.route} className="block">
              <div className="group h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${sdg.color}`}></div>
                <div className="p-4 flex flex-col items-center h-full">
                  <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                    <Image
                      src={sdg.picture || "/placeholder.svg"}
                      alt={sdg.name}
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-1 left-1 bg-white/90 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {sdg.id}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-center line-clamp-2 flex-grow">
                    {sdg.name}
                  </h3>
                  <div className="mt-2 w-full">
                    <span className="block text-xs text-center py-1 px-2 rounded-full bg-gradient-to-r from-blue-700 to-teal-500 text-white font-medium">
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