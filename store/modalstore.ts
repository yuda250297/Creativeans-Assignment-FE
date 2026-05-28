import { create } from "zustand";

type ModalType = "locationDetail" | "deliveryList" | "about" | null;

interface ModalState {
  openModal: ModalType;
  feature: any | null;
  open: (modal: ModalType, feature?: any) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  openModal: null,
  feature: null,
  open: (openModal, feature) => {
    console.log("setOpen called with:", openModal);   // ✅ log here
    set({ openModal, feature });
  },
  close: () => {
    console.log("close called"); // ✅ log here
    set({ openModal: null, feature: null });
  },
}));