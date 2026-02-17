export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex items-center py-10 sm:py-12 md:py-4 md:snap-section md:min-h-[90svh]">
      {children}
    </section>
  );
}
