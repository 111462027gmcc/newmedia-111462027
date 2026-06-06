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
         
          <header className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-white/5 font-mono text-[10px] tracking-[3px] text-[#00f3ff] uppercase mb-4">
            
            PERSONAL_ART // 私人作品
          </div>
          <h1 className="font-mono text-2xl sm:text-4xl font-black tracking-wider text-white normal-case">
          Private Collection _
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] to-[#ff007f]">
            {" "}
            私人收藏
          </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8a99ad] max-w-2xl mt-4 leading-relaxed tracking-wide">
            此處解鎖並完整載入所有數位創作與視覺解構實驗，點擊各個節點可查看像素特徵與光影維度。
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
          {/* ─── 作品 0 ─── */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-[#ff007f]/30 bg-[#0d0d12] flex flex-col">
            {/* 影片區塊 */}
            <div className="bg-black flex items-center justify-center aspect-video">
              <video 
                src="/周明蝶_人類檔案.mp4" 
                controls 
                muted 
                playsInline
                autoPlay   /* 👈 新增：自動播放 */
                loop       /* 👈 新增：循環播放 */
                className="w-full h-full object-contain"
              >
                您的瀏覽器不支援影片播放。
              </video>
            </div>
            {/* 文字介紹區塊 */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Homosapien</h2>
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  我駭入了上帝的電腦，並且發現了一個名叫 Homosapien 的檔案，裡面居然寫滿了關於我的角色初始設定 ...
                </p>
              </div>
              {/* 可選：底部加上年份或媒材標籤 */}
              <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-[#ff007f]/70 font-mono">
                2025 / 11 / 16 / 06'09"
              </div>
            </div>
          </div>

          {/* ─── 作品 1 ─── */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-[#ff007f]/30 bg-[#0d0d12] flex flex-col">
            {/* 影片區塊 */}
            <div className="bg-black flex items-center justify-center aspect-video">
              <video 
                src="/Unwanted.mp4" 
                controls 
                muted 
                playsInline
                autoPlay   /* 👈 新增：自動播放 */
                loop       /* 👈 新增：循環播放 */
                className="w-full h-full object-contain"
              >
                您的瀏覽器不支援影片播放。
              </video>
            </div>
            {/* 文字介紹區塊 */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide">d2s1 - Unwanted | FMV </h2>
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

        </div>
      </div>
    </div>
  );
}