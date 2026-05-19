"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Input } from "@/components/ui/input";

const BUCKET_NAME = "vehicle-images";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_IMAGE_SIZE_BYTES = 12 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/avif";

type VehicleImageUploadFieldsProps = {
  labels: {
    uploadMainImage: string;
    uploadGallery: string;
    uploadingImages: string;
    imagesUploadedSaving: string;
    invalidType: string;
    tooLarge: string;
    prepareFailed: string;
    uploadFailed: string;
  };
};

type SignedUploadResponse = {
  path: string;
  token: string;
  publicUrl: string;
  message?: string;
};

function validateImage(file: File, labels: VehicleImageUploadFieldsProps["labels"]) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(labels.invalidType);
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(labels.tooLarge);
  }
}

async function createSignedUpload(file: File, vehicleId: string, prefix: string, labels: VehicleImageUploadFieldsProps["labels"]) {
  const response = await fetch("/api/admin/vehicle-images/signed-upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      vehicleId,
      prefix
    })
  });

  const payload = (await response.json().catch(() => null)) as SignedUploadResponse | null;
  if (!response.ok || !payload) {
    throw new Error(payload?.message || labels.prepareFailed);
  }

  return payload;
}

function appendLines(value: string, additions: string[]) {
  return [...value.split("\n").map((line) => line.trim()).filter(Boolean), ...additions].join("\n");
}

export function VehicleImageUploadFields({ labels }: VehicleImageUploadFieldsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;

    const handleSubmit = async (event: SubmitEvent) => {
      const mainInput = form.elements.namedItem("main_image") as HTMLInputElement | null;
      const galleryInput = form.elements.namedItem("gallery_images") as HTMLInputElement | null;
      const vehicleIdInput = form.elements.namedItem("id") as HTMLInputElement | null;
      const mainUrlInput = form.elements.namedItem("main_image_url") as HTMLInputElement | null;
      const galleryUrlsInput = form.elements.namedItem("gallery_urls_text") as HTMLTextAreaElement | null;
      const mainFile = mainInput?.files?.[0] ?? null;
      const galleryFiles = Array.from(galleryInput?.files ?? []);

      if (!mainFile && galleryFiles.length === 0) return;

      event.preventDefault();

      try {
        setIsUploading(true);
        setStatus(labels.uploadingImages);

        const vehicleId = vehicleIdInput?.value || "";
        const supabase = createClient();

        if (mainFile) {
          validateImage(mainFile, labels);
          const signedUpload = await createSignedUpload(mainFile, vehicleId, "main", labels);
          const { error } = await supabase.storage.from(BUCKET_NAME).uploadToSignedUrl(signedUpload.path, signedUpload.token, mainFile, {
            contentType: mainFile.type,
            upsert: true
          });

          if (error) throw error;
          if (mainUrlInput) mainUrlInput.value = signedUpload.publicUrl;
        }

        const galleryUrls: string[] = [];
        for (let index = 0; index < galleryFiles.length; index += 1) {
          const file = galleryFiles[index];
          validateImage(file, labels);
          const signedUpload = await createSignedUpload(file, vehicleId, `gallery-${index + 1}`, labels);
          const { error } = await supabase.storage.from(BUCKET_NAME).uploadToSignedUrl(signedUpload.path, signedUpload.token, file, {
            contentType: file.type,
            upsert: true
          });

          if (error) throw error;
          galleryUrls.push(signedUpload.publicUrl);
        }

        if (galleryUrlsInput && galleryUrls.length > 0) {
          galleryUrlsInput.value = appendLines(galleryUrlsInput.value, galleryUrls);
        }

        if (mainInput) mainInput.value = "";
        if (galleryInput) galleryInput.value = "";

        setStatus(labels.imagesUploadedSaving);
        form.requestSubmit(event.submitter as HTMLElement | null | undefined);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : labels.uploadFailed);
        setIsUploading(false);
      }
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [labels]);

  return (
    <div ref={rootRef} className="contents">
      <div>
        <label htmlFor="main_image" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
          {labels.uploadMainImage}
        </label>
        <Input id="main_image" name="main_image" type="file" accept={ACCEPTED_IMAGE_TYPES} disabled={isUploading} />
      </div>

      <div>
        <label htmlFor="gallery_images" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
          {labels.uploadGallery}
        </label>
        <Input id="gallery_images" name="gallery_images" type="file" accept={ACCEPTED_IMAGE_TYPES} multiple disabled={isUploading} />
        {status ? <p className="mt-2 text-xs text-gold/85">{status}</p> : null}
      </div>
    </div>
  );
}
