import { useState, type FormEvent } from "react";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { changePassword } from "@/services/AuthService";

function getErrorMessage(error: unknown): string {
  const apiMessage = (error as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;

  if (Array.isArray(apiMessage)) return apiMessage.join(", ");
  return apiMessage ?? "No se pudo cambiar la contraseña. Inténtalo de nuevo.";
}

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmation) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setSuccess(response?.message ?? "Contraseña actualizada correctamente.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080616] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-lg rounded-2xl border border-[#162E93]/30 bg-[#0d0a24] p-6 shadow-xl sm:p-8">
        <div className="mb-7 flex items-start gap-4">
          <div className="rounded-xl bg-blue-600/20 p-3 text-blue-400">
            <KeyRound size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Cambiar contraseña</h1>
            <p className="mt-1 text-sm text-gray-400">
              Usa una contraseña de al menos 6 caracteres.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-300">
              Contraseña actual
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              className="mt-2 block w-full rounded-lg border border-[#162E93]/40 bg-[#080616] px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300">
              Nueva contraseña
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
              className="mt-2 block w-full rounded-lg border border-[#162E93]/40 bg-[#080616] px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
              Confirmar nueva contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              minLength={6}
              required
              className="mt-2 block w-full rounded-lg border border-[#162E93]/40 bg-[#080616] px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-800/50 bg-red-950/40 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="flex items-center gap-2 rounded-lg border border-emerald-800/50 bg-emerald-950/30 p-3 text-sm text-emerald-400">
              <CheckCircle2 size={18} />
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#162E93] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#162E93]/80 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? "Actualizando…" : "Actualizar contraseña"}
          </button>
        </form>
      </section>
    </main>
  );
}
