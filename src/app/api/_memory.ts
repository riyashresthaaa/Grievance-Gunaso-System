// Central in-memory stores for dev (no real backend)
export type Comment = { id: string; grievance_id: string; text: string; created_at_iso: string };

export const commentsAdds: Record<string, Comment[]> = {};   // by grievance_id

export type TLAdd = { grievance_id: string; ts: string; label_en: string; label_np: string; done: boolean };
export const timelineAdds: Record<string, TLAdd[]> = {};      // by grievance_id
