import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Plus, FolderOpen } from 'lucide-react';

import type { Portfolio } from '@/features/portafolio/types/portafolioType';
import type { PortafolioCompleto } from '@/features/auth/types/portafolioData';
import  { toast } from "@/components/Alerta";
import { PortfolioCard } from '@/features/portafolio/components/PortfolioCard';
import { NewPortfolioModal } from '@/features/portafolio/components/NewPortfolioModal';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

import {
  createPortafolio,
  obtnerPortafolio,
} from '@/features/portafolio/lib/portafolio.service';

import DashboardLayout from '@/layout/DashboardLayout';

export default function PagePortafolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portafoliosCompletos, setPortafoliosCompletos] = useState<PortafolioCompleto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const setPortafolioSeleccionado = useAuthStore(s => s.setPortafolioSeleccionado);
  const portafolioSeleccionado = useAuthStore(s => s.portafolioSeleccionado);
  const navigate = useNavigate();

  const getPortafolios = async () => {
    try {
      setLoading(true);

      const response = await obtnerPortafolio();

      setPortafoliosCompletos(response.data as unknown as PortafolioCompleto[]);

      setPortfolios(
        response.data.map((p) => ({
          id: p.id_portafolio,
          name: p.nombre,
          description: p.descripcion,
          visibility: p.visibilidad ? 'public' : 'private',
          createdAt: new Date(p.fecha_creacion)
            .toLocaleDateString('es-ES')
            .replace(/\//g, '-'),
        }))
      );
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPortafolios();
  }, []);

  const handleCreatePortfolio = async (
    newPortfolio: Omit<Portfolio, 'id' | 'createdAt'>
  ) => {
    try {
      await createPortafolio({
        nombre: newPortfolio.name,
        descripcion: newPortfolio.description,
        visibilidad: newPortfolio.visibility === 'public',

        redesProfesionales: [
          ...(newPortfolio.githubUrl
            ? [{ nombre: 'GitHub', url: newPortfolio.githubUrl }]
            : []),

          ...(newPortfolio.linkedinUrl
            ? [{ nombre: 'LinkedIn', url: newPortfolio.linkedinUrl }]
            : []),
        ],
      });
      toast.success('Portafolio creado exitosamente');
      await getPortafolios();

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast.error('Error al crear el portafolio');
    }
  };

  const handleManagePortfolio = (id: string) => {
    const completo = portafoliosCompletos.find(p => p.id_portafolio === id);
    if (completo) {
      setPortafolioSeleccionado(completo);
      toast.success(`Gestionando: ${completo.nombre}`);
    }
    navigate('/Dashboard/perfil/General');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        
        <header className="bg-white border-b border-gray-100 relative shadow-xs z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-[#0a1a3a] to-[#112e57] rounded-xl flex items-center justify-center text-white shadow-md">
                <FolderOpen size={20} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-normal">
                  Portafolios
                </h1>

                <p className="text-xs text-gray-400 mt-0.5">
                  {portfolios.length}{' '}
                  {portfolios.length === 1
                    ? 'portafolio creado'
                    : 'portafolios creados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {portfolios.length > 0 && !loading && (
                <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200/30">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-xs text-gray-800'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Vista Cuadrícula"
                  >
                    <LayoutGrid size={16} />
                  </button>

                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-white shadow-xs text-gray-800'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Vista Lista"
                  >
                    <List size={16} />
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-linear-to-br from-[#0a1a3a] to-[#112e57] text-white text-sm font-semibold rounded-xl transition-opacity hover:opacity-95 shadow-md flex items-center gap-1.5"
              >
                <Plus size={16} />
                Nuevo
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {loading ? (
            <div className="min-h-[45vh] flex items-center justify-center">
              <p className="text-sm text-gray-500 animate-pulse">
                Cargando portafolios...
              </p>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="min-h-[45vh] flex flex-col items-center justify-center text-center px-4">
              
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-5">
                <Plus size={28} strokeWidth={1.5} />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Sin portafolios aún
              </h2>

              <p className="text-sm text-gray-400 max-w-sm mt-1.5 leading-relaxed">
                Comienza creando tu primer portafolio profesional y comparte tu
                trabajo con el mundo
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-5 py-2.5 bg-linear-to-br from-[#0a1a3a] to-[#112e57] text-white text-sm font-medium rounded-xl shadow-lg transition-opacity hover:opacity-95 flex items-center gap-2"
              >
                Crear mi primer portafolio
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center'
                  : 'flex flex-col gap-3 w-full'
              }
            >
              {portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  viewMode={viewMode}
                  onManage={handleManagePortfolio}
                  isActive={portfolio.id === portafolioSeleccionado?.id_portafolio}
                />
              ))}
            </div>
          )}
        </main>

        <NewPortfolioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreatePortfolio}
        />
      </div>
    </DashboardLayout>
  );
}