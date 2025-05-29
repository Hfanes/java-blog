"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

export default function Tiptap({ post }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: post?.content || "<p>Start writing...</p>",
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[400px]  rounded-lg",
      },
    },
  });
  if (!editor) return null; // <--- Also make sure to check here

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "btn-active" : "btn"}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "btn-active" : "btn"}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "btn-active" : "btn"}
        >
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "btn-active" : "btn"}
        >
          Bullet List
        </button>
      </div>
      <div className="border p-4 rounded shadow min-h-[150px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
