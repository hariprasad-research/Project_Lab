import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/layout/BottomNav';
import { FAB } from '../components/layout/FAB';
import { ToastContainer } from '../components/feedback/ToastContainer';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { QuickCaptureSheet } from '../features/quick-capture/components/QuickCaptureSheet';

export function MobileShell() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col bg-paper">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <FAB />
      <BottomNav />
      <ToastContainer />
      <ConfirmDialog />
      <QuickCaptureSheet />
    </div>
  );
}
