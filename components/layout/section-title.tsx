type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="mb-8 space-y-3">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.3em] text-transparent bg-gradient-to-r from-cyan via-cyan to-gold bg-clip-text">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl text-softWhite md:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-softWhite/70 md:text-base">{description}</p> : null}
    </div>
  );
}
