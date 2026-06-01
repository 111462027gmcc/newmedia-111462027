"use client"; // 告訴 Next.js 這是一個用戶端組件

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  // 取得登入狀態：isSignedIn 為 true 代表已登入
  const { isSignedIn, isLoaded, user } = useUser();

  // 定義權限邏輯
  const canAccessArt = isSignedIn && (
    user.primaryEmailAddress?.emailAddress === "your-email@gmail.com" || 
    user.publicMetadata.role === "vips"
  );

  return (
    // 深色科技底，外加微弱的放射狀漸層，營造螢幕光感
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 科技感背景裝飾網格與光暈 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 導覽列：玻璃擬態半透明質感 */}
      <nav className="bg-[#0f172a]/70 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50 transition-all">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {/* 左側：Logo - 霓虹發光字體 */}
          <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r via-cyan-400 from-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer">
            Min&apos;s Core
          </span>
          
          {/* 右側：所有的選單與按鈕 */}
          <div className="flex items-center space-x-8">
            {/* 導航文字：作品、聯絡我 */}
            <div className="hidden md:flex space-x-6 font-medium">
              <a href="#projects" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 tracking-wide">核心專案</a>
              <a href="#contact" className="text-slate-400 hover:text-purple-400 transition-colors duration-300 tracking-wide">信號聯絡</a>
            </div>

            {/* 功能按鈕區塊：根據登入狀態動態顯示 */}
            <div className="flex items-center space-x-3 border-l pl-8 border-slate-800">
              {isLoaded && !isSignedIn && (
                <div className="flex items-center space-x-3">
                  <SignInButton mode="modal">
                    <button className="text-slate-400 hover:text-cyan-400 font-medium text-sm transition px-3 py-2">
                      認證登入
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 px-5 py-2 rounded-md text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
                      <span className="relative z-10 text-white">初始化註冊</span>
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>
                  </SignUpButton>
                </div>
              )}

              {isSignedIn && (
                <div className="border-2 border-cyan-500/50 rounded-full p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  <UserButton/>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主視覺區 Hero Section */}
      <header className="max-w-5xl mx-auto py-24 px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left">
          {/* 科技感小標籤 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono mb-4 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SYSTEM STATUS: ONLINE
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
            Hello ! &nbsp; 
            {/* 加上 tracking-widest 讓「這裡是」字距變寬 */}
            <span className="tracking-widest">這裡是</span> <br className="sm:hidden" />
            {/* 加上 tracking-widest 讓「明蝶」字距變寬，並維持原本的漸層發光特效 */}
            <span className="inline-block tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 drop-shadow-sm">
              明蝶
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed font-light">
            歡迎來到我的數位觀測站。這裡記錄了我關於互動程式、多媒體感測、以及全端網頁的開發軌跡。很高興認識你。
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#projects" className="bg-slate-900 border border-cyan-500/50 text-cyan-400 px-6 py-2.5 rounded-md hover:bg-cyan-500 hover:text-slate-950 transition-all duration-300 font-medium shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              核心技術
            </a>
            <button className="border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-purple-400 px-6 py-2.5 rounded-md transition-all duration-300 font-medium">
              數據履歷
            </button>
          </div>
        </div>
        
        {/* 頭像區域 */}
        <div className="flex-1 flex justify-center relative group">
          {/* 外圍科技感發光環 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 max-w-[340px] max-h-[340px] m-auto" />
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full p-1 bg-gradient-to-b from-cyan-500 via-transparent to-purple-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="w-full h-full rounded-full bg-[#0b0f19] overflow-hidden relative">
              <Image 
                src="/5.png" // 對應到 public 資料夾
                alt="我的頭像"
                fill
                priority
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 作品展示區 */}
      <section id="projects" className="max-w-5xl mx-auto py-20 px-4 border-t border-slate-900 scroll-mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide">精選專案</h2>
            <p className="text-slate-500 text-sm mt-1">Projects Archive</p>
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-900 via-cyan-900/30 to-transparent ml-6 hidden sm:block" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* 1. 多媒體互動 / 全端網頁專案 */}
          <Link href="#">
            <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-xl border border-slate-800/80 hover:border-cyan-500/50 shadow-md hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-pointer group flex flex-col h-full">
              {/* 圖片預留區改為極簡科技風格 */}
              <div className="w-full h-44 bg-slate-950 rounded-lg mb-4 flex flex-col items-center justify-center text-slate-600 group-hover:text-cyan-400 border border-slate-900 group-hover:border-cyan-950/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono text-xs tracking-widest text-slate-500 group-hover:text-cyan-400/80 mb-1">[ PROJECT // 01 ]</span>
                <span className="text-sm font-medium tracking-wide">互動多媒體 / 全端系統</span>
              </div>
              <h3 className="font-bold text-xl group-hover:text-cyan-400 text-slate-100 transition-colors">我的第一個全端網頁</h3>
              <p className="text-slate-400 text-sm mt-2 flex-grow leading-relaxed">
                整合後端資料庫與前端即時渲染，打造兼具流暢度與感官體驗的互動式全端架構。點擊查看詳細開發棧。
              </p>
              <div className="text-cyan-400 text-xs font-mono font-semibold mt-4 flex items-center gap-1">
                INITIALIZE MODULE <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* 2. 繪畫作品：限時解鎖區 */}
          {canAccessArt ? (
            <Link href="/project/my-gallery">
              <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-950/10 to-transparent hover:border-purple-500 shadow-md hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer group flex flex-col h-full">
                <div className="w-full h-44 bg-purple-950/20 rounded-lg mb-4 flex flex-col items-center justify-center text-purple-400 border border-purple-900/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent" />
                  <span className="font-mono text-xs tracking-widest text-purple-400/60 mb-1">[ ACCESS GRANTED ]</span>
                  <span className="text-sm font-medium">🎨 點擊進入私人畫廊</span>
                </div>
                <h3 className="font-bold text-xl text-purple-400">我的繪畫收藏 ( 已解鎖 )</h3>
                <p className="text-slate-400 text-sm mt-2 flex-grow leading-relaxed">
                  核心視覺庫已連線。此處收藏了個人原創的數位電繪、視覺實驗與概念美術創作，點擊自由瀏覽。
                </p>
                <div className="text-purple-400 text-xs font-mono font-semibold mt-4">
                  DECRYPTED SUCCESSFULLY
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-slate-950/40 backdrop-blur-sm p-6 rounded-xl border border-dashed border-slate-800 opacity-60 flex flex-col h-full relative group">
              <div className="w-full h-44 bg-slate-900/50 rounded-lg mb-4 flex flex-col items-center justify-center text-slate-600 border border-slate-950">
                <span className="font-mono text-xs tracking-widest mb-1">[ ENCRYPTED ]</span>
                <span className="text-sm">🔒 核心權限未解鎖</span>
              </div>
              <h3 className="font-bold text-xl text-slate-500">私密繪畫作品</h3>
              <p className="text-slate-500 text-sm mt-2 flex-grow leading-relaxed">
                此加密安全區包含私密原創視覺藝術，限制特定 VIP 或授權認證。如需索取存取憑證（Token），請由下方發送對接訊號。
              </p>
              <div className="text-slate-600 text-xs font-mono mt-4">
                WAITING FOR CREDITENTIALS...
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 聯絡我表單區 */}
      <section id="contact" className="max-w-md mx-auto py-24 px-4 text-center relative z-10 scroll-mt-20">
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-wide">信號傳輸端</h2>
        <p className="text-slate-400 text-sm mb-8 font-light">發送加密郵件或工作邀約直接與我對接</p>
        
        {/* 表單改用深色科幻輸入框 */}
        <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5 text-left bg-slate-900/50 p-8 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-xl">
          <input type="hidden" name="access_key" value="abce0b1a-895b-44ed-88af-013c8c2166ca" />
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">發信源姓名 / Identity</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-light text-sm"
              placeholder="e.g. Guest Player"
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">聯絡信箱 / Vector Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-light text-sm"
              placeholder="your-signal@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">封包訊息 / Core Content</label>
            <textarea 
              name="message" 
              rows={4} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-light text-sm resize-none"
              placeholder="輸入你想傳送的訊號內容..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-3.5 rounded-lg font-bold tracking-widest text-sm shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 uppercase"
          >
            發送核心訊號
          </button>
        </form>
      </section>

      {/* 頁尾 */}
      <footer className="max-w-5xl mx-auto py-8 text-center text-xs font-mono text-slate-600 border-t border-slate-900 relative z-10">
        © {new Date().getFullYear()} Yuxi. ALL RIGHTS SECURED. TERMINAL_V1.0.0
      </footer>
      
    </div>
  );
}