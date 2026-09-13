import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Input, Textarea, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { createProject } from '../../../services/projectService';
import { useToastStore } from '../../../store/toastStore';
import { PRIORITIES, PRIORITY_LABELS, PROJECT_STATUSES, STATUS_LABELS, type Priority, type ProjectStatus } from '../../../constants/enums';

export function QuickProjectForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [priority, setPriority] = useState<Priority>('medium');
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((s) => s.show);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const project = await createProject({ name: name.trim(), description: description.trim() || undefined, status, priority });
      showToast('Project created', 'success');
      onDone();
      navigate(`/projects/${project.id}`);
    } catch {
      showToast('Could not create the project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Name">
        <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AstroTwin" />
      </Field>
      <Field label="Description (optional)">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this project about?" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
            {PROJECT_STATUSES.filter((s) => s !== 'archived').map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
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
      <Button type="submit" disabled={!name.trim() || submitting} className="mt-1 w-full">
        Create project
      </Button>
    </form>
  );
}
