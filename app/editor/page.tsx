"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEditor } from "@/store/editorStore";
import { useProjects } from "@/store/projectsStore";
import { useOpenProject } from "@/components/editor/useOpenProject";
import ImportPanel from "@/components/editor/ImportPanel";
import EditorShell from "@/components/editor/EditorShell";

function EditorContent() {
  const searchParams = useSearchParams();
  const queryProjectId = searchParams ? searchParams.get("projectId") : null;
  const files = useEditor((s) => s.files);
  const projectId = useEditor((s) => s.projectId);
  const projects = useProjects((s) => s.projects);
  const open = useOpenProject();
  const [opening, setOpening] = useState(false);

  const persist = (useProjects as unknown as { persist?: { hasHydrated: () => boolean; onFinishHydration: (cb: () => void) => () => void } }).persist;
  const [hydrated, setHydrated] = useState(() => persist?.hasHydrated?.() ?? true);

  useEffect(() => {
    if (hydrated || !persist) return;
    if (persist.hasHydrated()) { setHydrated(true); return; }
    return persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated, persist]);

  useEffect(() => {
    if (!queryProjectId || projectId === queryProjectId) return;
    if (!hydrated) return;
    const p = projects.find((x) => x.id === queryProjectId);
    if (!p) return;
    setOpening(true);
    open(p).finally(() => setOpening(false));
  }, [queryProjectId, projectId, projects, open, hydrated]);

  if (opening) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-bg">
        <Loader2 size={22} className="animate-spin text-accent" />
      </div>
    );
  }

  if (files.length) return <EditorShell />;
  return <ImportPanel />;
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="grid min-h-[100dvh] place-items-center bg-bg"><Loader2 size={22} className="animate-spin text-accent" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
