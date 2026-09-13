import { create } from 'zustand';

export type QuickCaptureType = 'task' | 'project' | 'note' | 'idea' | 'research' | null;

interface ConfirmRequest {
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface UIState {
  quickCaptureType: QuickCaptureType;
  openQuickCapture: (type: Exclude<QuickCaptureType, null>) => void;
  closeQuickCapture: () => void;

  confirmRequest: ConfirmRequest | null;
  requestConfirm: (req: ConfirmRequest) => void;
  clearConfirm: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  quickCaptureType: null,
  openQuickCapture: (type) => set({ quickCaptureType: type }),
  closeQuickCapture: () => set({ quickCaptureType: null }),

  confirmRequest: null,
  requestConfirm: (req) => set({ confirmRequest: req }),
  clearConfirm: () => set({ confirmRequest: null }),
}));
