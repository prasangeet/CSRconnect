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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-left mb-6">
        Sustainable Development Goals
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.sdgs.map((sdg) => (
          <Link key={sdg.id} href={sdg.route}>
            <div className="p-2 bg-white shadow-md rounded-3xl flex flex-col items-center cursor-pointer">
              <Image
                src={sdg.picture}
                alt={sdg.name}
                width={150}
                height={150}
                className="object-contain"
              />
              <p className="text-sm font-semibold mt-2 text-center">{sdg.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SDGPage;
