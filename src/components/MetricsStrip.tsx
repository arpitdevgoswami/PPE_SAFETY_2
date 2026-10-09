import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, AlertTriangle, Camera, TrendingUp, TrendingDown } from 'lucide-react';
import type { SystemMetrics } from '../types';

interface MetricsStripProps {
  metrics: SystemMetrics;
}

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  delta?: string;
  deltaUp?: boolean;
  subtext?: string;
  color?: string;
  icon: React.ReactNode;
}

function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, suffix, delta, deltaUp, subtext, color = 'var(--text-primary)', icon,
}) => {
  const numVal = typeof value === 'number' ? value : parseFloat(String(value));
  const animated = useCountUp(isNaN(numVal) ? 0 : numVal);
  const display = isNaN(numVal) ? value : animated;

  return (
    <div style={{
      flex: 1, minWidth: 0,
      padding: '14px 16px',
      backgroundColor: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      display: 'flex', flexDirection: 'column', gap: '6px',
      transition: 'border-color 0.15s, background 0.15s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
      (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
      (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '12px',
          fontWeight: 500, color: 'var(--text-secondary)',
        }}>{label}</span>
        <span style={{ color: 'var(--text-tertiary)', opacity: 0.8 }}>{icon}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '32px',
          fontWeight: 600, color, lineHeight: 1,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }} className="animate-count-up">
          {typeof value === 'number' ? display : value}
        </span>
        {suffix && (
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '16px',
            fontWeight: 400, color: 'var(--text-tertiary)',
          }}>{suffix}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {delta && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            padding: '1px 7px', borderRadius: '999px',
            fontSize: '11px', fontWeight: 500,
            backgroundColor: deltaUp ? 'var(--success-dim)' : 'var(--danger-dim)',
            color: deltaUp ? 'var(--success)' : 'var(--danger)',
            border: `1px solid ${deltaUp ? 'var(--success-border)' : 'var(--danger-border)'}`,
          }}>
            {deltaUp ? <TrendingUp size={10} strokeWidth={2} /> : <TrendingDown size={10} strokeWidth={2} />}
            {delta}
          </span>
        )}
        {subtext && (
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            color: 'var(--text-tertiary)',
          }}>{subtext}</span>
        )}
      </div>
    </div>
  );
};

export const MetricsStrip: React.FC<MetricsStripProps> = ({ metrics }) => {
  return (
    <section style={{
      width: '100%',
      padding: '12px 16px',
      display: 'flex', gap: '10px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--surface-1)',
    }}>
      <StatCard
        label="Active workers"
        value={metrics.activeWorkers}
        suffix={`/${metrics.totalWorkersToday}`}
        delta="+4 since 8 am"
        deltaUp={true}
        subtext="on site today"
        color="var(--text-primary)"
        icon={<Users size={15} strokeWidth={1.5} />}
      />
      <StatCard
        label="PPE compliance"
        value={metrics.ppeComplianceRate}
        suffix="%"
        delta="+0.8% vs shift avg"
        deltaUp={true}
        color="var(--success)"
        icon={<ShieldCheck size={15} strokeWidth={1.5} />}
      />
      <StatCard
        label="Active hazards"
        value={metrics.activeHazards}
        delta={`${metrics.criticalHazards} critical`}
        deltaUp={false}
        subtext={`${metrics.warningHazards} warning`}
        color={metrics.activeHazards > 0 ? 'var(--warning)' : 'var(--text-primary)'}
        icon={<AlertTriangle size={15} strokeWidth={1.5} />}
      />
      <StatCard
        label="Cameras online"
        value={metrics.opticalSensorsOnline}
        suffix={`/${metrics.totalSensors}`}
        delta="All nominal"
        deltaUp={true}
        color="var(--text-primary)"
        icon={<Camera size={15} strokeWidth={1.5} />}
      />
    </section>
  );
};
