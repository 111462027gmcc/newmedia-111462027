"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GalleryPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // 權限判斷（必須與首頁的 canAccessArt 邏輯一致）
  const hasAccess = isSignedIn && (
    user.primaryEmailAddress?.emailAddress === "your-email@gmail.com" || 
    user.publicMetadata.role === "vips"
  );

  useEffect(() => {
    if (isLoaded && !hasAccess) {
      // 如果加載完發現沒權限，直接踢回首頁
      router.push("/");
    }
  }, [isLoaded, hasAccess, router]);

  if (!isLoaded || !hasAccess) {
    return <div className="p-20 text-center text-white bg-[#050508] min-h-screen">正在驗證權限...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050508] text-[#e2e8f0] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 font-mono tracking-wider text-white">我的私密畫廊 🎨</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 圖片作品 */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-white/5 bg-slate-900/40 backdrop-blur-md">
            <img src="/art1.png" alt="作品1" className="w-full h-auto" />
          </div>

          {/* 影片作品 - 生命長廊 */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-[#ff007f]/30 bg-black flex items-center justify-center aspect-video">
            <video 
              src="/周明蝶_生命長廊.mp4"  // 👈 確保檔案在 public/ 根目錄下
              controls 
              muted 
              playsInline
              className="w-full h-full object-contain"
            >
              您的瀏覽器不支援影片播放。
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}