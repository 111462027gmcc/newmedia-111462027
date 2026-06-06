"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ImageIcon, Eye } from 'lucide-react';

// 1. 在這裡列出你所有的圖片作品資訊
const myImages = [
  { 
    id: 1, 
    src: '/111462027-周明蝶-平行時空 (人類視角).jpg', // 你原本結構中的圖，或改為 /my-works/art1.jpg
    alt: '平行時空 (人類視角)', 
    title: '平行時空', 
    tag: 'VISUAL_DECONSTRUCT' 
  },
  { 
    id: 2, 
    src: '/111462027-周明蝶-混種-2.jpg', // 替換成第三張圖的路徑
    alt: '混種', 
    title: '人機混種', 
    tag: 'FUTURE_TRENDS' 
  },
  { 
    id: 3, 
    src: '/111462027-周明蝶-看海的夢境 (人類視角).jpg', // 替換成第二張圖的路徑
    alt: '看海的夢境 (人類視角)', 
    title: '夢裡的海', 
    tag: 'DIGITAL_ART' 
  },
  
  // 💡 有新作品時，直接複製一行貼在下面即可
];

export default function GalleryPage() {
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
            <ImageIcon className="w-3 h-3" />
            VISUAL_ARCHIVE // 影像總庫
          </div>
          <h1 className="font-mono text-2xl sm:text-4xl font-black tracking-wider text-white uppercase">
            Visual Capture - <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] to-[#ff007f]">影像作品合輯</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8a99ad] max-w-2xl mt-4 leading-relaxed tracking-wide">
            此處解鎖並完整載入所有平面攝影、數位創作與視覺解構實驗。點擊各個節點可查看像素特徵與光影維度。
          </p>
        </header>

        {/* 圖片網格 (Grid Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {myImages.map((image) => (
            <div 
              key={image.id} 
              className="group relative bg-[rgba(255,255,255,0.01)] border border-white/5 p-4 rounded backdrop-blur-md overflow-hidden transition-all duration-500
                hover:-translate-y-1 hover:border-[#00f3ff]/60 hover:shadow-[0_10px_30px_rgba(0,243,255,0.05)]"
            >
              {/* 圖片外殼容器 */}
              <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded border border-white/10 group-hover:border-[#00f3ff]/30 transition-colors duration-500 bg-slate-950">
                <div className="absolute top-2 left-2 z-20 font-mono text-[8px] tracking-widest text-[#00f3ff] bg-[#050508]/80 px-1.5 py-0.5 border border-[#00f3ff]/20">
                  {image.tag}
                </div>
                
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

      {/* 頁尾 */}
      <footer className="max-w-6xl mx-auto py-12 text-center text-[10px] font-mono text-slate-600 border-t border-white/5 relative z-10 tracking-[0.2em]">
        © {new Date().getFullYear()} YUXI. STABLE_CORE_V2. // ALL SYSTEMS OPERATIONAL.
      </footer>
    </div>
  );
}