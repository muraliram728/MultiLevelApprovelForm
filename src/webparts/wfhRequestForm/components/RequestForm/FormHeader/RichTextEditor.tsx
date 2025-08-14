import * as React from 'react';
import { Stack, IconButton } from '@fluentui/react';

interface IRichTextEditorProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    styles?: {
        root?: React.CSSProperties;
        toolbar?: React.CSSProperties;
        editor?: React.CSSProperties;
    };
    readOnly?: boolean;
    disabled?: boolean;
}

const RichTextEditor: React.FC<IRichTextEditorProps> = ({ label, value, readOnly, disabled, onChange }) => {
    const editorRef = React.useRef<HTMLDivElement>(null);

    const execCmd = (command: string, value?: string) => {
        document.execCommand(command, false, value || '');
        onChange(editorRef.current?.innerHTML || '');
    };

    return (
        <div>
            {label && <label style={{ fontWeight: 600 }}>{label}</label>}

            {/* Toolbar */}
            <Stack horizontal tokens={{ childrenGap: 5 }} style={{ marginBottom: 5 }}>
                {!disabled && !readOnly && (
                    <>
                        <IconButton iconProps={{ iconName: 'Bold' }} title="Bold" onClick={() => execCmd('bold')} />
                        <IconButton iconProps={{ iconName: 'Italic' }} title="Italic" onClick={() => execCmd('italic')} />
                        <IconButton iconProps={{ iconName: 'Underline' }} title="Underline" onClick={() => execCmd('underline')} />
                        <IconButton iconProps={{ iconName: 'Strikethrough' }} title="Strikethrough" onClick={() => execCmd('strikeThrough')} />
                        <IconButton iconProps={{ iconName: 'BulletedList' }} title="Bulleted List" onClick={() => execCmd('insertUnorderedList')} />
                        <IconButton iconProps={{ iconName: 'NumberedList' }} title="Numbered List" onClick={() => execCmd('insertOrderedList')} />
                        <IconButton iconProps={{ iconName: 'Undo' }} title="Undo" onClick={() => execCmd('undo')} />
                        <IconButton iconProps={{ iconName: 'Redo' }} title="Redo" onClick={() => execCmd('redo')} />
                    </>
                )}
            </Stack>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable={!disabled && !readOnly}
                suppressContentEditableWarning
                style={{
                    minHeight: 100,
                    border: '1px solid #ccc',
                    padding: 8,
                    borderRadius: 4,
                }}
                dangerouslySetInnerHTML={{ __html: value }}
                onInput={() => onChange(editorRef.current?.innerHTML || '')}
            />
        </div>
    );
};

export default RichTextEditor;
