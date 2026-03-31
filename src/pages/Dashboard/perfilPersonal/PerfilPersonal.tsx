import { useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import { User, Briefcase, Mail, BriefcaseBusiness } from 'lucide-react';
import { ProfileInput } from '@/components/Dashboard/profile/ProfileInput';

export default function PerfilPersonal() {
    const [formData, setFormData] = useState({
        nombre: 'María González',
        profesion: 'Ingeniera de Software',
        mail: 'maria.gonzalez@example.com',
        biografia: 'Desarrolladora full-stack con más de 5 años de experiencia...'
    });

    return (
        <DashboardLayout>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-7 space-y-4">

                    <div>
                        <p className="text-2xl! text-left font-bold text-black">Perfil Personal</p>
                        <p className="text-sm text-gray-700! text-left">
                            Administra tu información personal y profesional
                        </p>
                    </div>

                    <div className="lg:col-span-7 bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-lg! font-semibold! text-left text-black">Información Básica</h2>
                        <p className="text-sm text-gray-700! text-left mb-8!">Tu información personal será visible en tu portafolio público</p>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileInput
                                    label="Nombre Completo"
                                    icon={User}
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                                <ProfileInput
                                    label="Profesión"
                                    icon={Briefcase}
                                    value={formData.profesion}
                                    onChange={(e) => setFormData({ ...formData, profesion: e.target.value })}
                                />
                            </div>

                            <ProfileInput
                                label="Mail"
                                icon={Mail}
                                type="email"
                                value={formData.mail}
                                onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-left text-slate-700">Biografía</label>
                                <textarea
                                    rows={4}
                                    value={formData.biografia}
                                    onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                                    className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-700 outline-none transition-all text-gray-500"
                                />
                            </div>

                        </div>
                        <div className="flex justify-end pt-4">
                            <button className="bg-[#1e2a5e] text-white px-8 py-2 rounded-xl font-normal hover:bg-[#151d41] transition-colors shadow-lg shadow-blue-900/20">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>




                <div className="lg:col-span-5 space-y-4!">
                    <p className="text-xl text-left font-bold text-slate-500!  ">
                        Vista previa en tiempo real
                    </p>

                    <div className="bg-[#1e2a5e] rounded-2xl p-4 shadow-2xl min-h-125 flex flex-col gap-4">

                        <div className="bg-linear-to-br from-slate-400 to-slate-200 rounded-2xl p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-2xl font-bold mb-3 border-4 border-white/30">
                                MG
                            </div>
                            <h3 className="text-xl font-bold text-black">{formData.nombre}</h3>
                            <p className="text-gray-900! font-medium mb-2">{formData.profesion || 'Tu Título Profesional'}</p>
                            <p className="text-slate-800! text-sm">{formData.mail}</p>
                        </div>

                        <div className="bg-white rounded-2xl flex-1 p-8 flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-2 rounded-2xl mb-2">
                                <BriefcaseBusiness className="text-black" size={90} strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-semibold text-black mb-2">Tu portafolio está vacío</h4>
                            <p className="text-gray-700! text-sm px-2">
                                Comienza agregando información en las secciones del menú lateral. Los cambios se reflejarán aquí en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}