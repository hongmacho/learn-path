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
    const chapters = db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.pathId, id))
      .orderBy(schema.chapters.orderIndex)
      .all();

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    return NextResponse.json(
      { error: '챕터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, orderIndex } = body;

    if (!title) {
      return NextResponse.json(
        { error: '제목을 입력해주세요.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const chapterId = crypto.randomUUID();

    db.insert(schema.chapters)
      .values({
        id: chapterId,
        pathId: id,
        title,
        description: description || '',
        orderIndex: orderIndex || 0,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .run();

    const newChapter = db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.id, chapterId))
      .get();

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    console.error('Failed to create chapter:', error);
    return NextResponse.json(
      { error: '챕터를 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
}
