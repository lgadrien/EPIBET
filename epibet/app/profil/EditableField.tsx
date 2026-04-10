"use client";

import { useState } from "react";
import { Edit2, Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface EditableFieldProps {
  uid: string;
  field: string;
  initialValue: string;
  isAuthField?: boolean;
  className?: string;
  type?: "text" | "email";
  textClass?: string;
}

export default function EditableField({
  uid,
  field,
  initialValue,
  isAuthField = false,
  className = "",
  type = "text",
  textClass = "",
}: EditableFieldProps) {
  const supabase = createClient();
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (value === initialValue || !value.trim()) {
      setIsEditing(false);
      setValue(initialValue);
      return;
    }

    try {
      setIsSaving(true);
      
      // Update public.users
      const { error: dbError } = await supabase
        .from("users")
        .update({ [field]: value })
        .eq("id", uid);
      
      if (dbError) throw dbError;

      // Update auth metadata if required
      if (isAuthField) {
        let authUpdate = {};
        if (field === "email") {
          authUpdate = { email: value };
        } else if (field === "pseudo") {
          authUpdate = { data: { pseudo: value } };
        } else if (field === "nom") {
          authUpdate = { data: { nom: value } };
        } else if (field === "prénom") {
          authUpdate = { data: { prenom: value } };
        }

        const { error: authError } = await supabase.auth.updateUser(authUpdate);
        if (authError) throw authError;

        if (field === "email") {
          alert("Un e-mail de confirmation a été envoyé à votre nouvelle adresse. Le changement sera effectif une fois confirmé.");
        }
      }
      
      setIsEditing(false);
      router.refresh(); // Force re-fetching Server Components like the Header
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
      setValue(initialValue);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          autoFocus
          className={`bg-white/10 border border-white/20 text-white rounded px-2 py-1 focus:outline-none focus:border-epitech-blue w-full max-w-[200px] ${textClass}`}
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-green-400 hover:text-green-300 transition-colors p-1"
          title="Sauvegarder"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
        </button>
        <button
          onClick={() => {
            setValue(initialValue);
            setIsEditing(false);
          }}
          disabled={isSaving}
          className="text-red-400 hover:text-red-300 transition-colors p-1"
          title="Annuler"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      title={`Modifier ${field}`}
      className={`group flex items-center gap-1.5 cursor-pointer rounded-md hover:bg-white/5 transition-colors px-2 py-1 -mx-2 ${className}`}
    >
      <span className={textClass}>{value}</span>
    </div>
  );
}
