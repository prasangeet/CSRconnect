"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Globe, Target, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function CompanyCard({ company }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log(company);
    setIsClient(true);
  }, []);

  const handleViewDetails = () => {
    if (!isClient) return;
    router.push(`/dashboard/companies/${company.id}`);
  };

  const getSDGColor = (id) => {
    const colors = {
      1: "bg-red-600",
      2: "bg-yellow-500",
      3: "bg-green-500",
      4: "bg-red-400",
      5: "bg-red-600",
      6: "bg-blue-400",
      7: "bg-yellow-400",
      8: "bg-red-500",
      9: "bg-orange-500",
      10: "bg-pink-500",
      11: "bg-orange-400",
      12: "bg-amber-600",
      13: "bg-green-600",
      14: "bg-blue-600",
      15: "bg-green-500",
      16: "bg-blue-700",
      17: "bg-blue-500",
    };
    return colors[id] || "bg-slate-600";
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-3 bg-primary"></div>
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {company.name || "Company Name Not Available"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {company.industry || "Industry Not Specified"}
            </p>

            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {company.location || "Location Not Available"}
            </div>

            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Globe className="w-4 h-4 mr-1" />
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {company.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              ) : (
                "Website Not Available"
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Target className="w-4 h-4 mr-1" />
            SDG Initiatives
          </h4>
          {company.sdg_initiatives && company.sdg_initiatives.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {company.sdg_initiatives.map((sdg) => (
                <Badge
                  key={sdg.id}
                  title={`SDG ${sdg.number} - ${sdg.name}`}
                  className={`${getSDGColor(
                    sdg.number
                  )} text-white hover:${getSDGColor(sdg.number)}`}
                >
                  SDG {sdg.number}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>No SDG initiatives listed</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          {company.description ? (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {company.description}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>No company description available</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3 mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleViewDetails}
          disabled={!isClient}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CompanyCard;
