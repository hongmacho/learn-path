import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const path = db
      .select()
      .from(schema.learningPaths)
      .where(eq(schema.learningPaths.id, id))
      .get();

    if (!path) {
      return NextResponse.json(
        { error: '경로를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const chapters = db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.pathId, id))
      .orderBy(schema.chapters.orderIndex)
      .all();

    return NextResponse.json({ ...path, chapters });
  } catch (error) {
    console.error('Failed to fetch path:', error);
    return NextResponse.json(
      { error: '경로를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, category, difficulty, estimatedWeeks } = body;

    const db = getDb();
    db.update(schema.learningPaths)
      .set({
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        category: category || undefined,
        difficulty: difficulty || undefined,
        estimatedWeeks: estimatedWeeks || undefined,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.learningPaths.id, id))
      .run();

    const updated = db
      .select()
      .from(schema.learningPaths)
      .where(eq(schema.learningPaths.id, id))
      .get();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update path:', error);
    return NextResponse.json(
      { error: '경로를 수정할 수 없습니다.' },
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
    db.delete(schema.learningPaths)
      .where(eq(schema.learningPaths.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete path:', error);
    return NextResponse.json(
      { error: '경로를 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
}
