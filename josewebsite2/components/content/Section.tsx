export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex items-center py-14 sm:py-16 md:py-0 md:snap-section md:min-h-[100svh]">
      {children}
    </section>
  );
}
