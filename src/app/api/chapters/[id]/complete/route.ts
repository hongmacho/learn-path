import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const chapter = db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.id, params.id))
      .get();

    if (!chapter) {
      return NextResponse.json(
        { error: '챕터를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    db.update(schema.chapters)
      .set({
        isCompleted: !chapter.isCompleted,
        completedAt: !chapter.isCompleted ? now : null,
        updatedAt: now,
      })
      .where(eq(schema.chapters.id, params.id))
      .run();

    const updated = db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.id, params.id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to toggle chapter completion:', error);
    return NextResponse.json(
      { error: '챕터 완료 상태를 변경할 수 없습니다.' },
      { status: 500 }
    );
  }
}
