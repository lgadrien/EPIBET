"use client";

import { useState } from "react";
import { Edit2, Check, X, Loader2, AlertTriangle } from "lucide-react";
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = async () => {
    if (value === initialValue || !value.trim()) {
      setIsEditing(false);
      setShowConfirmModal(false);
      setShowSuccessModal(false);
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
          setShowSuccessModal(true);
        }
      }
      
      setIsEditing(false);
      setShowConfirmModal(false);
      // Don't close success modal here, it will be closed by the user
      router.refresh(); // Force re-fetching Server Components like the Header
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
      setValue(initialValue);
      setIsEditing(false);
      setShowConfirmModal(false);
      setShowSuccessModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const onPreSave = () => {
    if (field === "email" && value !== initialValue) {
      setShowConfirmModal(true);
    } else {
      handleSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onPreSave();
    if (e.key === "Escape") {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
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
            onClick={onPreSave}
            disabled={isSaving}
            className="text-green-400 hover:text-green-300 transition-colors p-1"
            title="Sauvegarder"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
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
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          title={`Modifier ${field}`}
          className={`group flex items-center gap-1.5 cursor-pointer rounded-md hover:bg-white/5 transition-colors px-2 py-1 -mx-2 ${className}`}
        >
          <span className={textClass}>{value}</span>
        </div>
      )}

      {/* MODALE DE CONFIRMATION D'EMAIL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden relative text-center">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col items-center">
              <div className="mb-6 h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Confirmation de changement d'email
              </h3>

              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-6">
                <span className="text-sm text-gray-400">Nouvel email : </span>
                <span className="text-sm font-medium text-epitech-blue">
                  {value}
                </span>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
                <p className="text-sm text-red-400 font-medium leading-relaxed">
                  ⚠️ Attention : Assurez-vous d'avoir accès à cet email. Si le
                  mail que vous avez rentré n'est pas le bon ou n'existe pas,
                  vous perdrez définitivement l'accès à votre compte.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all text-sm font-bold flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirmer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE SUCCÈS (EMAIL) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden relative text-center">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-epitech-blue/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col items-center">
              <div className="mb-6 h-16 w-16 bg-epitech-blue/10 border border-epitech-blue/20 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-epitech-blue" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4">
                Email envoyé !
              </h3>
              
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                Un e-mail de confirmation a été envoyé à votre nouvelle adresse. 
                Le changement sera effectif une fois que vous l'aurez confirmé.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-6 py-3 rounded-xl bg-epitech-blue hover:bg-epitech-blue-hover text-white transition-all text-sm font-bold shadow-lg shadow-epitech-blue/20"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
