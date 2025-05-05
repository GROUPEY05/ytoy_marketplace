import { create } from 'zustand'

const useCartStore = create((set) => ({
  isCartModalOpen: false,
  setCartModalOpen: (isOpen) => set({ isCartModalOpen: isOpen }),
}))

export default useCartStore
