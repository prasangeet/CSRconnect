// components/faculty-card.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, GraduationCap, BookOpen, Target, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function FacultyCard({ faculty, onEdit }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{faculty.name}</h3>
            <p className="text-sm text-muted-foreground">{faculty.specialization}</p>
          </div>
          {onEdit && (
            <div className="relative group">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onEdit("name")}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-white shadow-lg rounded-md p-2 z-10">
                <div className="flex flex-col gap-1 w-40">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start" 
                    onClick={() => onEdit("name")}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" /> Edit Basic Info
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start" 
                    onClick={() => onEdit("specialization")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" /> Edit Specialization
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start" 
                    onClick={() => onEdit("areas")}
                  >
                    <Target className="h-4 w-4 mr-2" /> Edit Areas of Work
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start" 
                    onClick={() => onEdit("sdg")}
                  >
                    <Globe className="h-4 w-4 mr-2" /> Edit SDG Contribution
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start" 
                    onClick={() => onEdit("publications")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" /> Edit Publications
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between py-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Areas of Work</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {faculty.areas_of_work?.map((area, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
              {!faculty.areas_of_work?.length && (
                <p className="text-sm text-muted-foreground">No areas specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">SDG Contribution</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {faculty.sdg_contribution || "No SDG contribution specified"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FacultyCard;
