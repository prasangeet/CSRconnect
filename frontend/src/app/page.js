'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Globe2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const goToRegisterPage = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto text-center">
          {/* Logo Section */}
          <div className="mb-8 relative">
            <Image
              src="/IITJlogo.png"
              alt="IIT Jodhpur Logo"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
          </div>

          {/* Hero Content */}
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <Globe2 className="w-[400px] h-[400px] text-primary/5 opacity-50" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              CSR Connect Portal
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              Welcome to IIT Jodhpur&apos;s CSR Connect Portal
            </p>
            
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bridging the gap between corporate social responsibility and academic excellence. 
              Our platform connects companies&apos; CSR initiatives with professors&apos; research work, 
              fostering collaboration towards Sustainable Development Goals (SDGs).
            </p>

            <div className="space-y-4">
              <Button
                onClick={goToRegisterPage}
                size="lg"
                className="px-8 transition-all hover:scale-105"
              >
                Get Started
              </Button>

              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <button className="hover:text-primary transition-colors">
                  Learn More
                </button>
                <span>•</span>
                <button className="hover:text-primary transition-colors">
                  Contact Us
                </button>
                <span>•</span>
                <button className="hover:text-primary transition-colors">
                  About
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-sm text-muted-foreground">
            © {new Date().getFullYear()} IIT Jodhpur. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}