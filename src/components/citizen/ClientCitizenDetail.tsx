'use client';

import StatusTag from '@/components/shared/StatusTag';
import PriorityTag from '@/components/shared/PriorityTag';
import TicketTimeline, { TimelineItem } from '@/components/shared/TicketTimeline';
import { Tile, TextArea, Button, InlineNotification } from '@carbon/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCalendar } from '@/contexts/CalendarContext';
import { formatDate } from '@/utils/dateFmt';
import { useToaster } from '@/components/shared/Toaster';

type Detail = {
  id: string;
  title_en: string;
  title_np: string;
  category_id: string;
  ward_id: string;
  status: string;
  priority: string;
  created_at_iso: string;
  description_en?: string;
  description_np?: string;
};

export default function ClientCitizenDetail({
  data,
  timeline,
  categories,
}: {
  data: Detail;
  timeline: { id: string; timestamp: string; label_en: string; label_np: string; done?: boolean }[];
  categories: { id: string; label_en: string; label_np: string }[];
}) {
  const { i18n } = useTranslation();
  const { calendar, nepaliNumerals } = useCalendar();
  const { notify } = useToaster();
  const lang = i18n.language?.startsWith('np') ? 'np' : 'en';

  const [items, setItems] = useState<TimelineItem[]>([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setItems(
      timeline.map((t) => ({
        id: t.id,
        timestamp: t.timestamp,
        label: lang === 'np' ? t.label_np : t.label_en,
        done: t.done,
      }))
    );
  }, [timeline, lang]);

  const cat = categories.find((c) => String(c.id) === String(data.category_id));
  const title = lang === 'np' ? (data.title_np || data.title_en) : data.title_en;
  const desc = lang === 'np' ? (data.description_np || data.description_en || '') : (data.description_en || '');
  const catLabel = lang === 'np' ? (cat?.label_np || '') : (cat?.label_en || '');
  const wardLabel = `Ward ${data.ward_id}`;
  const created = formatDate(new Date(data.created_at_iso), { calendar, nepali: nepaliNumerals });

  const postComment = async () => {
    const text = comment.trim();
    if (!text) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch(`/api/grievances/${data.id}/comments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message ?? 'Failed to post comment');
      }
      const now = new Date().toISOString();
      setItems((prev) => [
        ...prev,
        { id: `${data.id}-${now}`, timestamp: now, label: lang === 'np' ? 'नागरिकको टिप्पणी' : 'Citizen commented', done: false },
      ]);
      setComment('');
      notify('success', lang === 'np' ? 'टिप्पणी जोडियो' : 'Comment added');
    } catch (e: any) {
      setError(e?.message ?? 'Error');
      notify('error', 'Failed to add comment', e?.message ?? 'Error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <section style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <h2 className="cds--type-productive-heading-04">Ticket Details</h2>

      <Tile style={{ padding: 'var(--cds-spacing-05)', display: 'grid', gap: 'var(--cds-spacing-03)' }}>
        <div className="cds--type-heading-02" aria-label={`Ticket ${data.id}`}>{title}</div>
        <div className="cds--type-body-01" style={{ display: 'flex', gap: 'var(--cds-spacing-03)', alignItems: 'center', flexWrap: 'wrap' }}>
          <strong>ID:</strong> <span>{data.id}</span>
          <strong>Status:</strong> <StatusTag value={data.status} />
          <strong>Priority:</strong> <PriorityTag value={data.priority} />
          <strong>Category:</strong> <span>{catLabel}</span>
          <strong>Ward:</strong> <span>{wardLabel}</span>
          <strong>Created:</strong> <time dateTime={data.created_at_iso}>{created}</time>
        </div>
        {desc && <p className="cds--type-body-01">{desc}</p>}
      </Tile>

      <div>
        <h3 className="cds--type-heading-02" style={{ marginBottom: 'var(--cds-spacing-03)' }}>Updates</h3>
        <TicketTimeline items={items} />
      </div>

      <div style={{ display: 'grid', gap: 'var(--cds-spacing-03)' }}>
        <h3 className="cds--type-heading-02" style={{ margin: 0 }}>Add Comment (optional)</h3>
        {error && <InlineNotification kind="error" title="Failed" subtitle={error} role="alert" />}
        <TextArea
          id="comment"
          labelText="Comment"
          placeholder="Write here..."
          value={comment}
          onChange={(e: any) => setComment(e?.target?.value ?? e?.currentTarget?.value ?? '')}
          disabled={posting}
        />
        <Button kind="primary" onClick={postComment} disabled={posting || !comment.trim()}>
          {posting ? 'Posting…' : 'Add comment'}
        </Button>
      </div>
    </section>
  );
}
