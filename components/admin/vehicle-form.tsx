import type { Vehicle } from "@/lib/db/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type VehicleFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  vehicle?: Vehicle | null;
  message?: string;
};

export function VehicleForm({ title, submitLabel, action, vehicle, message }: VehicleFormProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-4xl text-softWhite">{title}</h1>
        {message ? (
          <p className="mt-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold/90">{message}</p>
        ) : null}
      </div>

      <form action={action} className="panel space-y-6">
        {vehicle ? <input type="hidden" name="id" value={vehicle.id} /> : null}
        <input type="hidden" name="existing_slug" value={vehicle?.slug ?? ""} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Title
            </label>
            <Input id="title" name="title" required defaultValue={vehicle?.title ?? ""} />
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Slug (optional)
            </label>
            <Input id="slug" name="slug" defaultValue={vehicle?.slug ?? ""} />
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Status
            </label>
            <Select id="status" name="status" defaultValue={vehicle?.status ?? "available"}>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </Select>
          </div>

          <div>
            <label htmlFor="year" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Year
            </label>
            <Input id="year" name="year" type="number" defaultValue={vehicle?.year ?? undefined} />
          </div>

          <div>
            <label htmlFor="make" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Make
            </label>
            <Input id="make" name="make" defaultValue={vehicle?.make ?? ""} />
          </div>

          <div>
            <label htmlFor="model" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Model
            </label>
            <Input id="model" name="model" defaultValue={vehicle?.model ?? ""} />
          </div>

          <div>
            <label htmlFor="trim" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Trim
            </label>
            <Input id="trim" name="trim" defaultValue={vehicle?.trim ?? ""} />
          </div>

          <div>
            <label htmlFor="mileage" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Mileage
            </label>
            <Input id="mileage" name="mileage" type="number" defaultValue={vehicle?.mileage ?? undefined} />
          </div>

          <div>
            <label htmlFor="price" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Price (USD)
            </label>
            <Input id="price" name="price" type="number" defaultValue={vehicle?.price ?? undefined} />
          </div>

          <div>
            <label htmlFor="vin" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              VIN
            </label>
            <Input id="vin" name="vin" defaultValue={vehicle?.vin ?? ""} />
          </div>

          <div>
            <label htmlFor="color" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Color
            </label>
            <Input id="color" name="color" defaultValue={vehicle?.color ?? ""} />
          </div>

          <div>
            <label htmlFor="drivetrain" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Drivetrain
            </label>
            <Input id="drivetrain" name="drivetrain" defaultValue={vehicle?.drivetrain ?? ""} />
          </div>

          <div>
            <label htmlFor="transmission" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Transmission
            </label>
            <Input id="transmission" name="transmission" defaultValue={vehicle?.transmission ?? ""} />
          </div>

          <div>
            <label htmlFor="fuel_type" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Fuel Type
            </label>
            <Input id="fuel_type" name="fuel_type" defaultValue={vehicle?.fuel_type ?? ""} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="main_image_url" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Main Image URL
            </label>
            <Input id="main_image_url" name="main_image_url" defaultValue={vehicle?.main_image_url ?? ""} />
          </div>

          <div>
            <label htmlFor="main_image" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Upload Main Image
            </label>
            <Input id="main_image" name="main_image" type="file" accept="image/*" />
          </div>

          <div>
            <label htmlFor="gallery_images" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Upload Gallery Images
            </label>
            <Input id="gallery_images" name="gallery_images" type="file" accept="image/*" multiple />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="gallery_urls_text" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Gallery URLs (one per line)
            </label>
            <Textarea
              id="gallery_urls_text"
              name="gallery_urls_text"
              rows={4}
              defaultValue={(vehicle?.gallery_urls ?? []).join("\n")}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="highlights_text" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Highlights (one per line)
            </label>
            <Textarea
              id="highlights_text"
              name="highlights_text"
              rows={4}
              defaultValue={(vehicle?.highlights ?? []).join("\n")}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Description
            </label>
            <Textarea id="description" name="description" rows={6} defaultValue={vehicle?.description ?? ""} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="specs_json" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Specs JSON
            </label>
            <Textarea
              id="specs_json"
              name="specs_json"
              rows={6}
              defaultValue={JSON.stringify(vehicle?.specs ?? {}, null, 2)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-4">
          <label className="inline-flex items-center gap-2 text-sm text-softWhite/80">
            <input type="checkbox" name="featured" defaultChecked={vehicle?.featured ?? false} /> Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-softWhite/80">
            <input type="checkbox" name="published" defaultChecked={vehicle?.published ?? true} /> Published
          </label>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
