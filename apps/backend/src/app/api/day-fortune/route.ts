import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { DayFortuneRequestSchema, type DayFortuneResponse } from "./lib/types";
import { getDayHeavenlyStem, determineTenGod, getTenGodDescription } from "./lib/tengan-system";
import { getOverallFortune, getAllCategoryFortunes } from "./lib/fortune-data";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userHeavenlyStem = searchParams.get("userHeavenlyStem");
    const dateParam = searchParams.get("date");

    // バリデーション
    const parseResult = DayFortuneRequestSchema.safeParse({
      userHeavenlyStem,
      date: dateParam || undefined,
    });

    if (!parseResult.success) {
      logger.warn({ errors: parseResult.error.errors }, "Invalid day-fortune request");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "userHeavenlyStem must be one of: 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸",
          details: parseResult.error.errors,
        },
        { status: 400 }
      );
    }

    // 日付の処理
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    if (Number.isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid date format. Use ISO 8601 format (YYYY-MM-DD)." },
        { status: 400 }
      );
    }

    const { userHeavenlyStem: stem } = parseResult.data;

    // 天干と十神の計算
    const dayHeavenlyStem = getDayHeavenlyStem(targetDate);
    const tenGod = determineTenGod(stem, dayHeavenlyStem);
    const tenGodDescription = getTenGodDescription(tenGod);

    // 運勢データの取得
    const overallFortune = getOverallFortune(tenGod);
    const categoryFortunes = getAllCategoryFortunes(tenGod);

    const response: DayFortuneResponse = {
      date: targetDate.toISOString().split("T")[0],
      userHeavenlyStem: stem,
      dayHeavenlyStem,
      tenGod,
      tenGodDescription,
      overallScore: overallFortune.score,
      overallMessage: overallFortune.message,
      categories: categoryFortunes,
      luckyColor: overallFortune.luckyColor,
      luckyItem: overallFortune.luckyItem,
      luckyDirection: overallFortune.luckyDirection,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error({ error }, "Failed to get day fortune");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
