'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { calculateProgress } from '@/lib/utils';

interface Path {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  chapters?: any[];
}

export default function Dashboard() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [pathRes, statsRes] = await Promise.all([
        fetch('/api/paths'),
        fetch('/api/stats'),
      ]);

      const pathData = await pathRes.json();
      const statsData = await statsRes.json();

      setPaths(pathData.slice(0, 3));
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    const map: Record<string, string> = {
      BEGINNER: '초급',
      INTERMEDIATE: '중급',
      ADVANCED: '고급',
    };
    return map[difficulty] || difficulty;
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      FRONTEND: '프론트엔드',
      BACKEND: '백엔드',
      AI_ML: 'AI/ML',
      LANGUAGE: '언어',
      MOBILE: '모바일',
      DEVOPS: 'DevOps',
      OTHER: '기타',
    };
    return map[category] || category;
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">대시보드</h1>
          <p className="text-slate-600 dark:text-slate-400">
            오늘도 화이팅! 당신의 학습 진도를 확인하세요.
          </p>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">연속 학습일</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                일 연속으로 학습 중
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">이번 주 학습</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">
                  {Math.round((stats?.totalMinutes || 0) / 60)}시간
                </div>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                총 {stats?.logsCount || 0}건 기록
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">진행 중인 경로</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{paths.length}</div>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                개의 경로 진행 중
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 진행 중인 경로 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">진행 중인 경로</h2>
            <Link href="/paths">
              <Button variant="outline">모두 보기</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : paths.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">아직 학습 경로가 없어요</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    첫 번째 경로를 만들어 보세요!
                  </p>
                  <Link href="/paths/new">
                    <Button>경로 추가</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paths.map((path) => {
                const completedChapters = path.chapters?.filter((c) => c.isCompleted).length || 0;
                const totalChapters = path.chapters?.length || 0;
                const progress = calculateProgress(completedChapters, totalChapters);

                return (
                  <Link key={path.id} href={`/paths/${path.id}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{path.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {totalChapters}개 챕터
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{getDifficultyLabel(path.difficulty)}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                진행률
                              </span>
                              <span className="text-sm font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                              {getCategoryLabel(path.category)}
                            </span>
                            <span className="font-medium">
                              {completedChapters}/{totalChapters}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 오늘 할 일 */}
        <Card>
          <CardHeader>
            <CardTitle>오늘 할 일</CardTitle>
            <CardDescription>아직 학습을 시작하지 않았어요. 지금 시작해 보세요!</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/logs/new">
              <Button className="w-full md:w-auto">학습 기록 남기기</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
