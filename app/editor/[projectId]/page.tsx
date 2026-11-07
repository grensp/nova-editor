import EditorProjectClient from "./EditorProjectClient";

export function generateStaticParams() {
  return [{ projectId: "default" }];
}

export default function EditorProjectPage() {
  return <EditorProjectClient />;
}
