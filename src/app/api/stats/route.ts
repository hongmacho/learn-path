import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { gte, lte } from 'drizzle-orm';
import { getTodayDate, getWeekStartDate, getMonthStartDate } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month'; // week, month

    let startDate = '';
    if (period === 'week') {
      const weekStart = getWeekStartDate();
      startDate = weekStart.toISOString().split('T')[0];
    } else {
      const monthStart = getMonthStartDate();
      startDate = monthStart.toISOString().split('T')[0];
    }

    const today = getTodayDate();

    // 기간 내 학습 기록
    const logs = db
      .select()
      .from(schema.studyLogs)
      .where(
        lte(schema.studyLogs.loggedAt, today) as any
      )
      .all()
      .filter((log) => log.loggedAt >= startDate);

    // 카테고리별 통계
    const paths = db.select().from(schema.learningPaths).all();

    const categoryStats: Record<string, number> = {};
    paths.forEach((path) => {
      categoryStats[path.category] = (categoryStats[path.category] || 0) + 1;
    });

    // 일별 학습 시간
    const dailyStats: Record<string, number> = {};
    logs.forEach((log) => {
      dailyStats[log.loggedAt] = (dailyStats[log.loggedAt] || 0) + log.durationMinutes;
    });

    // 현재 연속 학습일
    const streakDates = logs.map((log) => log.loggedAt);
    let currentStreak = 0;
    if (streakDates.length > 0) {
      const sortedDates = [...new Set(streakDates)].sort().reverse();
      if (sortedDates[0] === today ||
          (new Date(sortedDates[0]).getTime() === new Date(today).getTime() - 86400000)) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const current = new Date(sortedDates[i]);
          const previous = new Date(sortedDates[i - 1]);
          const diffDays = Math.ceil(
            (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    return NextResponse.json({
      totalMinutes: logs.reduce((sum, log) => sum + log.durationMinutes, 0),
      logsCount: logs.length,
      categoryStats,
      dailyStats,
      currentStreak,
      period,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: '통계를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
