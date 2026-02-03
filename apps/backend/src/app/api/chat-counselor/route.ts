import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { ChatRequestSchema, type ChatResponse } from "./lib/types";
import { analyzeMessage } from "./lib/analyzer";
import { determinePolicy } from "./lib/policy";
import { generateResponse, getFallbackResponse } from "./lib/generator";

export async function POST(request: NextRequest) {
  try {
    // リクエストのパース
    const body = await request.json();
    const parseResult = ChatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      logger.warn({ errors: parseResult.error.errors }, "Invalid chat request");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Invalid request body",
          details: parseResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { message, conversationHistory } = parseResult.data;

    // Step 1: メッセージ分析
    const analysis = analyzeMessage(message);
    logger.debug({ analysis }, "Message analyzed");

    // Step 2: 応答ポリシー決定
    const policy = determinePolicy(analysis);
    logger.debug({ policy }, "Policy determined");

    // Step 3: 応答生成
    let response: string;
    try {
      response = await generateResponse(message, analysis, policy, conversationHistory);
    } catch (error) {
      logger.error({ error }, "Failed to generate OpenAI response, using fallback");
      response = getFallbackResponse(analysis);
    }

    const result: ChatResponse = {
      response,
      analysis,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    logger.error({ error }, "Failed to process chat request");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
