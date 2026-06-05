import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, orderIndex } = body;

    const db = getDb();
    db.update(schema.chapters)
      .set({
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        orderIndex: orderIndex !== undefined ? orderIndex : undefined,
        updatedAt: new Date().toISOString(),
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
    console.error('Failed to update chapter:', error);
    return NextResponse.json(
      { error: '챕터를 수정할 수 없습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    db.delete(schema.chapters)
      .where(eq(schema.chapters.id, params.id))
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete chapter:', error);
    return NextResponse.json(
      { error: '챕터를 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
}
