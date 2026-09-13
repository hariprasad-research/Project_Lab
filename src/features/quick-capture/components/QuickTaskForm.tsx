import { useState } from 'react';
import { Field, Input, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { createTask } from '../../../services/taskService';
import { useToastStore } from '../../../store/toastStore';
import { useActiveProjects } from '../../projects/hooks/useProjects';
import { PRIORITIES, PRIORITY_LABELS, type Priority } from '../../../constants/enums';

export function QuickTaskForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [projectId, setProjectId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const projects = useActiveProjects();
  const showToast = useToastStore((s) => s.show);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        status: 'todo',
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        projectId: projectId || undefined,
      });
      showToast('Task created', 'success');
      onDone();
    } catch {
      showToast('Could not create the task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Title">
        <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Due date">
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
        <Field label="Priority">
          <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {projects && projects.length > 0 && (
        <Field label="Project (optional)">
          <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Button type="submit" disabled={!title.trim() || submitting} className="mt-1 w-full">
        Create task
      </Button>
    </form>
  );
}
