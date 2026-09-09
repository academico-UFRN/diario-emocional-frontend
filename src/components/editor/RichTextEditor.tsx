import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
} from "lucide-react";

interface RichTextEditorProps {
  content?: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({
  content = "",
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],

    content,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

 useEffect(() => {
  if (!editor) return;

  // Garante uma string válida
  const novoConteudo = content ?? "";

  // Sincroniza apenas se o conteúdo mudou E o usuário não está digitando no editor
 // ...existing code...

if (editor.getHTML() !== novoConteudo && !editor.isFocused) {
  editor.commands.setContent(novoConteudo, {
    emitUpdate: false,
  });
}
 }, [content, editor]);

// ...existing code..., [content, editor]);

  return (
    <div className="overflow-hidden rounded-xl border bg-background">

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b bg-muted/30 p-2">

        {/* Negrito */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("bold")
              ? "bg-muted"
              : ""
          }`}
          title="Negrito"
        >
          <Bold size={18} />
        </button>


        {/* Itálico */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("italic")
              ? "bg-muted"
              : ""
          }`}
          title="Itálico"
        >
          <Italic size={18} />
        </button>


        <div className="mx-1 h-6 w-px bg-border" />


        {/* Título */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("heading", { level: 2 })
              ? "bg-muted"
              : ""
          }`}
          title="Título"
        >
          <Heading2 size={18} />
        </button>


        {/* Lista */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("bulletList")
              ? "bg-muted"
              : ""
          }`}
          title="Lista"
        >
          <List size={18} />
        </button>


        {/* Lista numerada */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("orderedList")
              ? "bg-muted"
              : ""
          }`}
          title="Lista numerada"
        >
          <ListOrdered size={18} />
        </button>


        {/* Citação */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("blockquote")
              ? "bg-muted"
              : ""
          }`}
          title="Citação"
        >
          <Quote size={18} />
        </button>

      </div>


      {/* Área de escrita */}
      <EditorContent
        editor={editor}
        className="
          min-h-[300px]
          px-4
          py-3

          [&_.ProseMirror]:min-h-[280px]
          [&_.ProseMirror]:outline-none

          [&_.ProseMirror_p]:mb-3

          [&_.ProseMirror_h2]:mb-3
          [&_.ProseMirror_h2]:mt-4
          [&_.ProseMirror_h2]:text-xl
          [&_.ProseMirror_h2]:font-semibold

          [&_.ProseMirror_ul]:ml-6
          [&_.ProseMirror_ul]:list-disc

          [&_.ProseMirror_ol]:ml-6
          [&_.ProseMirror_ol]:list-decimal

          [&_.ProseMirror_blockquote]:border-l-4
          [&_.ProseMirror_blockquote]:pl-4
          [&_.ProseMirror_blockquote]:italic
        "
      />

    </div>
  );
}