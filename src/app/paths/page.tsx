'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { CATEGORIES, calculateProgress } from '@/lib/utils';

interface Path {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  chapters?: any[];
}

export default function PathsPage() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<Path[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaths();
  }, []);

  useEffect(() => {
    let filtered = paths;

    if (search) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredPaths(filtered);
  }, [paths, search, selectedCategory]);

  async function fetchPaths() {
    try {
      const res = await fetch('/api/paths');
      const data = await res.json();

      // 각 경로의 챕터 정보 가져오기
      const pathsWithChapters = await Promise.all(
        data.map(async (path: Path) => {
          const chapterRes = await fetch(`/api/paths/${path.id}/chapters`);
          const chapters = await chapterRes.json();
          return { ...path, chapters };
        })
      );

      setPaths(pathsWithChapters);
    } catch (error) {
      console.error('Failed to fetch paths:', error);
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
    const found = CATEGORIES.find((c) => c.value === category);
    return found?.label || category;
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">학습 경로</h1>
            <p className="text-slate-600 dark:text-slate-400">
              새로운 기술을 배우는 여정을 시작하세요.
            </p>
          </div>
          <Link href="/paths/new">
            <Button>새 경로 추가</Button>
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-4">
          <Input
            placeholder="제목 또는 설명으로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              size="sm"
            >
              전체
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.value)}
                size="sm"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 경로 목록 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredPaths.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  {search || selectedCategory ? '경로를 찾을 수 없어요' : '아직 경로가 없어요'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {search || selectedCategory
                    ? '검색 조건을 변경해 보세요.'
                    : '첫 번째 경로를 만들어 보세요!'}
                </p>
                <Link href="/paths/new">
                  <Button>경로 추가</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPaths.map((path) => {
              const completedChapters = path.chapters?.filter((c) => c.isCompleted).length || 0;
              const totalChapters = path.chapters?.length || 0;
              const progress = calculateProgress(completedChapters, totalChapters);

              return (
                <Link key={path.id} href={`/paths/${path.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="truncate">{path.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-2">
                            {path.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">
                          {getDifficultyLabel(path.difficulty)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
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
                            {completedChapters}/{totalChapters} 완료
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
      </main>
    </>
  );
}
