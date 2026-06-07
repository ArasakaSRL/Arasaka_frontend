import apiClient from '@/api/api'
import type { DenunciaAdmin, PortafolioSuspendido, UsuarioSuspendido, SystemConfig } from '../types/adminDenunciaType'

export async function getDenuncias(): Promise<DenunciaAdmin[]> {
    const { data } = await apiClient.get<{ data: { data: DenunciaAdmin[] } }>('/admin/denuncias')
    return data.data.data
}

export async function getPortafoliosSuspendidos(): Promise<PortafolioSuspendido[]> {
    const { data } = await apiClient.get<{ data: PortafolioSuspendido[] }>('/admin/portafolios-suspendidos')
    return data.data
}

export async function getUsuariosSuspendidos(): Promise<UsuarioSuspendido[]> {
    const { data } = await apiClient.get<{ data: UsuarioSuspendido[] }>('/admin/usuarios-suspendidos')
    return data.data
}

export async function getSystemConfig(): Promise<SystemConfig> {
    const { data } = await apiClient.get<{ data: SystemConfig }>('/admin/system-config')
    return data.data
}

export async function updateSystemConfig(config: Omit<SystemConfig, 'id'>): Promise<SystemConfig> {
    const { data } = await apiClient.put<{ data: SystemConfig }>('/admin/system-config', config)
    return data.data
}
