// app/api/protected/route.ts
// app/api/my-notes/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 模擬資料庫中的資料（每個資料都綁定一個 userId）
const mockDatabase = [
  { id: 1, userId: "user_2p6...", content: "由汐的秘密筆記 A" },
  { id: 2, userId: "user_2p6...", content: "由汐的秘密筆記 B" },
  { id: 3, userId: "other_user", content: "別人的私密資料" },
];

export async function GET() {
  // 1. 取得目前發送請求的使用者 ID
  const { userId } = await auth();

  // 2. 如果沒登入，直接擋掉
  if (!userId) {
    return NextResponse.json({ error: "請先登入以查看私人資料" }, { status: 401 });
  }

  // 3. 關鍵：根據 userId 過濾資料，確保 A 看不到 B 的東西
  const myData = mockDatabase.filter(item => item.userId === userId);

  return NextResponse.json({
    success: true,
    owner: userId,
    data: myData
  });
}