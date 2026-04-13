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
  const courses =
