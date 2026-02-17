export default function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative flex items-center py-4 sm:py-6 md:py-1 md:snap-section md:min-h-[64svh] ${className ?? ""}`}>
      {children}
    </section>
  );
}
