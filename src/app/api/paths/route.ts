import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { v4 as uuidv4 } from 'uuid';
import { eq, like, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    let query = db
      .select()
      .from(schema.learningPaths)
      .where(eq(schema.learningPaths.isActive, true));

    if (search) {
      query = query.where(
        like(schema.learningPaths.title, `%${search}%`)
      ) as any;
    }

    if (category) {
      query = query.where(
        eq(schema.learningPaths.category, category)
      ) as any;
    }

    const paths = query.all();
    return NextResponse.json(paths);
  } catch (error) {
    console.error('Failed to fetch paths:', error);
    return NextResponse.json(
      { error: '경로를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      difficulty,
      estimatedWeeks,
    } = body;

    if (!title || !category || !difficulty) {
      return NextResponse.json(
        { error: '필수 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = uuidv4();

    db.insert(schema.learningPaths).values({
      id,
      title,
      description: description || '',
      category,
      difficulty,
      estimatedWeeks: estimatedWeeks || 4,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).run();

    const newPath = db
      .select()
      .from(schema.learningPaths)
      .where(eq(schema.learningPaths.id, id))
      .get();

    return NextResponse.json(newPath, { status: 201 });
  } catch (error) {
    console.error('Failed to create path:', error);
    return NextResponse.json(
      { error: '경로를 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
}
