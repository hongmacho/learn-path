'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { CATEGORIES } from '@/lib/utils';

interface StatsData {
  totalMinutes: number;
  logsCount: number;
  categoryStats: Record<string, number>;
  dailyStats: Record<string, number>;
  currentStreak: number;
  period: string;
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  async function fetchStats() {
    setLoading(true);
    try {
      const res = await fetch(`/api/stats?period=${period}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const getCategoryLabel = (category: string) => {
    const found = CATEGORIES.find((c) => c.value === category);
    return found?.label || category;
  };

  const getDailyData = () => {
    if (!stats) return [];
    return Object.entries(stats.dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, minutes]) => ({
        date,
        minutes,
        hours: (minutes / 60).toFixed(1),
      }));
  };

  const totalHours = stats ? Math.round(stats.totalMinutes / 60) : 0;
  const averagePerDay = stats && stats.logsCount > 0 ? Math.round(stats.totalMinutes / stats.logsCount) : 0;

  return (
    <>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">학습 통계</h1>
          <p className="text-slate-600 dark:text-slate-400">
            당신의 학습 진행 상황을 한눈에 확인하세요.
          </p>
        </div>

        {/* 기간 선택 */}
        <div className="mb-8 flex gap-2">
          <Button
            variant={period === 'week' ? 'default' : 'outline'}
            onClick={() => setPeriod('week')}
          >
            주간
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            onClick={() => setPeriod('month')}
          >
            월간
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">총 학습 시간</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div>
                  <div className="text-3xl font-bold">{totalHours}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    시간
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">학습 횟수</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div>
                  <div className="text-3xl font-bold">{stats?.logsCount || 0}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    회
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">평균 시간</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div>
                  <div className="text-3xl font-bold">{averagePerDay}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    분/회
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">연속 학습일</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div>
                  <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    일
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 일일 학습 시간 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>일별 학습 시간</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-48" />
            ) : getDailyData().length === 0 ? (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                이 기간에 학습 기록이 없습니다.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getDailyData().map(({ date, hours }) => {
                  const dateObj = new Date(date);
                  const formattedDate = dateObj.toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div key={date} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium">{formattedDate}</div>
                      <div className="flex-1 bg-blue-100 dark:bg-blue-950 rounded-full h-8 flex items-center px-3">
                        <div className="w-full bg-blue-600 h-full rounded-full flex items-center justify-end pr-3">
                          {hours === '0.0' ? null : (
                            <span className="text-white text-xs font-medium">{hours}h</span>
                          )}
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm text-slate-600 dark:text-slate-400">
                        {hours}시간
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 카테고리별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 학습 경로</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-48" />
            ) : Object.keys(stats?.categoryStats || {}).length === 0 ? (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                카테고리별 데이터가 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats?.categoryStats || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium">
                        {getCategoryLabel(category)}
                      </div>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full h-8 flex items-center px-3">
                        <div
                          className="bg-slate-600 h-full rounded-full flex items-center justify-end pr-3"
                          style={{
                            width: `${
                              ((count as number) /
                                Math.max(
                                  ...(Object.values(stats?.categoryStats || {}) as number[])
                                )) *
                              100
                            }%`,
                          }}
                        >
                          {count > 0 && (
                            <span className="text-white text-xs font-medium">
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-8 text-right text-sm text-slate-600 dark:text-slate-400">
                        {count}개
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
