import { mergeStyles } from '@fluentui/react';

export const formContainerClass = mergeStyles({
  backgroundColor: '#fff',
  padding: '20px 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  borderRadius: '6px',
  maxWidth: '900px',
  margin: '0 auto',
  boxSizing: 'border-box',
  border: '1px solid #eaeaea',
  paddingTop: '1px',
});

export const sectionHeaderClass = mergeStyles({
  fontSize: '15px',
  fontWeight: 600,
  color: '#0078d4',
  margin: '16px 0 16px',
  paddingBottom: '4px',
  borderBottom: '1px solid #e0e0e0',
});

export const formGridClass = mergeStyles({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '16px',
  marginBottom: '16px',
  marginTop: '16px',
  width: '100%',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

export const formItemClass = mergeStyles({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  width: '100%',
});

export const labelClass = mergeStyles({
  fontSize: 12,
  color: '#444',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  minWidth: 120,
  ':after': {
    content: '":"',
    margin: '0 6px',
  },
});

export const valueClass = mergeStyles({
  fontSize: 13,
  color: '#222',
  padding: '4px 0',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid #e0e0e0',
});

export const subjectContainerClass = mergeStyles({
  gridColumn: '1 / -1', // full width
  marginTop: 0,
  width: '100%',
  '@media (max-width: 768px)': {
    gridColumn: '1',
  },
});

export const dateSectionClass = mergeStyles({
  marginTop: 20,
   padding: '16px 16px 16px 24px',
  backgroundColor: '#fafafa',
  borderRadius: 4,
  border: '1px solid #eee',
  borderLeft: '6px solid #0078d4',
});

export const dateGridClass = mergeStyles({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

export const uploadAreaClass = mergeStyles({
  border: '2px dashed #0078d4',
  padding: 16,
  textAlign: 'center',
  background: 'rgba(0, 120, 212, 0.05)',
  borderRadius: 6,
  cursor: 'pointer',
  marginTop: 16,
  transition: 'all 0.3s ease',
  ':hover': {
    background: 'rgba(0, 120, 212, 0.1)',
  },
});

export const successMsgClass = mergeStyles({
  marginTop: 24,
  borderRadius: 4,
  overflow: 'hidden',
});
