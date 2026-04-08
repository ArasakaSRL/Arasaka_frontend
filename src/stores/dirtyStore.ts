import { create } from 'zustand'

interface DirtyState {
    isDirty: boolean
    setDirty: (val: boolean) => void
}

export const useDirtyStore = create<DirtyState>((set) => ({
    isDirty: false,
    setDirty: (val) => set({ isDirty: val }),
}))
