'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Globe, ArrowRight } from "lucide-react";

function SDGPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const data = {
    sdgs: Array.from({ length: 17 }, (_, i) => ({
      id: i + 1,
      name: getSDGName(i + 1),
      picture: `/sdgs/image${i + 1}.png`,
      route: `/dashboard/sdgs/${i + 1}?name=${getSDGName(i + 1)}`,
      color: getSDGColor(i + 1),
      hoverColor: getSDGHoverColor(i + 1),
      description: getSDGDescription(i + 1),
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

  function getSDGDescription(id) {
    const descriptions = [
      "End poverty in all its forms everywhere",
      "End hunger, achieve food security and improved nutrition",
      "Ensure healthy lives and promote well-being for all",
      "Ensure inclusive and equitable quality education",
      "Achieve gender equality and empower all women and girls",
      "Ensure availability and sustainable management of water",
      "Ensure access to affordable, reliable, sustainable energy",
      "Promote sustained, inclusive and sustainable economic growth",
      "Build resilient infrastructure, promote inclusive industrialization",
      "Reduce inequality within and among countries",
      "Make cities and human settlements inclusive and sustainable",
      "Ensure sustainable consumption and production patterns",
      "Take urgent action to combat climate change",
      "Conserve and sustainably use the oceans and marine resources",
      "Protect, restore and promote sustainable use of ecosystems",
      "Promote peaceful and inclusive societies for sustainable development",
      "Strengthen the means of implementation and revitalize partnerships",
    ];
    return descriptions[id - 1] || "";
  }

  function getSDGColor(id) {
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

  const filteredSDGs = data.sdgs.filter(sdg =>
    sdg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sdg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">
                Sustainable Development Goals
              </h1>
              <p className="text-primary-foreground/80">
                The 17 SDGs are integrated—action in one area will affect outcomes in others, and development must balance social, economic and environmental sustainability. Explore our initiatives and contributions to each goal.
              </p>
            </div>
          </div>
          <Globe className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search SDGs by name or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* SDG Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
          {filteredSDGs.map((sdg) => (
            <Card
              key={sdg.id}
              className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`h-2 ${sdg.color} transition-colors duration-300 ${sdg.hoverColor}`} />
              <div className="p-4">
                <div className="relative aspect-square mb-4 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={sdg.picture || "/placeholder.svg"}
                    alt={sdg.name}
                    className="object-contain w-4/5 h-4/5 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute top-2 left-2 ${sdg.color} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-colors duration-300 ${sdg.hoverColor}`}>
                    {sdg.id}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-card-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
                  {sdg.name}
                </h3>

                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {sdg.description}
                </p>

                <a
                  href={sdg.route}
                  className={`inline-flex items-center justify-center w-full gap-2 text-xs ${sdg.color} text-white py-2 px-3 rounded-md transition-colors duration-300 ${sdg.hoverColor}`}
                >
                  View Projects
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SDGPage;