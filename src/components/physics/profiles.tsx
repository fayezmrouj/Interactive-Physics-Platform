"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  UserCheck,
  Trash2,
  User,
  Calendar,
  Award,
} from "lucide-react";
import type { ProgressState, UserProfile } from "@/lib/use-progress";

type Props = {
  state: ProgressState;
  activeProfileId: string | null;
  onSwitch: (id: string) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
};

export function Profiles({ state, activeProfileId, onSwitch, onAdd, onDelete }: Props) {
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    const name = newName.trim();
    if (name.length < 2) return;
    onAdd(name);
    setNewName("");
    setAdding(false);
  }

  const profiles = Object.values(state.profiles).sort(
    (a, b) => a.createdAt - b.createdAt
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
        <Users className="w-6 h-6 text-pink-700 dark:text-pink-400" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            ملفات المستخدمين (Family Mode)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
           允 عدة ملفات تعريف على نفس الجهاز — لكل طالب تقدمه الخاص
          </p>
        </div>
      </div>

      {/* قائمة الملفات */}
      <div className="space-y-3">
        {profiles.map((p) => {
          const isActive = p.id === activeProfileId;
          const completionPct = Math.round((p.completedLessons.length / 24) * 100);
          return (
            <Card
              key={p.id}
              className={`${
                isActive
                  ? "border-pink-300 dark:border-pink-700 ring-2 ring-pink-200 dark:ring-pink-900"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                      isActive
                        ? "bg-gradient-to-tr from-pink-500 to-purple-600"
                        : "bg-slate-400 dark:bg-slate-600"
                    }`}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">
                        {p.name}
                      </h4>
                      {isActive && (
                        <Badge className="bg-pink-500 text-white border-0 gap-1">
                          <UserCheck className="w-3 h-3" />
                          نشط
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.createdAt).toLocaleDateString("ar-EG", { day: "numeric", month: "short" })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {p.completedLessons.length}/24 درس
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {p.unlockedAchievements.length} إنجاز
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-l from-pink-500 to-purple-600"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                    <div className="flex gap-2">
                      {!isActive && (
                        <Button
                          onClick={() => onSwitch(p.id)}
                          size="sm"
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          <UserCheck className="w-3.5 h-3.5 ml-1" />
                          تفعيل
                        </Button>
                      )}
                      {profiles.length > 1 && (
                        <Button
                          onClick={() => {
                            if (window.confirm(`حذف ملف "${p.name}" وكل تقدمه؟`)) {
                              onDelete(p.id);
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5 ml-1" />
                          حذف
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* إضافة مستخدم جديد */}
      {adding ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">
              إضافة مستخدم جديد
            </h4>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="اكتب اسم الطالب..."
              autoFocus
              maxLength={40}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={newName.trim().length < 2} className="bg-pink-600 hover:bg-pink-700">
                <UserPlus className="w-4 h-4 ml-1" />
                إضافة
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                }}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setAdding(true)}
          variant="outline"
          className="w-full border-dashed border-pink-300 text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/30"
        >
          <UserPlus className="w-4 h-4 ml-1" />
          إضافة مستخدم جديد
        </Button>
      )}

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <div className="font-bold mb-1">💡 متى تستخدم هذه الميزة؟</div>
        <div>• عدة طلاب في نفس العائلة يستخدمون نفس الجهاز</div>
        <div>• معلم يتابع تقدم عدة طلاب</div>
        <div>• لكل ملف تقدمه المستقل (دروس، كويزات، إنجازات)</div>
      </div>
    </div>
  );
}
