import { useRef, useState } from "react";
import {
  X,
  ArrowLeft,
  Mail,
  MessageSquare,
  Upload,
  Paperclip,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { sendGmail } from "@/features/sendGmail/api/sendGmail";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  correoDestinatario: string;
  nombreDestinatario: string;
  whatsappNumber?: string;
};

type ContactStep =
  | "options"
  | "email"
  | "success";

export default function ContactarModal({
  open,
  onClose,
  correoDestinatario,
  nombreDestinatario,
  whatsappNumber,
}: Props) {

  const [contactStep, setContactStep] = useState<ContactStep>("options");
  const [loading, setLoading] = useState(false);
  const [sendSuccess, setSendSuccess] =
    useState(false);

  const [form, setForm] = useState({
    nombre_remitente: "",
    from: "",
    subject: "",
    content: "",
  });

  const [files, setFiles] = useState<File[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  function resetState() {
    setContactStep("options");
    setSendSuccess(false);
    setLoading(false);
    setError(null);
    setFiles([]);
    setForm({
      nombre_remitente: "",
      from: "",
      subject: "",
      content: "",
    });
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      resetState();
    }, 250);
  }

  const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValid =
    form.from.trim() &&
    EMAIL_RE.test(form.from) &&
    form.content.trim();

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
  function addFiles(
    incoming: FileList | null
  ) {
    if (!incoming) return;

    const next = [...files];

    for (const file of Array.from(incoming)) {

      if (next.length >= 3)
        break;

      if (
        !next.find(
          f =>
            f.name === file.name &&
            f.size === file.size
        )
      ) {
        next.push(file);
      }
    }

    setFiles(next);
  }

  function removeFile(index: number) {
    setFiles(
      files.filter(
        (_, i) => i !== index
      )
    );
  }

  async function handleFormSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!isValid) return;

    try {

      setLoading(true);

      await sendGmail({
        to: correoDestinatario,
        ...form,
        adjuntos:
          files.length > 0
            ? files
            : undefined,
      });

      setSendSuccess(true);

    } catch {

      setError(
        "No se pudo enviar el correo."
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className=" fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 "
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.2,
            }}
            className=" bg-white rounded-4xl border-4 border-slate-900 text-slate-900 w-full max-w-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(123,223,242,1)] relative flex flex-col p-6 space-y-4 "
          >
            <div
              className=" flex items-center justify-between border-b-2 border-slate-100 pb-3 "
            >
              <div className="flex items-center gap-2">
                {contactStep === "email" && (
                  <button
                    type="button"
                    onClick={() =>
                      setContactStep("options")
                    }
                    className=" p-1 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-lg transition "
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}

                <h3
                  className="
                  font-black
                  text-lg
                  tracking-tight
                  "
                >
                  {contactStep === "options"
                    ? `Contactar a ${nombreDestinatario}`
                    : "Enviar correo electrónico"}
                </h3>

              </div>

              <button
                type="button"
                onClick={handleClose}
                className=" bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-full p-1.5 transition "
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* CONTENIDO */}

            <AnimatePresence mode="wait">

              {contactStep === "options" && (

                <motion.div
                  key="options"
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 10,
                  }}
                  className="
                  space-y-4
                  py-2
                  "
                >

                  <p
                    className=" text-center font-bold text-xs text-slate-500 uppercase tracking-wider "
                  >
                    ¿Cómo deseas contactar?
                  </p>

                  <div className="space-y-3">

                    {whatsappNumber && (

                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className=" w-full bg-[#b2f7ef] hover:bg-[#b2f7ef]/85 border-2 border-slate-900 p-4 rounded-2xl flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all text-left "
                      >

                        <div
                          className=" w-12 h-12 bg-white rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 "
                        >
                          <MessageSquare
                            className="
                            w-6
                            h-6
                            text-[#2a9d8f]
                            "
                          />
                        </div>

                        <div>

                          <h4
                            className="
                            font-black
                            text-sm
                            "
                          >
                            WhatsApp
                          </h4>

                          <p
                            className=" text-[11px] text-slate-700 font-semibold "
                          >
                            Mensaje directo e instantáneo
                          </p>
                        </div>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setContactStep("email")
                      }
                      className=" w-full bg-[#7bdff2] hover:bg-[#7bdff2]/85 border-2 border-slate-900 p-4 rounded-2xl flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all text-left "
                    >

                      <div
                        className=" w-12 h-12 bg-white rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 "
                      >
                        <Mail
                          className="
                          w-6
                          h-6
                          text-slate-900
                          "
                        />
                      </div>

                      <div>

                        <h4
                          className="
                          font-black
                          text-sm
                          "
                        >
                          Correo electrónico
                        </h4>
                        <p className=" text-[11px] text-slate-700 font-semibold ">
                          Enviar mensaje formal
                        </p>
                      </div>
                    </button>
                  </div>
                </motion.div>

              )}

              {contactStep === "email" && (

              <motion.div
                key="email"
                initial={{
                  opacity: 0,
                  x: 10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                }}
              >

              {!sendSuccess ? (

              <form
                onSubmit={handleFormSubmit}
                className="
                space-y-4
                max-h-[70vh]
                overflow-y-auto
                pr-2
                "
              >

                <Input
                  label="Tu nombre"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={form.nombre_remitente}
                  onChange={(v) =>
                    updateField(
                      "nombre_remitente",
                      v
                    )
                  }
                />

                <Input
                  label="Tu correo"
                  type="text"
                  placeholder="tu@correo.com"
                  value={form.from}
                  onChange={(v) =>
                    updateField("from", v)
                  }
                  required
                />

                <Input
                  label="Asunto"
                  type="text"
                  placeholder="Asunto"
                  value={form.subject}
                  onChange={(v) =>
                    updateField("subject", v)
                  }
                />

                <Input
                  label="Mensaje"
                  type="textarea"
                  placeholder="Escribe tu mensaje..."
                  value={form.content}
                  onChange={(v) =>
                    updateField("content", v)
                  }
                  required
                  maxLength={2000}
                  showCounter
                />

                {/* ADJUNTOS */}

                <div className="space-y-2">

                  <label
                    className="
                    text-[10px]
                    font-black
                    uppercase
                    text-slate-400
                    "
                  >
                    Adjuntos
                  </label>

                  <div
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className=" bg-[#eff7f6] hover:bg-white border-2 border-dashed border-slate-400 hover:border-slate-900 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition "
                  >
                    <Upload
                      className="
                      w-6
                      h-6
                      text-slate-500
                      mb-1
                      "
                    />
                    <span className=" text-[11px] font-bold "
                    >
                      Arrastra archivos o
                      selecciona
                    </span>
                    <span
                      className="
                      text-[9px]
                      text-slate-400
                      "
                    >
                      Máximo 3 archivos
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      addFiles(
                        e.target.files
                      )
                    }
                  />
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map(
                        (file, idx) => (
                        <div
                          key={idx}
                          className=" bg-white border rounded-xl px-3 py-2 flex items-center justify-between "
                        >
                          <div className=" flex items-center gap-2 ">
                            <Paperclip
                              size={14}
                            />
                            <span
                              className="
                              text-xs
                              "
                            >
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeFile(idx)
                            }
                          >
                            <Trash2
                              size={14}
                              className="
                              text-red-500
                              "
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {error && (
                  <p className="text-red-500 text-xs">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    loading || !isValid
                  }
                  className=" w-full bg-[#f2b5d4] hover:bg-[#f2b5d4]/90 border-2 border-slate-900 text-slate-900 font-black py-3 rounded-2xl text-xs uppercase shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center gap-2 "
                >
                  {loading ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : null}
                  {loading
                    ? "Enviando..."
                    : "Enviar mensaje"}
                </button>
              </form>
              ) : (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className=" py-12 flex flex-col items-center justify-center text-center space-y-4 "
              >
                <div
                  className=" w-16 h-16 rounded-full bg-[#b2f7ef] border-4 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] "
                >
                  <Check className=" w-8 h-8 stroke-3 text-slate-900 "/>
                </div>
                <div>
                  <h4
                    className=" font-black text-lg text-slate-900 "
                  >
                    ¡Mensaje enviado!
                  </h4>
                  <p
                    className=" text-sm text-slate-500 mt-1 "
                  >
                    Tu mensaje fue enviado correctamente a
                  </p>
                  <p
                    className=" font-black text-slate-900 mt-1 "
                  >
                    {nombreDestinatario}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className=" bg-[#7bdff2] hover:bg-[#7bdff2]/90 border-2 border-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all "
                >
                  Cerrar
                </button>
              </motion.div>
              )}
              </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}