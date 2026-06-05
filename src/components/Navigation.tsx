'use client';

import Link from 'next/link';
import { Button } from './ui/button';

export default function Navigation() {
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">런패스</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/paths">
            <Button variant="ghost">경로</Button>
          </Link>
          <Link href="/stats">
            <Button variant="ghost">통계</Button>
          </Link>
          <Link href="/logs/new">
            <Button>기록하기</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
