'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goToRegisterPage = () => {
    router.push("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Link href={"/register"}>
      <Button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
        Go to Register
      </Button>
        </Link>
    </div>
  );
}
