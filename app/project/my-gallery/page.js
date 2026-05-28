"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GalleryPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // 權限判斷（需與首頁一致）
  const hasAccess = isSignedIn && user.primaryEmailAddress?.emailAddress === "your-email@gmail.com";

  useEffect(() => {
    if (isLoaded && !hasAccess) {
      // 如果加載完發現沒權限，直接踢回首頁
      router.push("/");
    }
  }, [isLoaded, hasAccess, router]);

  if (!isLoaded || !hasAccess) return <div className="p-20 text-center">正在驗證權限...</div>;

  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-10">我的私密畫廊 🎨</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 這裡放你的畫作 */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img src="/art1.png" alt="作品1" className="w-full h-auto" />
        </div>
        {/* ...更多作品 */}
      </div>
    </div>
  );
}