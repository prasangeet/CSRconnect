import BlogsContainer from "@/components/blogs-container";
import ProfessorContainer from "@/components/professor-container";
import React from "react";

function BlogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 ml-5 mb-6">Blogs</h1>

      <div className="flex justify-center gap-4 m-4">
        <BlogsContainer />
        <ProfessorContainer />
      </div>
    </div>
  );
}

export default BlogsPage;
