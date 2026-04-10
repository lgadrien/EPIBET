"use client";

import React, { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Camera, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";

interface AvatarUploadProps {
  uid: string;
  url: string | null;
  pseudo: string;
}

export default function AvatarUpload({ uid, url, pseudo }: AvatarUploadProps) {
  const supabase = createClient();
  const defaultAvatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${pseudo}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  const [avatarUrl, setAvatarUrl] = useState<string>(url || defaultAvatar);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const regenerateAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent file input dialog
    try {
      setUploading(true);
      const newSeed = `${pseudo}-${Math.random().toString(36).substring(7)}`;
      const newUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${newSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
      
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: newUrl })
        .eq("id", uid);
      
      if (updateError) throw updateError;
      
      setAvatarUrl(newUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadImage = async (path: string) => {
    try {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uid}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: data.publicUrl })
        .eq("id", uid);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="relative group flex h-24 w-24 items-center justify-center rounded-full bg-white/5 shadow-xl shadow-white/5 border border-white/10 overflow-hidden cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
          src={avatarUrl}
          alt={`Avatar de ${pseudo}`}
          fill
          className="object-cover"
          unoptimized={avatarUrl.includes('dicebear')}
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity ${uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>

      {/* Regénérer Bouton */}
      <button 
        onClick={regenerateAvatar}
        disabled={uploading}
        className="absolute -bottom-2 -right-2 bg-epitech-blue hover:bg-epitech-blue-hover text-white p-2 rounded-full shadow-lg border-2 border-epitech-gray transition-transform active:scale-95 z-10"
        title="Générer un nouvel avatar"
      >
        <RefreshCw className={`w-4 h-4 ${uploading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}
