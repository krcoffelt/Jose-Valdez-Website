export default function Section({ children }: { children: React.ReactNode }) {
  return <section className="relative snap-section flex items-center">{children}</section>;
}
