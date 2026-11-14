'use client';

import { useReveal } from '@/lib/hooks';

export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, shown] = useReveal();
  return (
    <Tag ref={ref} className={`rv ${shown ? 'in' : ''} ${className}`} style={delay ? { '--rd': `${delay}ms` } : undefined} {...rest}>
      {children}
    </Tag>
  );
}
