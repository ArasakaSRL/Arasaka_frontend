import React, { useState } from 'react';
import { Mail, Calendar, Eye, BarChart3, MessageSquare, Download, AlertCircle, Send, LayoutDashboard, UserCheck, Edit2, Check, AlertTriangle } from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import type { ReportDataPayload } from '../types/ReporteGmail.type';
import { enviarReporteGmail } from '../lib/enviarReporte.service';
import { toast } from "../../../components/Alerta";
import { useAuthStore } from "@/stores/authStore";

export default function ReporteMensualPage() {
  const { user } = useAuthStore();
  
  // 1. Estados de Inputs y Modos
  const [email, setEmail] = useState(user?.correo || '');
  const [esEditable, setEsEditable] = useState(false); 
  const [diaEnvio, setDiaEnvio] = useState('28'); 
  const [enviando, setEnviando] = useState(false); 

  // 2. Switches de estadísticas a incluir
  const [incluirVistas, setIncluirVistas] = useState(true);
  const [incluirPerfil, setIncluirPerfil] = useState(true); 
  const [incluirProyectos, setIncluirProyectos] = useState(true);
  const [incluirMensajes, setIncluirMensajes] = useState(true);
  const [incluirCv, setIncluirCv] = useState(false); 

  const esCorreoValido = (correo: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const todoDesmarcado = !incluirVistas && !incluirPerfil && !incluirProyectos && !incluirMensajes && !incluirCv;
  const correoInvalido = email.trim() !== "" && !esCorreoValido(email);

  const obtenerFechaCorteActual = (): string => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const anio = hoy.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };
  const handleEnviarReportePrueba = async () => {
    if (enviando) return;

    if (!email.trim()) {
      toast.error('El correo electrónico no puede estar vacío.');
      return;
    }

    if (!esCorreoValido(email)) {
      toast.error('Por favor, ingresa una dirección de correo válida.');
      return;
    }

    setEnviando(true);
    
    const payload: ReportDataPayload = {
      enviar_email: "false", 
      email: email,
      fecha_corte: obtenerFechaCorteActual(), 
      incluir_vistas: incluirVistas,
      incluir_perfil: incluirPerfil, 
      incluir_proyectos: incluirProyectos,
      incluir_messages: incluirMensajes,
      incluir_cv: incluirCv
    };

    try {
      const response = await enviarReporteGmail(payload);
      if (response) {
        toast.success('Reporte de prueba enviado exitosamente. Revisa tu correo para verificar el PDF.');
      } else {
        toast.error('Hubo un error al enviar el reporte de prueba. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado al procesar el reporte.');
    } finally {
      setEnviando(false); 
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        
        <PageHeader
          icon={LayoutDashboard}
          title="Reporte Mensual"
          description="Administra la recepción automatizada de métricas de rendimiento en formato PDF"
        />

        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 font-sans text-slate-700">
          <div className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Dirección de Correo Destino
                </label>
                <div className="flex gap-2">
                  <div className="relative flex items-center flex-1">
                    <span className={`absolute left-4 text-base ${correoInvalido ? 'text-red-600' : 'text-slate-400'}`}>@</span>
                    <input
                      type="email"
                      value={email}
                      disabled={!esEditable} 
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-all placeholder-slate-300 ${
                        !esEditable 
                          ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' 
                          : correoInvalido
                            ? 'bg-rose-50/30 text-red-600 border-rose-300 focus:border-red-600 ring-1 ring-rose-100'
                            : 'bg-white text-slate-700 border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="usuario@ejemplo.com"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setEsEditable(!esEditable)}
                    className={`flex items-center justify-center px-4 rounded-xl border text-xs font-medium transition-colors ${
                      esEditable 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={esEditable ? "Confirmar correo" : "Editar correo destino"}
                  >
                    {esEditable ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </button>
                </div>

                {correoInvalido ? (
                  <p className="text-[11px] text-red-600 mt-2 font-medium">
                    ⚠️ Por favor, escribe un formato de correo válido (ejemplo: nombre@dominio.com).
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">
                    Puedes configurar el correo principal donde deseas recibir el reporte PDF.
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Día del Mes Para Envío
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-4 text-slate-400 w-4 h-4" />
                  <select
                    value={diaEnvio}
                    onChange={(e) => setDiaEnvio(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:border-blue-500 transition-colors text-slate-700"
                  >
                    <option value="01">Día 1 de cada mes</option>
                    <option value="15">Día 15 de cada mes</option>
                    <option value="28">Día 28 de cada mes</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 flex items-center text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  El reporte consolidará la información correspondiente al mes anterior inmediato.
                </p>
              </div>

            </div>

            {/* Listado de Toggles */}
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Estadísticas que deseas incluir en el PDF
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Switch: Vistas del Portafolio */}
                <div className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all shadow-sm/50 ${incluirVistas ? 'border-slate-100' : 'border-amber-100 bg-amber-50/10'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${incluirVistas ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-amber-600'}`}>
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Vistas del Portafolio</h3>
                      <p className={`text-[11px] mt-0.5 transition-colors ${incluirVistas ? 'text-slate-400' : 'text-amber-600 font-medium'}`}>
                        {incluirVistas ? 'Cantidad de visitas recibidas en tu página.' : '⚠️ No se mostrará esta información en el PDF.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncluirVistas(!incluirVistas)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      incluirVistas ? 'bg-[#10b981]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      incluirVistas ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Switch: Interacciones del Perfil */}
                <div className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all shadow-sm/50 ${incluirPerfil ? 'border-slate-100' : 'border-amber-100 bg-amber-50/10'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${incluirPerfil ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-amber-600'}`}>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Interacciones del Perfil</h3>
                      <p className={`text-[11px] mt-0.5 transition-colors ${incluirPerfil ? 'text-slate-400' : 'text-amber-600 font-medium'}`}>
                        {incluirPerfil ? 'Clics en redes, correo, foto y retención (hovers).' : '⚠️ No se mostrará esta información en el PDF.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncluirPerfil(!incluirPerfil)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      incluirPerfil ? 'bg-[#10b981]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      incluirPerfil ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Switch: Interacciones en Proyectos */}
                <div className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all shadow-sm/50 ${incluirProyectos ? 'border-slate-100' : 'border-amber-100 bg-amber-50/10'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${incluirProyectos ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-amber-600'}`}>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Interacciones en Proyectos</h3>
                      <p className={`text-[11px] mt-0.5 transition-colors ${incluirProyectos ? 'text-slate-400' : 'text-amber-600 font-medium'}`}>
                        {incluirProyectos ? 'Clics y visitas detalladas por proyecto.' : '⚠️ No se mostrará esta información en el PDF.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncluirProyectos(!incluirProyectos)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      incluirProyectos ? 'bg-[#10b981]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      incluirProyectos ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Switch: Formularios de Mensajes */}
                <div className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all shadow-sm/50 ${incluirMensajes ? 'border-slate-100' : 'border-amber-100 bg-amber-50/10'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${incluirMensajes ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-amber-600'}`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Formularios de Mensajes</h3>
                      <p className={`text-[11px] mt-0.5 transition-colors ${incluirMensajes ? 'text-slate-400' : 'text-amber-600 font-medium'}`}>
                        {incluirMensajes ? 'Resumen de correos de contacto nuevos.' : '⚠️ No se mostrará esta información en el PDF.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncluirMensajes(!incluirMensajes)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      incluirMensajes ? 'bg-[#10b981]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      incluirMensajes ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Switch: Descargas de Currículum */}
                <div className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all shadow-sm/50 ${incluirCv ? 'border-slate-100' : 'border-amber-100 bg-amber-50/10'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${incluirCv ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-amber-600'}`}>
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Descargas de Currículum</h3>
                      <p className={`text-[11px] mt-0.5 transition-colors ${incluirCv ? 'text-slate-400' : 'text-amber-600 font-medium'}`}>
                        {incluirCv ? 'Número de veces que bajaron tu PDF.' : '⚠️ No se mostrará esta información en el PDF.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncluirCv(!incluirCv)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      incluirCv ? 'bg-[#10b981]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      incluirCv ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>
            </div>

            {todoDesmarcado && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 animate-pulse">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">¡Atención!</span> Has desmarcado todas las opciones. El reporte PDF se generará completamente <span className="font-bold underline">vacío</span> y sin informacion.
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 max-w-xl">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Esta acción se ejecutará inmediatamente para enviarte un PDF actual de los reportes hasta la fecha mencionada y con la información que deseas ver.
                </p>
              </div>
              
              <button
                type="button"
                disabled={enviando || correoInvalido} 
                onClick={handleEnviarReportePrueba}
                className={`w-full md:w-auto flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
                  enviando || correoInvalido
                    ? 'bg-slate-300 cursor-not-allowed opacity-80' 
                    : 'bg-[#0a1931] hover:bg-[#112444] active:scale-[0.98]'
                }`}
              >
                <Send className={`w-4 h-4 transform rotate-45 -translate-y-0.5 ${enviando ? 'animate-pulse' : ''}`} />
                {enviando ? 'Enviando reporte...' : 'Enviar reporte de prueba'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}