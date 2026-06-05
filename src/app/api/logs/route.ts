import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq, and, gte, lte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const pathId = searchParams.get('pathId');

    let query = db.select().from(schema.studyLogs);

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(schema.studyLogs.loggedAt, startDate),
          lte(schema.studyLogs.loggedAt, endDate)
        )
      ) as any;
    }

    if (pathId) {
      query = query.where(eq(schema.studyLogs.pathId, pathId)) as any;
    }

    const logs = query.orderBy(schema.studyLogs.loggedAt).all();
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return NextResponse.json(
      { error: '학습 기록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathId, chapterId, content, durationMinutes, loggedAt } = body;

    if (!pathId || !content) {
      return NextResponse.json(
        { error: '필수 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const logId = uuidv4();

    db.insert(schema.studyLogs)
      .values({
        id: logId,
        pathId,
        chapterId: chapterId || null,
        content,
        durationMinutes: durationMinutes || 30,
        loggedAt: loggedAt || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      })
      .run();

    const newLog = db
      .select()
      .from(schema.studyLogs)
      .where(eq(schema.studyLogs.id, logId))
      .get();

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error('Failed to create log:', error);
    return NextResponse.json(
      { error: '학습 기록을 저장할 수 없습니다.' },
      { status: 500 }
    );
  }
}
