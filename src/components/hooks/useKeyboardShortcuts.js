import { useEffect } from 'react';

export function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if target is an input, textarea, or contenteditable
      const target = e.target;
      const isEditable = target instanceof HTMLInputElement ||
                         target instanceof HTMLTextAreaElement ||
                         target.isContentEditable;
      if (isEditable) {
        // Allow Escape to close modals even when typing
        if (e.key === 'Escape') {
          handlers.closeModal?.();
        }
        return;
      }

      // Ctrl+K
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        handlers.focusSearch?.();
      }
      // N (new series)
      else if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handlers.newSeries?.();
      }
      // E (edit selected)
      else if (e.key === 'e' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handlers.editSelected?.();
      }
      // Escape (close modal) – already handled above, but catch non-editable case
      else if (e.key === 'Escape') {
        handlers.closeModal?.();
      }
      // ? (show help)
      else if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        handlers.showHelp?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}