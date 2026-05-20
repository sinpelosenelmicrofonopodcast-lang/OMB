import Image from "next/image";
import type { Locale } from "@/lib/i18n/locale";

type VehiclePhotoManagerProps = {
  mainImageUrl?: string | null;
  galleryUrls?: string[];
  locale: Locale;
};

function labels(locale: Locale) {
  if (locale === "es") {
    return {
      title: "Fotos actuales",
      description: "Marca fotos para eliminarlas o escoge cuál será la imagen principal.",
      main: "Principal",
      setMain: "Usar como principal",
      remove: "Eliminar",
      empty: "Este vehículo todavía no tiene fotos guardadas."
    };
  }

  return {
    title: "Current Photos",
    description: "Mark photos for removal or choose the main image.",
    main: "Main",
    setMain: "Use as main",
    remove: "Remove",
    empty: "This vehicle does not have saved photos yet."
  };
}

export function VehiclePhotoManager({ mainImageUrl, galleryUrls = [], locale }: VehiclePhotoManagerProps) {
  const t = labels(locale);
  const photos = Array.from(new Set([mainImageUrl, ...galleryUrls].filter(Boolean) as string[]));

  if (photos.length === 0) {
    return (
      <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.title}</p>
        <p className="mt-2 text-sm text-softWhite/55">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.title}</p>
        <p className="mt-1 text-sm text-softWhite/55">{t.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((url, index) => {
          const isMain = url === mainImageUrl;

          return (
            <div key={url} className="overflow-hidden rounded-xl border border-white/10 bg-charcoal/70">
              <div className="relative h-36 bg-black">
                <Image src={url} alt={`${t.title} ${index + 1}`} fill className="object-contain" sizes="(min-width: 1024px) 30vw, 50vw" />
                {isMain ? (
                  <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-1 text-[11px] font-semibold text-matteBlack">
                    {t.main}
                  </span>
                ) : null}
              </div>

              <div className="space-y-2 p-3 text-sm text-softWhite/80">
                <label className="flex items-center gap-2">
                  <input type="radio" name="selected_main_image_url" value={url} defaultChecked={isMain} />
                  {t.setMain}
                </label>
                <label className="flex items-center gap-2 text-red-200">
                  <input type="checkbox" name="remove_image_url" value={url} />
                  {t.remove}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
