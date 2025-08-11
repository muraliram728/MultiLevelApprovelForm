import { mergeStyles } from '@fluentui/react';

export const formContainerClass = mergeStyles({
    backgroundColor: '#ffffff',
    padding: '32px',
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.08)',
    borderRadius: '8px',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #e1e1e1'
});

export const sectionHeaderClass = mergeStyles({
    fontSize: '18px',
    fontWeight: 600,
    color: '#323130',
    marginBottom: '24px',
    borderBottom: '2px solid #0078d4'
});

export const formGridClass = mergeStyles({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
    marginTop: '24px',
    width: '100%',
    '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
    }
});

export const formItemClass = mergeStyles({
    marginBottom: '30px',
    width: '100%'
});

export const labelClass = mergeStyles({
    fontSize: '13px',
    color: '#605e5c',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center'
});

export const valueClass = mergeStyles({
    fontSize: '14px',
    color: '#323130',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    width: '100%',
    minHeight: '32px',
    display: 'flex',
    alignItems: 'center'
});

export const subjectContainerClass = mergeStyles({
    gridColumn: '1 / span 2',
    marginTop: '0px',
    width: '100%',
    '@media (max-width: 768px)': {
        gridColumn: '1'
    }
});

export const dateSectionClass = mergeStyles({
    marginTop: '32px',
    borderRadius: '4px',
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #0078d4'
});

export const dateGridClass = mergeStyles({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
    }
});

export const uploadAreaClass = mergeStyles({
    border: '2px dashed #0078d4',
    padding: '24px',
    textAlign: 'center',
    background: 'rgba(0, 120, 212, 0.05)',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.3s ease',
    ':hover': {
        background: 'rgba(0, 120, 212, 0.1)'
    }
});

export const successMsgClass = mergeStyles({
    marginTop: '24px',
    borderRadius: '4px',
    overflow: 'hidden'
});
