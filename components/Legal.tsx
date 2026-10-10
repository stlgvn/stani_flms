export default function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl space-y-4 text-sm leading-relaxed [&_h2]:pt-2 [&_h2]:text-base [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </article>
  );
}
