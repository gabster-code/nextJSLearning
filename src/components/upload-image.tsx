"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface UploadImageProps {
  currentImage?: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export function UploadImage({
  currentImage,
  onUpload,
  onRemove,
}: UploadImageProps) {
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);

  async function handleFileChange(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const { imageUrl } = await response.json();
      onUpload(imageUrl);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  }

  async function handleRemove() {
    try {
      const response = await fetch("/api/user/remove-image", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove image");
      }

      onRemove();
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error("Failed to remove profile picture");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {currentImage && (
          <div className="relative">
            <Image
              src={currentImage}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div
          className={`border-2 border-dashed rounded-lg p-4 ${
            isDragging ? "border-primary" : "border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) {
              startTransition(() => handleFileChange(file));
            }
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                startTransition(() => handleFileChange(file));
              }
            }}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-sm text-gray-600"
          >
            Drag and drop an image or click to select
          </label>
        </div>
      </div>
    </div>
  );
}
