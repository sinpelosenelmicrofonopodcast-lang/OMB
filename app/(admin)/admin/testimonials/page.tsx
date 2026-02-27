import {
  createTestimonialAction,
  deleteTestimonialAction,
  updateTestimonialAction
} from "@/actions/testimonial-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminTestimonials } from "@/lib/db/testimonials";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminTestimonialsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const testimonials = await getAdminTestimonials();
  const message = first(resolvedSearchParams.message);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-4xl text-softWhite">Testimonials</h1>
      {message ? (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold/90">{message}</p>
      ) : null}

      <form action={createTestimonialAction} className="panel space-y-4">
        <h2 className="font-heading text-3xl text-softWhite">Add Testimonial</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Name
            </label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <label htmlFor="rating" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Rating (1-5)
            </label>
            <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} />
          </div>
        </div>

        <div>
          <label htmlFor="quote" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Quote
          </label>
          <Textarea id="quote" name="quote" rows={4} required />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-softWhite/80">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>

        <button className="rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
          Create
        </button>
      </form>

      <div className="grid gap-4">
        {testimonials.map((item) => (
          <form key={item.id} action={updateTestimonialAction} className="panel space-y-4">
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">Name</label>
                <Input name="name" defaultValue={item.name} required />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">Rating</label>
                <Input name="rating" type="number" min={1} max={5} defaultValue={item.rating} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">Quote</label>
              <Textarea name="quote" rows={3} defaultValue={item.quote} required />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-softWhite/80">
                <input type="checkbox" name="published" defaultChecked={item.published} /> Published
              </label>

              <div className="flex gap-2">
                <button className="rounded-xl border border-white/20 px-3 py-1.5 text-xs text-softWhite hover:border-gold/60 hover:text-gold">
                  Save
                </button>
                <button
                  formAction={deleteTestimonialAction}
                  className="rounded-xl border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        ))}

        {testimonials.length === 0 ? <div className="panel text-sm text-softWhite/65">No testimonials created.</div> : null}
      </div>
    </div>
  );
}
