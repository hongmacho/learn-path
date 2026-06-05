'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { CATEGORIES, DIFFICULTIES, calculateProgress, formatDate } from '@/lib/utils';

interface Chapter {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  isCompleted: boolean;
  completedAt: string | null;
}

interface Path {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedWeeks: number;
  chapters: Chapter[];
}

export default function PathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.id as string;

  const [path, setPath] = useState<Path | null>(null);
  const [newChapter, setNewChapter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPath();
  }, [pathId]);

  async function fetchPath() {
    try {
      const res = await fetch(`/api/paths/${pathId}`);
      if (res.ok) {
        const data = await res.json();
        setPath(data);
      }
    } catch (error) {
      console.error('Failed to fetch path:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleChapterComplete(chapterId: string) {
    try {
      const res = await fetch(`/api/chapters/${chapterId}/complete`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchPath();
      }
    } catch (error) {
      console.error('Failed to toggle chapter:', error);
    }
  }

  async function addChapter(e: React.FormEvent) {
    e.preventDefault();
    if (!newChapter.trim()) return;

    try {
      const res = await fetch(`/api/paths/${pathId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newChapter,
          orderIndex: (path?.chapters.length || 0) + 1,
        }),
      });

      if (res.ok) {
        setNewChapter('');
        fetchPath();
      }
    } catch (error) {
      console.error('Failed to add chapter:', error);
    }
  }

  async function deleteChapter(chapterId: string) {
    if (!confirm('이 챕터를 삭제하시겠어요?')) return;

    try {
      await fetch(`/api/chapters/${chapterId}`, { method: 'DELETE' });
      fetchPath();
    } catch (error) {
      console.error('Failed to delete chapter:', error);
    }
  }

  async function deletePath() {
    if (!confirm('이 경로를 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const res = await fetch(`/api/paths/${pathId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/paths');
      }
    } catch (error) {
      console.error('Failed to delete path:', error);
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-12 mb-8 w-2/3" />
          <Skeleton className="h-48 mb-8" />
        </main>
      </>
    );
  }

  if (!path) {
    return (
      <>
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center h-48">
              <p>경로를 찾을 수 없습니다.</p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const completedCount = path.chapters.filter((c) => c.isCompleted).length;
  const progress = calculateProgress(completedCount, path.chapters.length);

  const getCategoryLabel = (category: string) => {
    const found = CATEGORIES.find((c) => c.value === category);
    return found?.label || category;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const found = DIFFICULTIES.find((d) => d.value === difficulty);
    return found?.label || difficulty;
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{path.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{path.description}</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">{getCategoryLabel(path.category)}</Badge>
              <Badge variant="outline">{getDifficultyLabel(path.difficulty)}</Badge>
              <Badge variant="outline">{path.estimatedWeeks}주 예상</Badge>
            </div>
          </div>
          <Button variant="destructive" onClick={deletePath}>
            삭제
          </Button>
        </div>

        {/* 진행 상황 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>진행 상황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">전체 진행률</span>
                  <span className="text-lg font-bold">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {completedCount}개 / {path.chapters.length}개 완료
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 챕터 목록 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>챕터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {path.chapters
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={chapter.isCompleted}
                      onChange={() => toggleChapterComplete(chapter.id)}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          chapter.isCompleted
                            ? 'line-through text-slate-500'
                            : 'text-slate-950 dark:text-slate-50'
                        }`}
                      >
                        {index + 1}. {chapter.title}
                      </div>
                      {chapter.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {chapter.description}
                        </p>
                      )}
                      {chapter.completedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {formatDate(chapter.completedAt)} 완료
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteChapter(chapter.id)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}

              {/* 새 챕터 추가 */}
              <form onSubmit={addChapter} className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="새 챕터 추가..."
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 text-sm"
                />
                <Button type="submit" size="sm">
                  추가
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* 학습 기록 */}
        <div>
          <Link href="/logs/new">
            <Button className="w-full">이 경로에서 학습 기록 남기기</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
