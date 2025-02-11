'use client'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goToRegisterPage = () => {
    router.push("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={goToRegisterPage}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Go to Register
      </button>
    </div>
  );
}
