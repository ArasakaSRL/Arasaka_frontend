import React, { useState } from 'react';
import { Mail, Calendar, Eye, BarChart3, MessageSquare, Download, AlertCircle, Send, LayoutDashboard } from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import type  { ReportDataPayload } from '../types/ReporteGmail.type';
import { enviarReporteGmail } from '../lib/enviarReporte.service';


export default function ReporteMensualPage() {
  // 1. Estados del Formulario basados en la interfaz de la imagen
  const [email, setEmail] = useState('giuliana.dev@example.com');
  const [diaEnvio, setDiaEnvio] = useState('28'); // Día seleccionado en el dropdown
  
  // Switches de estadísticas a incluir
  const [incluirVistas, setIncluirVistas] = useState(true);
  const [incluirProyectos, setIncluirProyectos] = useState(true);
  const [incluirMensajes, setIncluirMensajes] = useState(true);
  const [incluirCv, setIncluirCv] = useState(false); // Desactivado por defecto según la imagen

  // 2. Función auxiliar para formatear la fecha actual a "dd-mm-yyyy"
  const obtenerFechaCorteActual = (): string => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const anio = hoy.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  
  const handleEnviarReportePrueba = async () => {
    const payload: ReportDataPayload = {
      enviar_email: "true", 
      email: email,
      fecha_corte: obtenerFechaCorteActual(), 
      incluir_vistas: incluirVistas,
      incluir_proyectos: incluirProyectos,
      incluir_messages: incluirMensajes,
      incluir_cv: incluirCv
    };
    const response =  await enviarReporteGmail(payload);
    if(response){
      alert('Reporte de prueba enviado exitosamente. Revisa tu correo para verificar el PDF.');
    }else{
        alert('Hubo un error al enviar el reporte de prueba. Por favor, intenta nuevamente.');
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
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 text-base">@</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-300"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Puedes configurar el correo principal donde deseas recibir el reporte PDF.
                </p>
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

          
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Estadísticas que deseas incluir en el PDF
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
              
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Vistas del Portafolio</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Cantidad de visitas recibidas en tu página.</p>
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

               
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Interacciones en Proyectos</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Clics y visitas detalladas por proyecto.</p>
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

               
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Formularios de Mensajes</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Resumen de correos de contacto nuevos.</p>
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

              
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Descargas de Currículum</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Número de veces que bajaron tu PDF.</p>
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

          
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 max-w-xl">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Esta acción ejecutará  inmediatamente para enviarte un  PDF actual de los reportes asta la  fecha mencinada y con la informacion que deseas ver.
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleEnviarReportePrueba}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0a1931] hover:bg-[#112444] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 transform rotate-45 -translate-y-0.5" />
                Enviar reporte de prueba
              </button>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}