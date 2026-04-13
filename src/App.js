import React, { useState, useEffect } from 'react';

const COURSE_COLORS = {
  'CF':     { bg: '#0B1F3A', accent: '#4A9EFF', light: '#E6F1FB' },
  'LPC':    { bg: '#0F2A1A', accent: '#4AE88A', light: '#E1F5EE' },
  'DAM':    { bg: '#2A1A0F', accent: '#FF9B4A', light: '#FFF2CC' },
  'BGS':    { bg: '#1A0F2A', accent: '#C084FC', light: '#EEEDFE' },
  'ME':     { bg: '#2A1A00', accent: '#FFCC4A', light: '#FAEEDA' },
  'MA':     { bg: '#2A0F1A', accent: '#FF6B9D', light: '#FBEAF0' },
  'SCM':    { bg: '#0A2A1A', accent: '#4ADBB5', light: '#E1F5EE' },
  'HPT II': { bg: '#1A1A2A', accent: '#A78BFA', light: '#EDE9FE' },
};

const TYPE_COLORS = {
  'Exam':        { bg: '#2D1515', text: '#FF6B6B', border: '#FF6B6B' },
  'Assessment':  { bg: '#2D1515', text: '#FF6B6B', border: '#FF6B6B' },
  'Assignment':  { bg: '#15152D', text: '#6B8AFF', border: '#6B8AFF' },
  'Group Report':{ bg: '#15152D', text: '#6B8AFF', border: '#6B8AFF' },
  'Presentation':{ bg: '#2D2015', text: '#FFA84A', border: '#FFA84A' },
  'Simulation':  { bg: '#1A152D', text: '#C084FC', border: '#C084FC' },
  'Reading':     { bg: '#152D1A', text: '#4AE88A', border: '#4AE88A' },
  'Preparation': { bg: '#2D2D15', text: '#FFCC4A', border: '#FFCC4A' },
};

const PRIORITY_DOT = {
  'HIGH':   '#FF4A4A',
  'MEDIUM': '#FFAA4A',
  'LOW':    '#4AFF8A',
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
  const colors = TYPE_COLORS[type] || { bg: '#1A1A1A', text: '#888', border: '#555' };
  return (
    <span style={{
      fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 500,
      padding: '2px 7px', borderRadius: 3,
      background: colors.bg, color: colors.text,
      border: `0.5px solid ${colors.border}`,
      letterSpacing: '0.05em', textTransform: 'uppercase'
    }}>{type}</span>
  );
}

function PriorityDot({ priority }) {
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
      background: PRIORITY_DOT[priority] || '#555', marginRight: 5, flexShrink: 0
    }} />
  );
}

function DueBadge({ dueDate }) {
  const days = daysUntil(dueDate);
  if (days === null) return <span style={{ fontSize: 11, color: '#555', fontFamily: "'DM Mono', monospace" }}>TBD</span>;
  const color = days <= 7 ? '#FF4A4A' : days <= 14 ? '#FFAA4A' : '#4A9EFF';
  return (
    <span style={{ fontSize: 11, color, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
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
            minWidth: 260, maxWidth: 260, flexShrink: 0,
            background: '#0E0E0E', border: `0.5px solid ${color.accent}30`,
            borderRadius: 12, overflow: 'hidden'
          }}>
            <div style={{
              padding: '12px 14px', background: color.bg,
              borderBottom: `0.5px solid ${color.accent}40`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: color.accent }}>{course}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#666' }}>{courseTasks.length} tasks</span>
            </div>
            <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {typeOrder.map(type => {
                const items = grouped[type];
                if (!items || !items.length) return null;
                const tcolor = TYPE_COLORS[type] || {};
                return (
                  <div key={type}>
                    <div style={{
                      fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em',
                      color: tcolor.text || '#666', textTransform: 'uppercase',
                      padding: '4px 0 3px', borderBottom: `0.5px solid ${tcolor.border || '#333'}22`
                    }}>{type}s</div>
                    {items.map(t => (
                      <div key={t.id} style={{
                        padding: '7px 8px', marginTop: 4, borderRadius: 6,
                        background: '#161616', border: '0.5px solid #222',
                        cursor: 'default'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 4 }}>
                          <PriorityDot priority={t.priority} />
                          <span style={{ fontSize: 12, color: '#E0E0E0', lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>{t.task}</span>
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
          <div key={month} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#888',
              borderBottom: '0.5px solid #222', paddingBottom: 8, marginBottom: 14
            }}>{monthName}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map(t => {
                const color = COURSE_COLORS[t.course] || { accent: '#888' };
                const days = daysUntil(t.dueDate);
                return (
                  <div key={t.id} style={{
                    display: 'grid', gridTemplateColumns: '80px 70px 1fr auto',
                    gap: 12, alignItems: 'center', padding: '10px 14px',
                    background: '#0E0E0E', borderRadius: 8,
                    border: `0.5px solid ${days !== null && days <= 7 ? '#FF4A4A40' : '#1E1E1E'}`,
                    borderLeft: `3px solid ${color.accent}`
                  }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: color.accent }}>{formatDate(t.dueDate)}</span>
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 10,
                      background: color.accent + '20', color: color.accent,
                      padding: '2px 6px', borderRadius: 3, textAlign: 'center'
                    }}>{t.course}</span>
                    <span style={{ fontSize: 13, color: '#D0D0D0', fontFamily: "'DM Sans', sans-serif" }}>{t.task}</span>
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
      const key = td;
      if (!tasksByDay[key]) tasksByDay[key] = [];
      tasksByDay[key].push(t);
    }
  });

  const monthName = currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const today = new Date();
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={{
          background: '#1A1A1A', border: '0.5px solid #333', color: '#888',
          padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12
        }}>prev</button>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#E0E0E0' }}>{monthName}</span>
        <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={{
          background: '#1A1A1A', border: '0.5px solid #333', color: '#888',
          padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12
        }}>next</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#555', padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dayTasks = tasksByDay[day] || [];
          const hasHighPriority = dayTasks.some(t => t.priority === 'HIGH');
          const hasExam = dayTasks.some(t => t.type === 'Exam' || t.type === 'Assessment');
          return (
            <div key={day} style={{
              minHeight: 80, padding: '6px 6px', borderRadius: 6,
              background: isToday(day) ? '#1A2A3A' : '#0E0E0E',
              border: `0.5px solid ${isToday(day) ? '#4A9EFF' : hasExam ? '#FF4A4A40' : '#1E1E1E'}`,
              position: 'relative'
            }}>
              <div style={{
                fontSize: 12, fontFamily: "'DM Mono', monospace",
                color: isToday(day) ? '#4A9EFF' : '#666',
                fontWeight: isToday(day) ? 500 : 400, marginBottom: 4
              }}>{day}</div>
              {dayTasks.slice(0, 3).map(t => {
                const color = COURSE_COLORS[t.course] || { accent: '#888' };
                return (
                  <div key={t.id} style={{
                    fontSize: 9, fontFamily: "'DM Sans', sans-serif",
                    background: color.accent + '20', color: color.accent,
                    borderRadius: 3, padding: '1px 4px', marginBottom: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>{t.course}: {t.task.slice(0, 18)}{t.task.length > 18 ? '...' : ''}</div>
                );
              })}
              {dayTasks.length > 3 && (
                <div style={{ fontSize: 9, color: '#555', fontFamily: "'DM Mono', monospace" }}>+{dayTasks.length - 3} more</div>
              )}
              {hasHighPriority && (
                <div style={{ position: 'absolute', top: 5, right: 5, width: 5, height: 5, borderRadius: '50%', background: '#FF4A4A' }} />
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
      minHeight: '100vh', background: '#080808', color: '#E0E0E0',
      fontFamily: "'DM Sans', sans-serif", padding: '24px 28px'
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        body { background: #080808; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      <div style={{ marginBottom: 28 }} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#F0F0F0', fontWeight: 400, letterSpacing: '-0.5px' }}>
              IE IMBA <span style={{ fontStyle: 'italic', color: '#4A9EFF' }}>Term II</span>
            </h1>
            <p style={{ fontSize: 13, color: '#555', fontFamily: "'DM Mono', monospace", marginTop: 4 }}>Academic command centre · {tasks.length} tasks tracked</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Total', value: tasks.length, color: '#E0E0E0' },
              { label: 'Due soon', value: upcoming, color: '#FFAA4A' },
              { label: 'High priority', value: highPriority, color: '#FF4A4A' },
              { label: 'Courses', value: courses.length, color: '#4AE88A' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#0E0E0E', border: '0.5px solid #1E1E1E',
                borderRadius: 8, padding: '10px 16px', textAlign: 'center', minWidth: 70
              }}>
                <div style={{ fontSize: 22, fontFamily: "'DM Serif Display', serif", color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: '#555', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} style={{
          background: '#111', border: '0.5px solid #2A2A2A', color: '#AAA',
          padding: '5px 10px', borderRadius: 6, fontSize: 12,
          fontFamily: "'DM Mono', monospace", cursor: 'pointer'
        }}>
          <option value="all">All courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{
          background: '#111', border: '0.5px solid #2A2A2A', color: '#AAA',
          padding: '5px 10px', borderRadius: 6, fontSize: 12,
          fontFamily: "'DM Mono', monospace", cursor: 'pointer'
        }}>
          <option value="all">All types</option>
          {TYPE_GROUPS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '5px 14px', borderRadius: 6, fontSize: 12,
              fontFamily: "'DM Mono', monospace", cursor: 'pointer',
              background: activeTab === tab.id ? '#1A2A3A' : 'transparent',
              border: `0.5px solid ${activeTab === tab.id ? '#4A9EFF' : '#2A2A2A'}`,
              color: activeTab === tab.id ? '#4A9EFF' : '#666',
              transition: 'all 0.15s ease'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="fade-in">
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#555', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
            Loading tasks from Notion...
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#FF4A4A', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
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
        <div style={{ marginTop: 28, display: 'flex', gap: 16, flexWrap: 'wrap', borderTop: '0.5px solid #1A1A1A', paddingTop: 16 }}>
          {Object.entries(PRIORITY_DOT).map(([p, color]) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: '#555', fontFamily: "'DM Mono', monospace" }}>{p}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: '#333', fontFamily: "'DM Mono', monospace", marginLeft: 8 }}>· red border = due within 7 days</span>
        </div>
      )}
    </div>
  );
}
