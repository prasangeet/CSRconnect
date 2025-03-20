import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, GraduationCap, BookOpen, Target, FileText } from "lucide-react";

function FacultyCard({ faculty }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative group">
        <img
          src={faculty.avatar}
          alt={faculty.name}
          className="w-full h-48 object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="secondary" size="sm" asChild>
            <a
              href={faculty.proposalPaperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Paper
            </a>
          </Button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{faculty.name}</h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <BookOpen className="w-4 h-4" />
          <span>{faculty.specialization}</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Target className="w-4 h-4" />
              <span>Areas of Work</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {faculty.areasOfWork?.map((area) => (
                <span
                  key={area}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {faculty.sdgContribution}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FacultyCard;
