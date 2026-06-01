"use client"; // 告訴 Next.js 這是一個用戶端組件

import React, { useEffect, useRef, useState } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';
import { Cpu, Atom, ShieldAlert, ArrowRight } from 'lucide-react';

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
  const canAccessArt = isSignedIn && (
    user.primaryEmailAddress?.emailAddress === "your-email@gmail.com" || 
    user.publicMetadata.role === "vips"
  );

  // --- 2. 核心特效狀態與 Ref 宣告 ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [cursorBlurPos, setCursorBlurPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 動態矩陣卡片的 Spotlight Refs
  const cardRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
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

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-[#e2e8f0] select-none overflow-x-hidden font-sans cursor-none
      bg-[linear-gradient(to_right,rgba(0,243,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]">
      
      {/* 核心環境深層極光 */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* A. 客製化量子滑鼠指標 (完美阻斷點擊穿透) */}
      <div 
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-screen transition-all duration-150 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mouse.x}px`,
          top: `${mouse.y}px`,
          width: isHovered ? '28px' : '8px',
          height: isHovered ? '28px' : '8px',
          backgroundColor: isHovered ? 'rgba(255, 0, 127, 0.85)' : '#00f3ff',
          boxShadow: isHovered ? '0 0 20px #ff007f, inset 0 0 8px #white' : '0 0 12px #00f3ff'
        }}
      />
      <div 
        className="fixed pointer-events-none z-[9998] rounded-full border transition-transform duration-75 opacity-40 -translate-x-1/2 -translate-y-1/2"
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

      {/* C. 頂部高階感導覽列 (玻璃擬態與 Clerk 認證鎖) */}
      <nav className="fixed top-0 left-0 w-full px-6 md:px-16 h-24 flex justify-between items-center z-50 bg-[#050508]/40 backdrop-blur-md border-b border-white/5">
        <div className="font-mono font-black text-lg tracking-[4px] text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
          MIN_CORE //
        </div>
        
        <div className="flex items-center space-x-10">
          <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] font-mono uppercase">
            <a href="#projects" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="text-slate-400 hover:text-[#00f3ff] transition-colors relative group">// MATRIX</a>
            <a href="#contact" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="text-slate-400 hover:text-[#ff007f] transition-colors relative group">// SIGNAL</a>
          </div>

          {/* Clerk 功能完全不漏 */}
          <div className="flex items-center space-x-3 border-l border-white/10 pl-6">
            {isLoaded && !isSignedIn && (
              <div className="flex items-center space-x-3 font-mono text-xs tracking-wider">
                <SignInButton mode="modal">
                  <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="text-slate-400 hover:text-white transition px-2 py-1">
                    LOGIN
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="bg-white text-black px-4 py-2 font-bold hover:bg-[#00f3ff] transition shadow-[0_0_15px_rgba(0,243,255,0.2)]">
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

      {/* D. 主視覺 Section (名字高擬真細緻排版) */}
      <header className="max-w-6xl mx-auto min-h-screen pt-20 px-6 md:px-12 grid md:grid-cols-12 gap-12 items-center relative z-20">
        <div className="md:col-span-7 text-center md:text-left space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-white/5 font-mono text-[10px] tracking-[3px] text-[#00f3ff] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-pulse" />
            NODE_STATUS // ONLINE
          </div>

          <h1 className="font-mono text-4xl sm:text-6xl font-black tracking-[4px] leading-none uppercase text-white">
            QUANTUM AURA <br />
            <span className="text-slate-400 text-2xl sm:text-3xl tracking-[0.15em] font-light block mt-4 mb-2">這裡是</span>
            <span className="inline-block tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] via-blue-500 to-[#ff007f] drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">
              Dieh.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base tracking-[2px] text-[#8a99ad] max-w-lg leading-relaxed uppercase">
            歡迎來到我的數位觀測站。此處專注於全端網絡架構、多媒體感測互動、以及次世代視覺維度的解構實驗。
          </p>
          
          <div className="flex justify-center md:justify-start gap-4 pt-2 font-mono text-xs tracking-widest">
            <a href="#projects" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              className="px-6 py-3 border border-[#00f3ff]/50 text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
              CONNECT_MATRIX
            </a>
            <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              className="px-6 py-3 border border-white/10 hover:border-[#ff007f] text-slate-400 hover:text-[#ff007f] transition-all duration-300">
              DOWNLOAD_CV
            </button>
          </div>
        </div>
        
        {/* 右側：不對稱科技線條幾何頭像 */}
        <div className="md:col-span-5 flex justify-center relative">
          <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] group">
            <div className="absolute -inset-3 border border-white/5 pointer-events-none group-hover:border-[#00f3ff]/20 transition-colors duration-500" />
            <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]" />
            <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-[#ff007f]" />
            
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
      <section id="projects" className="max-w-6xl mx-auto px-6 md:px-12 py-24 z-20 relative scroll-mt-20">
        <div className="mb-14 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-[#00f3ff] tracking-[0.3em] block mb-2">// DATA_ARRAY</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">精選專案矩陣</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 專案一：全端網頁 */}
          <Link href="#">
            <div
              ref={cardRefs[0]}
              onMouseMove={(e) => handleCardMouseMove(e, 0)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative bg-[rgba(255,255,255,0.01)] border border-white/5 p-8 rounded backdrop-blur-md overflow-hidden group transition-all duration-300
                hover:-translate-y-1.5 hover:border-[#00f3ff] hover:shadow-[0_10px_30px_rgba(0,243,255,0.08)]
                before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(500px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(0,243,255,0.05),transparent_40%)] flex flex-col h-full"
            >
              <div className="mb-6 w-12 h-12 rounded bg-slate-900/80 border border-white/5 flex items-center justify-center text-[#00f3ff] group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-mono text-lg font-bold mb-3 tracking-wider text-white">我的第一個全端網頁</h3>
              <p className="text-[#8a99ad] leading-relaxed text-sm font-light flex-grow">
                整合後端安全雲端資料架構與前端極致動態渲染，完美對接伺服器核心數據，實現高度流暢的全端互動封包。
              </p>
              <div className="text-[#00f3ff] text-xs font-mono tracking-widest mt-6 flex items-center gap-1.5">
                EXEC_MODULE <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* 專案二：繪畫收藏區 (Clerk VIP 邏輯完全鎖定保護) */}
          {canAccessArt ? (
            <Link href="/project/my-gallery">
              <div
                ref={cardRefs[1]}
                onMouseMove={(e) => handleCardMouseMove(e, 1)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative bg-[rgba(255,255,255,0.01)] border border-[#ff007f]/30 p-8 rounded backdrop-blur-md overflow-hidden group transition-all duration-300
                  hover:-translate-y-1.5 hover:border-[#ff007f] hover:shadow-[0_10px_30px_rgba(255,0,127,0.08)]
                  before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(500px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(255,0,127,0.05),transparent_40%)] flex flex-col h-full"
              >
                <div className="mb-6 w-12 h-12 rounded bg-purple-950/20 border border-[#ff007f]/20 flex items-center justify-center text-[#ff007f] group-hover:scale-110 transition-transform">
                  <Atom className="w-6 h-6 animate-spin-slow" />
                </div>
                <h3 className="font-mono text-lg font-bold mb-3 tracking-wider text-[#ff007f]">我的繪畫收藏 ( 已解鎖 )</h3>
                <p className="text-[#8a99ad] leading-relaxed text-sm font-light flex-grow">
                  憑證安全校驗通過。核心圖形庫已成功加載，歡迎進入查看個人數位電繪、原創概念藝術設計與視覺實驗。
                </p>
                <div className="text-[#ff007f] text-xs font-mono tracking-widest mt-6">
                  ACCESS_GRANTED // OPEN_CORE *
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative bg-slate-950/20 border border-dashed border-white/5 p-8 rounded backdrop-blur-sm opacity-50 flex flex-col h-full select-none">
              <div className="mb-6 w-12 h-12 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-mono text-lg font-bold mb-3 tracking-wider text-slate-500">私密繪畫作品</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed flex-grow">
                此矩陣節點已高度加密。僅限特定的安全帳戶或 VIP 使用者授權存取。您可以透過下方通訊埠提交權限申請（Token）。
              </p>
              <div className="text-slate-700 text-xs font-mono tracking-widest mt-6">
                ENCRYPTED_SIGNAL_LOCK //
              </div>
            </div>
          )}
        </div>
      </section>

      {/* F. 聯絡我表單區 (Web3Forms 高科技終端介面) */}
      <section id="contact" className="max-w-xl mx-auto py-24 px-6 relative z-20 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">訊號對接端點</h2>
          <p className="text-slate-500 font-mono text-xs mt-2 tracking-wider">SECURE SIGNAL UPLOADER</p>
        </div>
        
        <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6 bg-slate-900/20 border border-white/5 p-8 sm:p-10 relative backdrop-blur-md">
          <input type="hidden" name="access_key" value="abce0b1a-895b-44ed-88af-013c8c2166ca" />
          
          <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-16 h-[1px] bg-[#00f3ff]/30 rotate-45 pointer-events-none" />

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Identity / 姓名</label>
              <input 
                type="text" 
                name="name" 
                required 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-none p-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all font-light text-xs cursor-text"
                placeholder="Your Identity"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Vector / 信箱</label>
              <input 
                type="email" 
                name="email" 
                required 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-none p-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all font-light text-xs cursor-text"
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
              className="w-full bg-slate-950/80 border border-white/10 rounded-none p-3 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f] transition-all font-light text-xs resize-none cursor-text"
              placeholder="Write core packets here..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full bg-transparent border border-[#00f3ff] text-white hover:bg-[#00f3ff] hover:text-black py-4 font-mono font-bold tracking-[0.3em] text-xs transition-all duration-300 uppercase shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
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