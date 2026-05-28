"use client"; // 告訴 Next.js 這是一個用戶端組件

// 這裡多引入一個 useUser 勾子
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  // 取得登入狀態：isSignedIn 為 true 代表已登入
  const { isSignedIn, isLoaded, user } = useUser();

  // 定義權限邏輯：可以是特定的 Email，或是 Clerk 後台設定的 Metadata
  // 這裡先用 Email 示範，你可以改成你的 Email 或特定好友的 Email
  const canAccessArt = isSignedIn && (
    user.primaryEmailAddress?.emailAddress === "your-email@gmail.com" || 
    user.publicMetadata.role === "vips"
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* 導覽列 */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {/* 左側：Logo */}
          <span className="text-xl font-bold text-blue-600 cursor-pointer">Yuxi's Profile</span>
          
          {/* 右側：所有的選單與按鈕 */}
          <div className="flex items-center space-x-8">
            
            {/* 導航文字：作品、聯絡我 */}
            <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
              <a href="#projects" className="hover:text-blue-500 transition">作品</a>
              <a href="#contact" className="hover:text-blue-500 transition">聯絡我</a>
            </div>

            {/* 功能按鈕區塊：這裡根據登入狀態動態顯示 */}
            <div className="flex items-center space-x-3 border-l pl-8 border-gray-100">
              
              {/* 如果還在加載，可以先留空避免畫面跳動；加載完畢後，若未登入則顯示按鈕 */}
              {isLoaded && !isSignedIn && (
                <div className="flex items-center space-x-3">
                  <SignInButton mode="modal">
                    <button className="text-gray-600 hover:text-blue-600 font-medium text-sm transition px-3 py-2">
                      登入
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                      註冊
                    </button>
                  </SignUpButton>
                </div>
              )}

              {/* 如果已登入，只顯示 UserButton (頭像)，上面的登入註冊會因為條件不符而消失 */}
              {isSignedIn && (
                <UserButton/>
              )}
              
            </div>
          </div>
        </div>
      </nav>

      {/* 主視覺區 */}
      <header className="max-w-5xl mx-auto py-20 px-4">
        <h1 className="text-5xl font-bold mb-4 text-black">Hello ! 這裡是 <span className="text-blue-600">由汐 Yuxi / 明蝶</span></h1>
        <p className="text-xl text-gray-600 mb-8">歡迎來到我的個人網站，很高興認識你 ~</p>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">技術說明</button>
          <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg">下載履歷</button>
        </div>
        
        <div className="mb-6">
          <Image 
            src="/5.png" // 這裡的路徑會自動對應到 public 資料夾
            alt="我的頭像"
            width={700}
            height={700}
            className="rounded-full ml-auto border-4 border-blue-500"
          />
        </div>
      </header>

      {/* 作品展示區暫存位 */}
      
      
      {/* 作品展示區 */}
      <section id="projects" className="max-w-5xl mx-auto py-12 px-4 border-t scroll-mt-20">
        <h2 className="text-2xl font-bold mb-8 text-black">精選專案</h2>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* 1. 原有的全端網頁專案 */}
          <Link href="/projects/my-first-app">
            <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer group">
              <div className="w-full h-40 bg-slate-100 rounded-md mb-4 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 transition">
                專案圖片預留
              </div>
              <h3 className="font-bold text-xl group-hover:text-blue-600 text-black">我的第一個全端網頁</h3>
              <p className="text-gray-500 text-sm">點擊查看詳細開發過程與技術棧...</p>
              <span className="text-blue-500 text-xs font-semibold mt-4 inline-block">了解更多 →</span>
            </div>
          </Link>

          {/* 2. 繪畫作品：根據權限顯示不同內容 */}
          {canAccessArt ? (
            <Link href="/projects/my-gallery">
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200 bg-blue-50/30 hover:shadow-2xl transition-all cursor-pointer group h-full">
                <div className="w-full h-40 bg-blue-100 rounded-md mb-4 flex items-center justify-center text-blue-400">
                  🎨 進入私人畫廊
                </div>
                <h3 className="font-bold text-xl text-blue-600">我的繪畫收藏 ( 已解鎖 )</h3>
                <p className="text-gray-500 text-sm">點擊進入查看我的原創電繪作品。</p>
              </div>
            </Link>
          ) : (
            <div className="bg-gray-100 p-6 rounded-xl border border-dashed border-gray-300 opacity-75">
              <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400">
                🔒 內容已鎖定
              </div>
              <h3 className="font-bold text-xl text-gray-400">私密繪畫作品</h3>
              <p className="text-gray-400 text-sm">此區域僅限特定授權人員觀看，請聯絡我取得權限。</p>
            </div>
          )}
        </div>
      </section>
    <section id="contact" className="max-w-md mx-auto py-20 px-4 text-center">
      <h2 className="text-3xl font-bold mb-6 text-black">聯絡我</h2>
      {/* 使用 Web3Forms 服務，這不需要密碼，只需一個 Access Key */}
      <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4 text-left">
      {/* 請到 https://web3forms.com/ 申請免費 Key 並貼在這裡 */}
    <input type="hidden" name="access_key" value="abce0b1a-895b-44ed-88af-013c8c2166ca" />
    
      <div>
        <label className="block text-sm font-medium text-gray-700">你的姓名</label>
        <input type="text" name="name" required className="w-full border rounded-lg p-2 mt-1 text-black focus:ring-blue-500 focus:border-blue-500" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">你的信箱</label>
        <input type="email" name="email" required className="w-full border rounded-lg p-2 mt-1 text-black" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">想對我說的話</label>
        <textarea name="message" rows={4} required className="w-full border rounded-lg p-2 mt-1 text-black"></textarea>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
        傳送訊息
      </button>
    </form>
    </section>
      
    </div>
  );
}