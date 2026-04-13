import React, { useState, useEffect } from 'react';

const COURSE_COLORS = {
  'CF':     { bg: '#EEF4FF', accent: '#2563EB', border: '#BFDBFE' },
  'LPC':    { bg: '#F0FDF4', accent: '#16A34A', border: '#BBF7D0' },
  'DAM':    { bg: '#FFF7ED', accent: '#EA580C', border: '#FED7AA' },
  'BGS':    { bg: '#FAF5FF', accent: '#9333EA', border: '#E9D5FF' },
  'ME':     { bg: '#FEFCE8', accent: '#CA8A04', border: '#FEF08A' },
  'MA':     { bg: '#FFF1F2', accent: '#E11D48', border: '#FECDD3' },
  'SCM':    { bg: '#F0FDFA', accent: '#0D9488', border: '#99F6E4' },
  'HPT II': { bg: '#F5F3FF', accent: '#7C3AED', border: '#DDD6FE' },
};

const TYPE_COLORS = {
  'Exam':         { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'Assessment':   { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'Assignment':   { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Group Report': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Presentation': { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Simulation':   { bg: '#FAF5FF', text: '#7C3AED', border: '#DDD6FE' },
  'Reading':      { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  'Preparation':  { bg: '#FEFCE8', text: '#A16207', border: '#FEF08A' },
};

const PRIORITY_DOT = {
  'HIGH':   '#DC2626',
  'MEDIUM': '#D97706',
  'LOW':    '#16A34A',
};

const TYPE_GROUPS = ['Exam', 'Assessment', 'Assignment', 'Group Report', 'Simulation', 'Presentation', 'Reading', 'Preparation'];

function formatDate(d) {
  if (!d) return 'TBD';
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function daysUntil(d) {
  if (!d) return null;
  const diff = (new Date(d + 'T12:00:00') - new Date()) / 86400000;
  return Math.ceil(diff);
}

function TypeBadge({ type }) {
  const colors = TYPE_COLORS[type] || { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
  return (
    <span style={{
      fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500,
      padding: '2px 7px', borderRadius: 4,
      background: colors.bg, color: colors.text,
      border: `1px solid ${colors.border}`,
      letterSpacing: '0.03em', textTransform: 'uppercase', whiteSpace: 'nowrap'
    }}>{type}</span>
  );
}

function PriorityDot({ priority }) {
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: PRIORITY_DOT[priority] || '#9CA3AF', flexShrink: 0
    }} />
  );
}

function DueBadge({ dueDate }) {
  const days = daysUntil(dueDate);
  if (days === null) return <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'IBM Plex Mono', monospace" }}>TBD</span>;
  const color = days <= 7 ? '#DC2626' : days <= 14 ? '#D97706' : '#6B7280';
  return (
    <span style={{ fontSize: 11, color, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
      {formatDate(dueDate)}{days >= 0 && days <= 14 ? ` · ${days}d` : ''}
    </span>
  );
}

function KanbanView({ tasks }) {
  const courses = Object.keys(COURSE_COLORS);
  const typeOrder = ['Exam', 'Assessment', 'Assignment', 'Group Report', 'Simulation', 'Presentation', 'Reading', 'Preparation'];

  return (
    <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 0 16px', alignItems: 'flex-start' }}>
      {courses.map(course => {
        const courseTasks = tasks.filter(t => t.course === course);
        if (!courseTasks.length) return null;
        const color = COURSE_COLORS[course];
        const grouped = {};
        typeOrder.forEach(t => { grouped[t] = courseTasks.filter(task => task.type === t); });

        return (
          <div key={course} style={{
            minWidth: 265, maxWidth: 265, flexShrink: 0,
            background: '#FFFFFF', border: `1px solid ${color.border}`,
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              padding: '12px 14px', background: color.bg,
              borderBottom: `1px solid ${color.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: color.accent, fontWeight: 500 }}>{course}</span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                background: color.accent + '18', color: color.accent,
                padding: '2px 7px', borderRadius: 20, border: `1px solid ${color.border}`
              }}>{courseTasks.length}</span>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {typeOrder.map(type => {
                const items = grouped[type];
                if (!items || !items.length) return null;
                const tcolor = TYPE_COLORS[type] || {};
                return (
                  <div key={type}>
                    <div style={{
                      fontSize: 9, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.08em',
                      color: tcolor.text || '#9CA3AF', textTransform: 'uppercase',
                      padding: '5px 0 3px', borderBottom: `1px solid ${tcolor.border || '#F3F4F6'}`
                    }}>{type}s</div>
                    {items.map(t => (
                      <div key={t.id} style={{
                        padding: '8px 10px', marginTop: 5, borderRadius: 8,
                        background: '#FAFAFA', border: '1px solid #F3F4F6'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                          <PriorityDot priority={t.priority} />
                          <span style={{ fontSize: 12, color: '#111827', lineHeight: 1.45, fontFamily: "'IBM Plex Sans', sans-serif" }}>{t.task}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <DueBadge dueDate={t.dueDate} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineView({ tasks }) {
  const dated = tasks.filter(t => t.dueDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const grouped = {};
  dated.forEach(t => {
    const month = t.dueDate.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(t);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {Object.entries(grouped).map(([month, items]) => {
        const [y, m] = month.split('-');
        const monthName = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        return (
          <div key={month} style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: '#374151',
              fontWeight: 500, borderBottom: '1px solid #E5E7EB',
              paddingBottom: 8, marginBottom: 12
            }}>{monthName}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {items.map(t => {
                const color = COURSE_COLORS[t.course] || { accent: '#6B7280', border: '#E5E7EB', bg: '#F9FAFB' };
                const days = daysUntil(t.dueDate);
                return (
                  <div key={t.id} style={{
                    display: 'grid', gridTemplateColumns: '80px 70px 1fr auto',
                    gap: 12, alignItems: 'center', padding: '10px 14px',
                    background: '#FFFFFF', borderRadius: 8,
                    border: `1px solid ${days !== null && days <= 7 ? '#FECACA' : '#F3F4F6'}`,
                    borderLeft: `3px solid ${color.accent}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: color.accent, fontWeight: 500 }}>{formatDate(t.dueDate)}</span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                      background: color.bg, color: color.accent,
                      padding: '2px 6px', borderRadius: 4, textAlign: 'center',
                      border: `1px solid ${color.border}`
                    }}>{t.course}</span>
                    <span style={{ fontSize: 13, color: '#1F2937', fontFamily: "'IBM Plex Sans', sans-serif" }}>{t.task}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
                      <TypeBadge type={t.type} />
                      <PriorityDot priority={t.priority} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const tasksByDay = {};
  tasks.filter(t => t.dueDate).forEach(t => {
    const [ty, tm, td] = t.dueDate.split('-').map(Number);
    if (ty === year && tm === month + 1) {
      if (!tasksByDay[td]) tasksByDay[td] = [];
      tasksByDay[td].push(t);
    }
  });

  const monthName = currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const today = new Date();
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={{
          background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280',
          padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12
        }}>prev</button>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, color: '#111827', fontWeight: 500 }}>{monthName}</span>
        <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={{
          background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280',
          padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12
        }}>next</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#9CA3AF', padding: '4px 0', fontWeight: 500 }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} style={{ minHeight: 90 }} />;
          const dayTasks = tasksByDay[day] || [];
          const hasHighPriority = dayTasks.some(t => t.priority === 'HIGH');
          const hasExam = dayTasks.some(t => t.type === 'Exam' || t.type === 'Assessment');

          return (
            <div key={day} style={{
              minHeight: 90, padding: '6px', borderRadius: 8,
              background: isToday(day) ? '#EFF6FF' : '#FFFFFF',
              border: `1px solid ${isToday(day) ? '#BFDBFE' : hasExam ? '#FECACA' : '#F3F4F6'}`,
              position: 'relative'
            }}>
              <div style={{
                fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
                color: isToday(day) ? '#2563EB' : '#374151',
                fontWeight: isToday(day) ? 600 : 400, marginBottom: 4
              }}>{day}</div>
              {dayTasks.slice(0, 3).map(t => {
                const color = COURSE_COLORS[t.course] || { accent: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' };
                return (
                  <div key={t.id} style={{
                    fontSize: 9, fontFamily: "'IBM Plex Sans', sans-serif",
                    background: color.bg, color: color.accent,
                    borderRadius: 3, padding: '2px 5px', marginBottom: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    border: `1px solid ${color.border}`
                  }}>{t.course}: {t.task.slice(0, 16)}{t.task.length > 16 ? '...' : ''}</div>
                );
              })}
              {dayTasks.length > 3 && (
                <div style={{ fontSize: 9, color: '#9CA3AF', fontFamily: "'IBM Plex Mono', monospace" }}>+{dayTasks.length - 3} more</div>
              )}
              {hasHighPriority && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('kanban');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = tasks.filter(t => {
    if (filterCourse !== 'all' && t.course !== filterCourse) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    return true;
  });

  const courses = [...new Set(tasks.map(t => t.course))].filter(Boolean).sort();
  const upcoming = tasks.filter(t => { const d = daysUntil(t.dueDate); return d !== null && d >= 0 && d <= 14; }).length;
  const highPriority = tasks.filter(t => t.priority === 'HIGH').length;

  const tabs = [
    { id: 'kanban', label: 'Kanban' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'calendar', label: 'Calendar' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#F9FAFB', color: '#111827',
      fontFamily: "'IBM Plex Sans', sans-serif", padding: '28px 32px'
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #F3F4F6; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 2px; }
        body { background: #F9FAFB; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        button:hover { opacity: 0.8; }
      `}</style>

      <div style={{ marginBottom: 28 }} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, color: '#111827', fontWeight: 500, letterSpacing: '-0.5px' }}>
              IE IMBA <span style={{ fontStyle: 'italic', color: '#2563EB' }}>Term II</span>
            </h1>
            <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: "'IBM Plex Mono', monospace", marginTop: 6 }}>
              Academic command centre · {tasks.length} tasks tracked
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Total', value: tasks.length, color: '#111827' },
              { label: 'Due soon', value: upcoming, color: '#D97706' },
              { label: 'High priority', value: highPriority, color: '#DC2626' },
              { label: 'Courses', value: courses.length, color: '#16A34A' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#FFFFFF', border: '1px solid #E5E7EB',
                borderRadius: 10, padding: '12px 18px', textAlign: 'center', minWidth: 76,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: 24, fontFamily: "'IBM Plex Mono', monospace", color: stat.color, fontWeight: 500 }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: "'IBM Plex Mono', monospace", marginTop: 3 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} style={{
          background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151',
          padding: '6px 12px', borderRadius: 8, fontSize: 12,
          fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer'
        }}>
          <option value="all">All courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{
          background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151',
          padding: '6px 12px', borderRadius: 8, fontSize: 12,
          fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer'
        }}>
          <option value="all">All types</option>
          {TYPE_GROUPS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 12,
              fontFamily: "'IBM Plex Mono', monospace", cursor: 'pointer',
              background: activeTab === tab.id ? '#2563EB' : '#FFFFFF',
              border: `1px solid ${activeTab === tab.id ? '#2563EB' : '#E5E7EB'}`,
              color: activeTab === tab.id ? '#FFFFFF' : '#6B7280',
              transition: 'all 0.15s ease'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="fade-in">
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9CA3AF', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
            Loading tasks from Notion...
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#DC2626', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
            Error: {error}
          </div>
        )}
        {!loading && !error && (
          <>
            {activeTab === 'kanban' && <KanbanView tasks={filtered} />}
            {activeTab === 'timeline' && <TimelineView tasks={filtered} />}
            {activeTab === 'calendar' && <CalendarView tasks={filtered} />}
          </>
        )}
      </div>

      {!loading && !error && (
        <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap', borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
          {Object.entries(PRIORITY_DOT).map(([p, color]) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: "'IBM Plex Mono', monospace" }}>{p}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: '#D1D5DB', fontFamily: "'IBM Plex Mono', monospace", marginLeft: 8 }}>· red border = due within 7 days</span>
        </div>
      )}
    </div>
  );
}
