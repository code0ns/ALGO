import React from 'react';
import { BookOpen } from 'lucide-react';
import Modal from './Modal';
import LessonTimeline from './LessonTimeline';

// Lesson detail view — matches the lovable.app card style, plus a live chart.
export default function LessonModal({ lesson, onClose }) {
  return (
    <Modal
      title={lesson.title}
      subtitle={null}
      onClose={onClose}
      width={760}
    >
      <div className="lesson-modal-header">
        <BookOpen size={14} />
        <span>LESSON · LEVEL {lesson.number}</span>
      </div>

      <p className="text-secondary" style={{ fontSize: '15px', marginTop: '8px', marginBottom: '24px', lineHeight: 1.55 }}>
        {lesson.summary}
      </p>

      <div className="lesson-section">
        <h4 className="lesson-section-title">How it works</h4>
        <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{lesson.howItWorks}</p>
      </div>

      <div className="info-box" style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Example
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{lesson.example}</p>
      </div>

      {/* Scrubbable visualization */}
      <div style={{ marginTop: '24px' }}>
        <h4 className="lesson-section-title">See it in action</h4>
        <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>
          Drag the slider below the chart to scroll through time and watch where the trade gets placed.
        </p>
        <LessonTimeline chart={lesson.chart} />
      </div>

      <div className="lesson-section" style={{ marginTop: '28px' }}>
        <h4 className="lesson-section-title">Key terms</h4>
        <div className="key-terms">
          {lesson.keyTerms.map((kt) => (
            <div key={kt.term} className="key-term-row">
              <div className="key-term-label">{kt.term}</div>
              <div className="key-term-def text-secondary">{kt.def}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="modal-footer">
        <button className="btn-ghost" onClick={onClose}>Close</button>
        <button className="btn-primary" onClick={onClose}>Got it</button>
      </footer>
    </Modal>
  );
}
