import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, durationMinutes, loggedAt } = body;

    const db = getDb();
    db.update(schema.studyLogs)
      .set({
        content: content || undefined,
        durationMinutes: durationMinutes || undefined,
        loggedAt: loggedAt || undefined,
      })
      .where(eq(schema.studyLogs.id, id))
      .run();

    const updated = db
      .select()
      .from(schema.studyLogs)
      .where(eq(schema.studyLogs.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update log:', error);
    return NextResponse.json(
      { error: '학습 기록을 수정할 수 없습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.delete(schema.studyLogs)
      .where(eq(schema.studyLogs.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete log:', error);
    return NextResponse.json(
      { error: '학습 기록을 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
}
