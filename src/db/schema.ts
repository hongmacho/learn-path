import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

// 학습 경로 테이블
export const learningPaths = sqliteTable('learning_paths', {
  id: text('id').primaryKey(),
  title: text('title').notNull().unique(),
  description: text('description'),
  category: text('category').notNull(), // FRONTEND, BACKEND, AI_ML, LANGUAGE, MOBILE, DEVOPS, OTHER
  difficulty: text('difficulty').notNull(), // BEGINNER, INTERMEDIATE, ADVANCED
  estimatedWeeks: integer('estimated_weeks').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 챕터 테이블
export const chapters = sqliteTable(
  'chapters',
  {
    id: text('id').primaryKey(),
    pathId: text('path_id')
      .notNull()
      .references(() => learningPaths.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    orderIndex: integer('order_index').notNull(),
    isCompleted: integer('is_completed', { mode: 'boolean' })
      .notNull()
      .default(false),
    completedAt: text('completed_at'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [unique().on(table.pathId, table.orderIndex)]
);

// 학습 기록 테이블
export const studyLogs = sqliteTable('study_logs', {
  id: text('id').primaryKey(),
  pathId: text('path_id')
    .notNull()
    .references(() => learningPaths.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id').references(() => chapters.id, {
    onDelete: 'set null',
  }),
  content: text('content').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  loggedAt: text('logged_at').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 연속 학습일 테이블
export const streaks = sqliteTable('streaks', {
  id: text('id').primaryKey(),
  date: text('date').notNull().unique(),
  hasStudied: integer('has_studied', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 타입 정의
export type LearningPath = typeof learningPaths.$inferSelect;
export type NewLearningPath = typeof learningPaths.$inferInsert;

export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;

export type StudyLog = typeof studyLogs.$inferSelect;
export type NewStudyLog = typeof studyLogs.$inferInsert;

export type Streak = typeof streaks.$inferSelect;
export type NewStreak = typeof streaks.$inferInsert;
