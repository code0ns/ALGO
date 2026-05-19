import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { LESSONS } from '../data/lessons';
import LessonModal from '../components/LessonModal';

// Grid of lesson cards. Click → open lesson modal with the scrubbable chart.
export default function Learn() {
  const navigate = useNavigate();
  const [openLessonId, setOpenLessonId] = useState(null);
  const openLesson = LESSONS.find((l) => l.id === openLessonId);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Learn the basics</h1>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/dashboard')}>Skip to dashboard</button>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px 64px' }}>
        <div style={{ maxWidth: '600px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>
            Six short lessons before the bot does the rest.
          </h2>
          <p className="text-secondary" style={{ fontSize: '16px' }}>
            You don't need to be a trader to use this. But you should know the basics — what an indicator is, what a strategy is, what the bot is actually doing on your behalf. Each lesson takes about 2 minutes and ends with a live chart you can scroll through.
          </p>
        </div>

        <div className="lesson-grid">
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              className="lesson-card"
              onClick={() => setOpenLessonId(lesson.id)}
            >
              <div className="lesson-card-top">
                <BookOpen size={16} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Lesson {lesson.number}
                </span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 500, margin: '8px 0 12px' }}>
                {lesson.title}
              </h3>
              <p className="text-secondary" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                {lesson.summary}
              </p>
              <div className="lesson-card-cta">
                Open lesson <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </main>

      {openLesson && (
        <LessonModal lesson={openLesson} onClose={() => setOpenLessonId(null)} />
      )}
    </div>
  );
}
