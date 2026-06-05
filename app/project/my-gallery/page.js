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
        
          {/* ─── 作品 1 ─── */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-[#ff007f]/30 bg-[#0d0d12] flex flex-col">
            {/* 影片區塊 */}
            <div className="bg-black flex items-center justify-center aspect-video">
              <video 
                src="/Unwanted.mp4" 
                controls 
                muted 
                playsInline
                className="w-full h-full object-contain"
              >
                您的瀏覽器不支援影片播放。
              </video>
            </div>
            {/* 文字介紹區塊 */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide">d2s1 - Unwanted | FMV</h2>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  這是一部由粉絲所創作的非官方音樂 MV。
                </p>
              </div>
              {/* 可選：底部加上年份或媒材標籤 */}
              <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-[#ff007f]/70 font-mono">
                2026 / 01 / 07 / 02'30"
              </div>
            </div>
          </div>

          {/* ─── 作品 2 ─── */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-[#ff007f]/30 bg-[#0d0d12] flex flex-col">
            {/* 影片區塊 */}
            <div className="bg-black flex items-center justify-center aspect-video">
              <video 
                src="/周明蝶_生命長廊.mp4" 
                controls 
                muted 
                playsInline
                className="w-full h-full object-contain"
              >
                您的瀏覽器不支援影片播放。
              </video>
            </div>
            {/* 文字介紹區塊 */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide">周明蝶 - 生命長廊</h2>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  生命好似一條黑色的長廊，或許人們都被困在這場無止盡的輪迴當中。
                </p>
              </div>
              {/* 可選：底部加上年份或媒材標籤 */}
              <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-[#ff007f]/70 font-mono">
                2026 / 05 / 27 / 04'15"
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}