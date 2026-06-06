"use client"; // 告訴 Next.js 這是一個用戶端組件

import React, { useEffect, useRef, useState } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';
import { Cpu, Atom, ShieldAlert, ArrowRight, ImageIcon } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: () => void;
}

export default function Home() {
  // --- 1. 權限與登入狀態管理 ---
  const { isSignedIn, isLoaded, user } = useUser();

  // 檢查用戶是否被 Clerk 後台封鎖
  const isBlocked = isSignedIn && user.publicMetadata.role === "blocked";

  // 檢查是否擁有 VIP 畫廊權限
  const canAccessArt = isSignedIn && (
    user.primaryEmailAddress?.emailAddress === "your-email@gmail.com" || 
    user.publicMetadata.role === "vips"
  );

  // --- 2. 核心特效狀態與 Ref 宣告 ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [cursorBlurPos, setCursorBlurPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // 1. 定義圖片作品的數據結構與內容
  const photographyWorks = [
    {
      id: 1,
      src: "/111462027-周明蝶-平行時空 (人類視角).jpg",
      title: "平行時空 (人類視角)",
      desc: "探索人類視覺在多維空間中的交錯與重疊，透過光影的扭曲定格數位維度中的瞬間感知。",
      date: "2025.11"
    },
    {
      id: 2,
      src: "/path-to-your-image-2.jpg", 
      title: "量子共振 / QUANTUM_RESONANCE",
      desc: "數位幾何圖形與環境光線的粒子感應實驗，捕捉不可見的網絡信號波動。",
      date: "2026.02"
    },
    {
      id: 3,
      src: "/path-to-your-image-3.jpg", 
      title: "賽博邊界 / CYBER_HORIZON",
      desc: "霓虹像素在低對比度環境下的衰減狀態研究，呈現虛擬與現實交界的冷冽感。",
      date: "2026.05"
    }
  ];

  // 2. 宣告彈窗控制狀態
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // 動態矩陣卡片張數（對應下方 4 個可互動的區塊）
  const cardRefs = [
    useRef<HTMLDivElement | null>(null), // 3D 動畫
    useRef<HTMLDivElement | null>(null), // 影像作品合輯
    useRef<HTMLDivElement | null>(null), // 生命長廊
    useRef<HTMLDivElement | null>(null), // 私人收藏區
  ];

  // --- 3. 全域動態物理系統 (Canvas 粒子 + 滑鼠追蹤) ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 外圍發光圈平滑延遲演算法
    let animationFrameId: number;
    const updateCursorBlur = () => {
      setCursorBlurPos((prev) => {
        const dx = mouse.x - prev.x;
        const dy = mouse.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updateCursorBlur);
    };
    animationFrameId = requestAnimationFrame(updateCursorBlur);

    // Canvas 物理碰撞與排斥系統
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const numberOfParticles = 65;
    let mouseRadius = 140;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class ParticleInstance implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#ff007f';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY;

        // 滑鼠排斥力學
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouseRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRadius - distance) / mouseRadius;
          this.x -= forceDirectionX * force * 3;
          this.y -= forceDirectionY * force * 3;
        }
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.closePath();
        ctx!.fill();
      }
    }

    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new ParticleInstance());
      }
    };
    initParticles();

    // 粒子量子化網絡連線
    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            const opacity = 1 - distance / 130;
            ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.1})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    let canvasAnimId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      canvasAnimId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(canvasAnimId);
    };
  }, [mouse.x, mouse.y]);

  // --- 4. Spotlight 局部座標計算函數 ---
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs[index].current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // --- 5. 攔截功能：如果 Clerk 偵測到用戶被封鎖，直接沒收全站網頁 ---
  if (isLoaded && isBlocked) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-4 text-center font-mono relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(255,0,127,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,127,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="bg-slate-950/60 p-8 border border-[#ff007f]/30 max-w-md shadow-[0_0_50px_rgba(255,0,127,0.15)] relative">
          <div className="text-[#ff007f] text-5xl mb-4 animate-pulse">🛑</div>
          <h1 className="text-xl font-black tracking-widest text-[#ff007f] mb-3">SIGNAL_DENIED // 帳號已封鎖</h1>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            偵測到不安全或未授權的連線活動。您的存取憑證已被系統永久撤銷，如有任何爭議請聯絡管理埠。
          </p>
          <div className="flex justify-center border-t border-white/5 pt-5">
            <div className="border border-[#00f3ff]/40 p-0.5 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.2)]">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-[#e2e8f0] select-none overflow-x-hidden font-sans md:cursor-none
      bg-[linear-gradient(to_right,rgba(0,243,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]">
      
      {/* 核心環境深層極光 */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/5 rounded-full blur-[80px] md:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/5 rounded-full blur-[80px] md:blur-[140px] pointer-events-none" />

      {/* A. 客製化量子滑鼠指標 */}
      <div 
        className="hidden md:block fixed pointer-events-none z-[9999] rounded-full mix-blend-screen transition-all duration-150 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mouse.x}px`,
          top: `${mouse.y}px`,
          width: isHovered ? '28px' : '8px',
          height: isHovered ? '28px' : '8px',
          backgroundColor: isHovered ? 'rgba(255, 0, 127, 0.85)' : '#00f3ff',
          boxShadow: isHovered ? '0 0 20px #ff007f, inset 0 0 8px white' : '0 0 12px #00f3ff'
        }}
      />
      <div 
        className="hidden md:block fixed pointer-events-none z-[9998] rounded-full border transition-transform duration-75 opacity-40 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${cursorBlurPos.x}px`,
          top: `${cursorBlurPos.y}px`,
          width: '44px',
          height: '44px',
          borderColor: isHovered ? '#00f3ff' : '#ff007f',
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.4 : 1})`
        }}
      />

      {/* B. 背景 Canvas 物理引擎 */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      {/* C. 頂部高階感導覽列 */}
      <nav className="fixed top-0 left-0 w-full px-4 sm:px-6 md:px-16 h-20 md:h-24 flex justify-between items-center z-50 bg-[#050508]/60 backdrop-blur-md border-b border-white/5">
        <div className="font-mono font-black text-base sm:text-lg tracking-[2px] sm:tracking-[4px] text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
          MIN_CORE //
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-10">
          <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] font-mono uppercase">
            <a href="#projects" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="text-slate-400 hover:text-[#00f3ff] transition-colors relative group">// MATRIX</a>
            <a href="#contact" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="text-slate-400 hover:text-[#ff007f] transition-colors relative group">// SIGNAL</a>
          </div>

          {/* Clerk 驗證區 */}
          <div className="flex items-center space-x-2 md:space-x-3 md:border-l md:border-white/10 md:pl-6">
            {isLoaded && !isSignedIn && (
              <div className="flex items-center space-x-2 sm:space-x-3 font-mono text-[11px] sm:text-xs tracking-wider">
                <SignInButton mode="modal">
                  <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="text-slate-400 hover:text-white transition px-1.5 py-1">
                    LOGIN
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="bg-white text-black px-2.5 sm:px-4 py-1.5 sm:py-2 font-bold hover:bg-[#00f3ff] transition shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                    SIGN_UP
                  </button>
                </SignUpButton>
              </div>
            )}

            {isSignedIn && (
              <div className="border border-[#00f3ff]/40 p-0.5 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                <UserButton/>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* D. 主視覺 Section */}
      <header className="max-w-6xl mx-auto min-h-screen pt-28 pb-12 px-4 sm:px-6 md:px-12 grid md:grid-cols-12 gap-8 md:grid-flow-row items-center relative z-20">
        <div className="md:col-span-7 text-center md:text-left space-y-6 md:space-y-8 order-2 md:order-1">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-white/5 font-mono text-[10px] tracking-[3px] text-[#00f3ff] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-pulse" />
            NODE_STATUS // ONLINE
          </div>

          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-[2px] sm:tracking-[4px] leading-tight sm:leading-none uppercase text-white break-words">
            <span className="text-slate-400 text-lg sm:text-xl md:text-2xl tracking-[0.15em] font-light block mb-2">這裡是</span>
            <span className="inline-block tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] via-blue-500 to-[#ff007f] drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">
              Dieh.
            </span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base tracking-[1px] sm:tracking-[2px] text-[#8a99ad] max-w-lg leading-relaxed uppercase mx-auto md:mx-0">
            歡迎來到我的數位觀測站。此處專注於全端網絡架構、多媒體感測互動、以及次世代視覺維度的解構實驗。
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 pt-2 font-mono text-[11px] sm:text-xs tracking-widest">
            <a href="#projects" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 border border-[#00f3ff]/50 text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
              CONNECT_MATRIX
            </a>
            <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 border border-white/10 hover:border-[#ff007f] text-slate-400 hover:text-[#ff007f] transition-all duration-300">
              DOWNLOAD_CV
            </button>
          </div>
        </div>
        
        {/* 右側：不對稱科技線條幾何頭像 */}
        <div className="md:col-span-5 flex justify-center relative order-1 md:order-2 pt-4 md:pt-0">
          <div className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] group">
            <div className="absolute -inset-2.5 md:-inset-3 border border-white/5 pointer-events-none group-hover:border-[#00f3ff]/20 transition-colors duration-500" />
            <div className="absolute -top-2.5 -left-2.5 md:-top-3 md:-left-3 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-[#00f3ff]" />
            <div className="absolute -bottom-2.5 -right-2.5 md:-bottom-3 md:-right-3 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-[#ff007f]" />
            
            <div className="w-full h-full rounded-full p-0.5 bg-gradient-to-b from-slate-800 to-transparent overflow-hidden shadow-[0_0_40px_rgba(0,243,255,0.15)]">
              <div className="w-full h-full rounded-full bg-[#050508] overflow-hidden relative">
                <Image 
                  src="/5.png" 
                  alt="我的頭像"
                  fill
                  priority
                  className="object-cover scale-105 group-hover:scale-110 transition duration-700 filter grayscale-[15%] group-hover:grayscale-0"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* E. 互動 Spotlight 核心專案展示區 */}
      <section id="projects" className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 md:py-24 z-20 relative scroll-mt-20">
        <div className="mb-10 md:mb-14 flex justify-between items-end">
          <div className="text-center md:text-left w-full md:w-auto">
            <span className="font-mono text-xs text-[#00f3ff] tracking-[0.3em] block mb-2">// DATA_ARRAY</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wider uppercase">精選專案矩陣</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* 專案一：3D 動畫作品影片 (對應 Ref[0]) */}
          <Link 
            href="/周明蝶_基礎動畫_期末作品.mp4" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block h-full"
          > 
            <div
              ref={cardRefs[0]}
              onMouseMove={(e) => handleCardMouseMove(e, 0)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative bg-[rgba(255,255,255,0.01)] border border-white/5 p-6 sm:p-8 rounded backdrop-blur-md overflow-hidden group transition-all duration-300
                hover:-translate-y-1.5 hover:border-[#00f3ff] hover:shadow-[0_10px_30px_rgba(0,243,255,0.08)]
                before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(500px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(0,243,255,0.05),transparent_40%)] flex flex-col h-full cursor-pointer"
            >
              <div className="relative w-full aspect-video mb-6 overflow-hidden rounded border border-white/10 group-hover:border-[#00f3ff]/40 transition-colors duration-500 bg-slate-950">
                <div className="absolute top-2 left-2 z-20 font-mono text-[9px] tracking-widest text-[#00f3ff] bg-[#050508]/80 px-1.5 py-0.5 border border-[#00f3ff]/30 animate-pulse">
                  LIVE_STREAM // 3D_RENDER
                </div>
                
                <video
                  src="/周明蝶_基礎動畫_期末作品.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter contrast-[110%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
              </div>

              <h3 className="font-mono text-base sm:text-lg font-bold mb-2.5 sm:mb-3 tracking-wider text-white">
                3D Animation - Blue Dream
              </h3>
              <p className="text-[#8a99ad] leading-relaxed text-xs sm:text-sm font-light flex-grow">
                好似進入了一場藍色的夢，周圍充滿了流動的光影和模糊的輪廓，我試圖透過動畫捕捉那種虛幻又真實的感覺。
              </p>
              <div className="mt-4 pt-2 border-t border-gray-800 text-xs text-[#ff007f]/70 font-mono">
                2025 / 11 / 16 / 06&apos;09&quot;
              </div>
            </div>
          </Link>

          {/* 專案二：生命長廊 (修復綁定：對應 Ref[2]) */}
          <Link 
            href="/程式設計與應用_周明蝶_期末作品 (3).mp4" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block h-full"
          > 
            <div
              ref={cardRefs[2]}
              onMouseMove={(e) => handleCardMouseMove(e, 2)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative bg-[rgba(255,255,255,0.01)] border border-white/5 p-6 sm:p-8 rounded backdrop-blur-md overflow-hidden group transition-all duration-300
                hover:-translate-y-1.5 hover:border-[#00f3ff] hover:shadow-[0_10px_30px_rgba(0,243,255,0.08)]
                before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(500px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(0,243,255,0.05),transparent_40%)] flex flex-col h-full cursor-pointer"
            >
              <div className="relative w-full aspect-video mb-6 overflow-hidden rounded border border-white/10 group-hover:border-[#00f3ff]/40 transition-colors duration-500 bg-slate-950">
                <div className="absolute top-2 left-2 z-20 font-mono text-[9px] tracking-widest text-[#00f3ff] bg-[#050508]/80 px-1.5 py-0.5 border border-[#00f3ff]/30 animate-pulse">
                  LIVE_STREAM // P5.JS & FIREBASE
                </div>
                
                <video
                  src="/程式設計與應用_周明蝶_期末作品 (3).mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter contrast-[110%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
              </div>

              <h3 className="font-mono text-base sm:text-lg font-bold mb-2.5 sm:mb-3 tracking-wider text-white">
                p5.js & Firebase - Life Corridor
              </h3>
              <p className="text-[#8a99ad] leading-relaxed text-xs sm:text-sm font-light flex-grow">
                生命好似一條黑色的長廊，或許人們都被困在這場無止盡的輪迴當中。
              </p>
              <div className="mt-4 pt-2 border-t border-gray-800 text-xs text-[#ff007f]/70 font-mono">
                2026 / 05 / 27 / 04&apos;15&quot;
              </div>
            </div>
          </Link>


          {/* 專案三：影像/圖片作品展示卡片 (對應 Ref[1]) */}
          <Link 
            href="/gallery" 
            className="block h-full"
          >
            <div
              ref={cardRefs[1]}
              onMouseMove={(e) => handleCardMouseMove(e, 1)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative bg-[rgba(255,255,255,0.01)] border border-white/5 p-6 sm:p-8 rounded backdrop-blur-md overflow-hidden group transition-all duration-300
                hover:-translate-y-1.5 hover:border-[#00f3ff] hover:shadow-[0_10px_30px_rgba(0,243,255,0.08)]
                before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(500px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(0,243,255,0.05),transparent_40%)] flex flex-col h-full cursor-pointer"
            >
              <div className="relative w-full aspect-video mb-6 overflow-hidden rounded border border-white/10 group-hover:border-[#00f3ff]/40 transition-colors duration-500 bg-slate-950">
                <div className="absolute top-2 left-2 z-20 font-mono text-[9px] tracking-widest text-[#00f3ff] bg-[#050508]/80 px-1.5 py-0.5 border border-[#00f3ff]/30">
                  STATIC_CAPTURE // IMAGE_FRAME
                </div>
                
                <Image 
                  src="/111462027-周明蝶-平行時空 (人類視角).jpg" 
                  alt="影像作品預覽"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
              </div>

              <h3 className="font-mono text-base sm:text-lg font-bold mb-2.5 sm:mb-3 tracking-wider text-white">
                Image Gallery
              </h3>
              <p className="text-[#8a99ad] leading-relaxed text-xs sm:text-sm font-light flex-grow">
                此處收錄了平面攝影、數位影像創作與視覺解構實驗。透過快門與光影像素，定格數位維度中的瞬間感知。
              </p>
              
              <div className="text-[#00f3ff] text-[11px] font-mono tracking-widest mt-6 flex items-center gap-1.5">
                VIEW_GALLERY <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>

          

          {/* 專案四：加密作品收藏區 (修復綁定：對應 Ref[3]) */}
          {canAccessArt ? (
            <Link href="/project/my-gallery" className="block h-full"> 
              <div
                ref={cardRefs[3]}
                onMouseMove={(e) => handleCardMouseMove(e, 3)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative bg-[rgba(255,255,255,0.01)] border border-[#ff007f]/30 p-6 sm:p-8 rounded backdrop-blur-md overflow-hidden group transition-all duration-300
                  hover:-translate-y-1.5 hover:border-[#ff007f] hover:shadow-[0_10px_30px_rgba(255,0,127,0.08)]
                  before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(500px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(255,0,127,0.05),transparent_40%)] flex flex-col h-full cursor-pointer"
              >
                <div className="mb-4 sm:mb-6 w-11 h-11 sm:w-12 sm:h-12 rounded bg-purple-950/20 border border-[#ff007f]/20 flex items-center justify-center text-[#ff007f] group-hover:scale-110 transition-transform">
                  <Atom className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
                </div>
                <h3 className="font-mono text-base sm:text-lg font-bold mb-2.5 sm:mb-3 tracking-wider text-white">Private Collection ( Unlocked )</h3>
                <p className="text-[#8a99ad] leading-relaxed text-xs sm:text-sm font-light flex-grow">
                  憑證安全校驗通過。核心圖形庫已成功加載，歡迎進入查看個人數位作品、原創概念藝術設計與視覺實驗。
                </p>
                <div className="text-[#ff007f] text-[11px] font-mono tracking-widest mt-6 flex items-center gap-1.5">
                  ACCESS_GRANTED // OPEN_CORE <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative bg-slate-950/20 border border-dashed border-white/5 p-6 sm:p-8 rounded backdrop-blur-sm opacity-50 flex flex-col h-full select-none">
              <div className="mb-4 sm:mb-6 w-11 h-11 sm:w-12 sm:h-12 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-mono text-base sm:text-lg font-bold mb-2.5 sm:mb-3 tracking-wider text-slate-500">Private Collection</h3>
              <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed flex-grow">
                此矩陣節點已高度加密。僅限特定的安全帳戶或 VIP 使用者授權存取。您可以透過下方通訊埠提交權限申請（Token）。
              </p>
              <div className="text-slate-700 text-[11px] font-mono tracking-widest mt-6">
                ENCRYPTED_SIGNAL_LOCK //
              </div>
            </div>
          )}
        </div>
      </section>

      {/* F. 聯絡我表單區 */}
      <section id="contact" className="max-w-xl mx-auto py-16 md:py-24 px-4 sm:px-6 relative z-20 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">訊號對接端點</h2>
          <p className="text-slate-500 font-mono text-[10px] sm:text-xs mt-2 tracking-wider">SECURE SIGNAL UPLOADER</p>
        </div>
        
        <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5 sm:space-y-6 bg-slate-900/20 border border-white/5 p-6 sm:p-10 relative backdrop-blur-md">
          <input type="hidden" name="access_key" value="abce0b1a-895b-44ed-88af-013c8c2166ca" />
          
          <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-16 h-[1px] bg-[#00f3ff]/30 rotate-45 pointer-events-none" />

          <div className="grid sm:grid-cols-2 gap-5 font-mono">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2">Identity / 姓名</label>
              <input 
                type="text" 
                name="name" 
                required 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-none p-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all font-light text-xs md:cursor-text"
                placeholder="Your Identity"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2">Vector / 信箱</label>
              <input 
                type="email" 
                name="email" 
                required 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-none p-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all font-light text-xs md:cursor-text"
                placeholder="name@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Payload / 傳輸內容</label>
            <textarea 
              name="message" 
              rows={5} 
              required 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-none p-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f] transition-all font-light text-xs resize-none md:cursor-text"
              placeholder="Write core packets here..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full bg-transparent border border-[#00f3ff] text-white hover:bg-[#00f3ff] hover:text-black py-3.5 sm:py-4 font-mono font-bold tracking-[0.3em] text-xs transition-all duration-300 uppercase shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
          >
            Transmit Signal
          </button>
        </form>
      </section>

      {/* G. 頁尾 */}
      <footer className="max-w-6xl mx-auto py-12 text-center text-[10px] font-mono text-slate-600 border-t border-white/5 relative z-10 tracking-[0.2em]">
        © {new Date().getFullYear()} YUXI. STABLE_CORE_V2. // ALL SYSTEMS OPERATIONAL.
      </footer>
      
    </div>
  );
}