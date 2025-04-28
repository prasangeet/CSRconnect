import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  BookOpen,
  Target,
  GraduationCap,
  Mail,
  Phone,
  User
} from "lucide-react";
import Link from "next/link";

function FacultyCard({ faculty }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Profile Picture */}
      <div className="relative group">
        <img
          src={faculty.profile_picture_url || "/default-avatar.png"} // Fallback image
          alt={faculty.name}
          className="w-full h-48 object-cover object-center"
        />
        {faculty.proposal_pdf_url && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="sm" asChild>
              <a
                href={faculty.proposal_pdf_url} // Cloudinary-stored PDF
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Proposal
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Faculty Name */}
        <h3 className="text-xl font-semibold mb-2">{faculty.name}</h3>

        {/* Specialization */}
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <BookOpen className="w-4 h-4" />
          <span>{faculty.specialization}</span>
        </div>

        {/* Email & Phone Number */}
        {/* <div className="flex flex-col gap-2 text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{faculty.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{faculty.phone_number}</span>
          </div>
        </div> */}

        {/* Areas of Work */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Target className="w-4 h-4" />
              <span>Areas of Work</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(faculty.areas_of_work) &&
              faculty.areas_of_work.length > 0 ? (
                faculty.areas_of_work.map((area, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {area}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No areas specified
                </span>
              )}
            </div>
          </div>

          {/* SDG Contributions */}
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-2">
              SDG Contributions:
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(faculty.sdg_contributions) &&
              faculty.sdg_contributions.length > 0 ? (
                faculty.sdg_contributions.map((sdg, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    SDG {sdg}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No SDG Mapping
                </span>
              )}
            </div>
          </div>
          
          {/* View Profile Button */}
          <div className="pt-4">
            <Button 
              className="w-full flex items-center justify-center gap-2 transition-all hover:translate-y-[-2px]" 
              asChild
            >
              <Link
                href={`/dashboard/faculties/${faculty.id}`} 
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FacultyCard;