import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
} from 'lucide-react';

const MenuButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      active ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
    }`}
  >
    {children}
  </button>
);

/**
 * Rich text editor with toolbar for paragraph, headings, lists, bold, italic.
 * Outputs HTML string suitable for storage and display.
 */
const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Write your content…',
  minHeight = '120px',
  className = '',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[80px] p-3 focus:outline-none text-slate-800 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_p]:my-1',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const setParagraph = useCallback(() => editor?.chain().focus().setParagraph().run(), [editor]);
  const setHeading1 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 1 }).run(), [editor]);
  const setHeading2 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), [editor]);
  const setHeading3 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 3 }).run(), [editor]);
  const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const toggleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor]);
  const toggleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor]);

  if (!editor) return null;

  return (
    <div
      className={`border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-200 bg-slate-50">
        <MenuButton
          onClick={setParagraph}
          active={editor.isActive('paragraph')}
          title="Paragraph"
        >
          <Pilcrow size={16} />
        </MenuButton>
        <MenuButton
          onClick={setHeading1}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton
          onClick={setHeading2}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </MenuButton>
        <MenuButton
          onClick={setHeading3}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </MenuButton>
        <div className="w-px h-5 bg-slate-300 mx-1" />
        <MenuButton onClick={toggleBold} active={editor.isActive('bold')} title="Bold">
          <Bold size={16} />
        </MenuButton>
        <MenuButton onClick={toggleItalic} active={editor.isActive('italic')} title="Italic">
          <Italic size={16} />
        </MenuButton>
        <div className="w-px h-5 bg-slate-300 mx-1" />
        <MenuButton
          onClick={toggleBulletList}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List size={16} />
        </MenuButton>
        <MenuButton
          onClick={toggleOrderedList}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered size={16} />
        </MenuButton>
      </div>

      {/* Editor content */}
      <div style={{ minHeight }} className="text-[black]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
