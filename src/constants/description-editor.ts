export const DESCRIPTION_EDITOR_MODE = {
  Write: "write",
  Preview: "preview",
} as const;

export type DescriptionEditorMode =
  (typeof DESCRIPTION_EDITOR_MODE)[keyof typeof DESCRIPTION_EDITOR_MODE];
