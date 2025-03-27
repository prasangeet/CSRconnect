import React from "react";
import { Card } from "@/components/ui/card";

function BlogsContainer() {
  // Sample blog data (Replace with actual backend API data)
  const blogs = [
    {
      id: 1,
      professorImage: "https://via.placeholder.com/60", // Placeholder for professor image
      topic: "AI in Education",
      content: "AI is transforming education by automating learning...",
    },
    {
      id: 2,
      professorImage: "https://via.placeholder.com/60",
      topic: "Sustainable Development",
      content: "Sustainability is key to our planet’s future...",
    },
  ];

  return (
    <div className="w-full max-w-4xl space-y-6">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Card key={blog.id} className="p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex gap-4 items-start">
              {/* Professor Image */}
              <img
                src={blog.professorImage}
                alt="Professor"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Blog Content */}
              <div>
                <h2 className="text-lg font-semibold">{blog.topic}</h2>
                <p className="text-gray-600 mt-2">{blog.content}</p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-center">No blogs available.</p>
      )}
    </div>
  );
}

export default BlogsContainer;
