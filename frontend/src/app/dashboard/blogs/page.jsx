import React from "react";
import BlogsContainer from "@/components/blogs-container";
import { Globe } from "lucide-react";

function BlogsPage() {
  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
        <div className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Professor's Blogs</h1>
            <p className="text-primary-foreground/80">
              Discover new insights from professors' blogs.
            </p>
          </div>
        </div>
        <Globe className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
      </div>

      {/* Blogs Container */}
      <div className="flex justify-center">
        <BlogsContainer />
      </div>
    </div>
  );
}

export default BlogsPage;
