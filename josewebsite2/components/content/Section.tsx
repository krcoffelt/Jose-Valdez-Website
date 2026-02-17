export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex items-center py-6 sm:py-8 md:py-2 md:snap-section md:min-h-[82svh]">
      {children}
    </section>
  );
}
