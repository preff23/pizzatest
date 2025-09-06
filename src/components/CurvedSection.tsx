import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function CurvedSection({ children }: Props) {
  return (
    <section className="section">
      <div className="curve">{children}</div>
    </section>
  );
}
