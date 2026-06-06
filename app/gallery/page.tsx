"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ImageIcon, Eye, X } from 'lucide-react';

// 1. 圖片作品資訊，移除 tag 欄位，保留創作時間(date)與作品論述(description)
const myImages = [
    { 
        id: 1, 
        src: '/111462027-周明蝶-看海的夢境 (人類視角).jpg', 
        alt: '看海的夢境 (人類視角)', 
        title: '夢裡的海', 
        date: '2025 / 10 / 17',
        description: '靈感來源於過去所做的一場夢，我特別迷戀那時的月光和海，真希望還能再回去看看。'
    },
    { 
    id: 2, 
    src: '/111462027-周明蝶-平行時空 (人類視角).jpg', 
    alt: '平行時空 (人類視角)', 
    title: '平行時空', 
    date: '2025 / 10 / 28',
    description: '宇宙搞不好只是一件高維度所做出來的全息投影作品，平行時空其實就是投影畫面被分割後的結果。'
  },
  { 
    id: 3, 
    src: '/111462027-周明蝶-混種-2.jpg', 
    alt: '混種', 
    title: '人機混種', 
    date: '2025 / 11 / 04',
    description: '未來的我們是否將失去血肉之軀，並且將意識轉移到電腦上，成為某種人機混種？'
  },
  
  // 💡 有新作品時，直接依照這個結構複製一行貼在下面即可
];

// 定義圖片的 TypeScript 型態（移除 tag）
interface ImageData {
  id: number;
  src: string;
  alt: string;
  title: string;
  date: string;
  description: string;
}

export default function GalleryPage() {
  // 狀態：記錄目前被點擊、準備放大觀看的圖片
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-[#e2e8f0] select-none overflow-x-hidden font-sans
      bg-[linear-gradient(to_right,rgba(0,243,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]">
      
      {/* 背景極光特效 */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 頂部導覽列：返回主頁 */}
      <nav className="fixed top-0 left-0 w-full px-4 sm:px-6 md:px-16 h-20 flex justify-between items-center z-50 bg-[#050508]/60 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="font-mono font-black text-xs sm:text-sm tracking-[3px] text-slate-400 hover:text-[#00f3ff] transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          RETURN_TO_CORE //
        </Link>
        <div className="font-mono text-xs tracking-[2px] text-white/40 hidden sm:block">
          GALLERY_NODE // ONLINE
        </div>
      </nav>

      {/* 主內容區 */}
      <main className="max-w-6xl mx-auto pt-32 pb-24 px-4 sm:px-6 md:px-12 relative z-20">
        
        {/* 頁面標題 */}
        <header className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-white/5 font-mono text-[10px] tracking-[3px] text-[#00f3ff] uppercase mb-4">
            
            VISUAL_ARCHIVE // 影像總庫
          </div>
          <h1 className="font-mono text-2xl sm:text-4xl font-black tracking-wider text-white uppercase">
             Visual Capture - <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] to-[#ff007f]">影像作品合輯</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8a99ad] max-w-2xl mt-4 leading-relaxed tracking-wide">
            此處解鎖並完整載入所有數位創作與視覺解構實驗，點擊各個節點可查看像素特徵與光影維度。
          </p>
        </header>

        {/* 圖片網格 (Grid Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {myImages.map((image) => (
            <div 
              key={image.id} 
              onClick={() => setSelectedImage(image)}
              className="group relative bg-[rgba(255,255,255,0.01)] border border-white/5 p-4 rounded backdrop-blur-md overflow-hidden transition-all duration-500 cursor-pointer
                hover:-translate-y-1 hover:border-[#00f3ff]/60 hover:shadow-[0_10px_30px_rgba(0,243,255,0.05)]"
            >
              {/* 圖片外殼容器 */}
              <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded border border-white/10 group-hover:border-[#00f3ff]/30 transition-colors duration-500 bg-slate-950">
                {/* 💡 已移除原先左上角的 tag 標籤 */}
                
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter contrast-[105%]"
                />
                
                {/* 遮罩滑過特效 */}
                <div className="absolute inset-0 bg-[#050508]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="px-3 py-1.5 border border-[#00f3ff] bg-[#050508]/90 font-mono text-[10px] text-[#00f3ff] tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <Eye className="w-3.5 h-3.5" /> INSPECT_PIXELS
                  </div>
                </div>
              </div>

              {/* 圖片資訊文字 */}
              <div className="flex justify-between items-center pt-1 px-1">
                <h3 className="font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-200 group-hover:text-white transition-colors">
                  {image.title}
                </h3>
                <span className="font-mono text-[9px] text-slate-600">
                  #{image.id.toString().padStart(3, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 燈箱彈出視窗 (Modal Overlay) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-start bg-[#050508]/95 backdrop-blur-xl p-4 overflow-y-auto transition-all duration-300 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          {/* 關閉按鈕 */}
          <button 
            className="absolute top-6 right-6 text-slate-400 hover:text-[#00f3ff] transition-colors p-2 z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>

          {/* 內容包裝層 */}
          <div className="w-full max-w-4xl flex flex-col items-center pt-12 pb-16">
            
            {/* 大圖容器 */}
            <div 
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] rounded border border-white/10 overflow-hidden bg-slate-950 shadow-[0_0_50px_rgba(0,243,255,0.08)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* 詳細作品資訊與論述區 */}
            <div 
              className="mt-6 w-full text-left bg-white/[0.01] border border-white/5 backdrop-blur-md p-5 sm:p-6 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 第一層：ID 與時間（💡 已移除 tag 元素） */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3 font-mono">
                <span className="text-[9px] text-slate-600">
                  NODE_ID : #{selectedImage.id.toString().padStart(3, '0')}
                </span>
                
                {/* 創作時間 */}
                <div className="text-[10px] text-slate-400 tracking-wider">
                  TIMESTAMP : <span className="text-[#ff007f] font-bold">{selectedImage.date}</span>
                </div>
              </div>

              {/* 第二層：標題 */}
              <h2 className="font-sans text-xl sm:text-2xl font-black tracking-wider text-white mt-4">
                {selectedImage.title}
              </h2>

              {/* 第三層：作品論述內容 */}
              <div className="mt-4">
                <div className="font-mono text-[9px] text-[#00f3ff]/50 tracking-[2px] uppercase mb-1.5">
                  // STATEMENT_LOG
                </div>
                <p className="text-sm text-slate-300 leading-relaxed tracking-wide font-sans select-text">
                  {selectedImage.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 頁尾 */}
      <footer className="max-w-6xl mx-auto py-12 text-center text-[10px] font-mono text-slate-600 border-t border-white/5 relative z-10 tracking-[0.2em]">
        © {new Date().getFullYear()} YUXI. STABLE_CORE_V2. // ALL SYSTEMS OPERATIONAL.
      </footer>
    </div>
  );
}