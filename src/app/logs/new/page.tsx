'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { getTodayDate } from '@/lib/utils';

interface Path {
  id: string;
  title: string;
}

interface Chapter {
  id: string;
  title: string;
}

export default function NewLogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPathId = searchParams.get('pathId');

  const [paths, setPaths] = useState<Path[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pathId: defaultPathId || '',
    chapterId: '',
    content: '',
    durationMinutes: 30,
    loggedAt: getTodayDate(),
  });

  useEffect(() => {
    fetchPaths();
  }, []);

  useEffect(() => {
    if (formData.pathId) {
      fetchChapters(formData.pathId);
    } else {
      setChapters([]);
      setFormData((prev) => ({ ...prev, chapterId: '' }));
    }
  }, [formData.pathId]);

  async function fetchPaths() {
    try {
      const res = await fetch('/api/paths');
      const data = await res.json();
      setPaths(data);
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchChapters(pathId: string) {
    try {
      const res = await fetch(`/api/paths/${pathId}/chapters`);
      const data = await res.json();
      setChapters(data.sort((a: Chapter, b: Chapter) => a.id.localeCompare(b.id)));
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.pathId || !formData.content.trim()) {
      alert('필수 필드를 입력해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/');
      } else {
        alert('학습 기록을 저장할 수 없습니다.');
      }
    } catch (error) {
      console.error('Failed to save log:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">학습 기록 남기기</h1>
            <p className="text-slate-600 dark:text-slate-400">
              오늘 배운 내용을 기록하세요.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>학습 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">학습 경로</label>
                  {loading ? (
                    <Skeleton className="h-10" />
                  ) : (
                    <select
                      value={formData.pathId}
                      onChange={(e) =>
                        setFormData({ ...formData, pathId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950"
                      required
                    >
                      <option value="">-- 경로 선택 --</option>
                      {paths.map((path) => (
                        <option key={path.id} value={path.id}>
                          {path.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {formData.pathId && chapters.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      챕터 (선택)
                    </label>
                    <select
                      value={formData.chapterId}
                      onChange={(e) =>
                        setFormData({ ...formData, chapterId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950"
                    >
                      <option value="">-- 챕터 선택 안 함 --</option>
                      {chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    학습 내용
                  </label>
                  <Textarea
                    placeholder="오늘 배운 내용을 자유롭게 적어주세요."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      소요 시간 (분)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMinutes: parseInt(e.target.value) || 30,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">날짜</label>
                    <Input
                      type="date"
                      value={formData.loggedAt}
                      onChange={(e) =>
                        setFormData({ ...formData, loggedAt: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? '저장 중...' : '기록 저장'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
