"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Save,
  Download,
  Trash2,
  FileText,
} from "lucide-react";
import { ALL_UNITS } from "@/lib/physics";

type Props = {
  notes: Record<string, string>;
  onSaveNote: (lessonId: string, text: string) => void;
};

export function Notebook({ notes, onSaveNote }: Props) {
  const lessonsWithNotes = ALL_UNITS.flatMap((u) =>
    u.lessons.map((l) => ({ ...l, unitTitle: u.title, grade: u.grade }))
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    lessonsWithNotes[0]?.id || ""
  );
  const [text, setText] = useState(notes[selectedLessonId] || "");
  const [dirty, setDirty] = useState(false);
  const [noteKey, setNoteKey] = useState(0); // لتغيير key وإعادة التركيب

  function selectLesson(id: string) {
    setSelectedLessonId(id);
    setText(notes[id] || "");
    setDirty(false);
    setNoteKey((k) => k + 1);
  }

  function handleSave() {
    onSaveNote(selectedLessonId, text);
    setDirty(false);
  }

  function exportAllNotes() {
    const lines: string[] = [];
    lines.push("# ملاحظاتي في الفيزياء\n");
    for (const lesson of lessonsWithNotes) {
      const note = notes[lesson.id];
      if (note && note.trim()) {
        lines.push(`## ${lesson.title} (${lesson.grade} - ${lesson.unitTitle})\n`);
        lines.push(note + "\n\n---\n");
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "physics-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    if (window.confirm("هل تريد حذف ملاحظات هذا الدرس؟")) {
      setText("");
      onSaveNote(selectedLessonId, "");
    }
  }

  const selectedLesson = lessonsWithNotes.find((l) => l.id === selectedLessonId);
  const notesCount = Object.values(notes).filter((n) => n && n.trim()).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
        <BookOpen className="w-6 h-6 text-teal-700 dark:text-teal-400" />
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            مفكرة الطالب
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            اكتب ملاحظاتك الخاصة لكل درس — تُحفظ تلقائيًا
          </p>
        </div>
        <Button onClick={exportAllNotes} size="sm" variant="outline">
          <Download className="w-4 h-4 ml-1" />
          تصدير الكل
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* قائمة الدروس */}
        <div className="md:col-span-1">
          <div className="text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">
            الدروس ({notesCount} بملاحظات)
          </div>
          <ScrollArea className="h-72 md:h-96 pr-2">
            <div className="space-y-1">
              {lessonsWithNotes.map((lesson) => {
                const hasNote = notes[lesson.id] && notes[lesson.id].trim();
                const isSelected = lesson.id === selectedLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => selectLesson(lesson.id)}
                    className={`w-full text-right p-2 rounded-lg border text-sm transition-colors ${
                      isSelected
                        ? "border-teal-400 bg-teal-50 dark:bg-teal-950/30"
                        : "border-slate-200 dark:border-slate-800 hover:border-teal-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className={`w-3.5 h-3.5 shrink-0 ${hasNote ? "text-teal-600" : "text-slate-300"}`} />
                      <span className={`truncate ${hasNote ? "font-semibold text-slate-800 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}>
                        {lesson.title}
                      </span>
                      {hasNote && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 ml-auto shrink-0 border-teal-300 text-teal-700">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* محرر الملاحظات */}
        <div className="md:col-span-2 space-y-3">
          {selectedLesson && (
            <>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedLesson.grade} • {selectedLesson.unitTitle}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">
                    {selectedLesson.title}
                  </div>
                </CardContent>
              </Card>
              <Textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setDirty(true);
                }}
                placeholder="اكتب ملاحظاتك هنا... (تُحفظ تلقائيًا عند الضغط على زر الحفظ)"
                className="min-h-[300px] bg-white dark:bg-slate-800 resize-y"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-slate-500">
                  {text.length} حرف
                  {dirty && <span className="text-amber-600 ml-2">• غير محفوظ</span>}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    size="sm"
                    disabled={!text}
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    مسح
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={!dirty}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Save className="w-4 h-4 ml-1" />
                    حفظ الملاحظة
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
