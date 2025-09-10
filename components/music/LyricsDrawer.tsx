"use client";
import * as Dialog from "@radix-ui/react-dialog";

export default function LyricsDrawer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="underline">Lyrics / Story</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6 max-h-[80svh] overflow-y-auto">
          <Dialog.Title className="text-xl mb-4">{title}</Dialog.Title>
          <div className="prose prose-invert">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

