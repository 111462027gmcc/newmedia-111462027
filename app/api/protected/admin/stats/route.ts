// app/api/admin/stats/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. 從 sessionClaims 中取得使用者資訊
  const { sessionClaims } = await auth();

  // 2. 檢查 metadata 裡的 role 是否為 admin
  // 注意：sessionClaims.metadata 預設在 TypeScript 可能需要定義型別或使用 any
  const userRole = (sessionClaims as any)?.metadata?.role;

  if (userRole !== "admin") {
    return NextResponse.json(
      { error: "權限不足，僅限管理員存取" }, 
      { status: 403 } // 403 Forbidden 代表「我知道你是誰，但你沒權限」
    );
  }

  // 3. 通過驗證，回傳敏感數據
  return NextResponse.json({
    message: "歡迎回來，管理員！",
    stats: {
      totalViews: 1250,
      totalMessages: 45,
      serverStatus: "Healthy"
    }
  });
}