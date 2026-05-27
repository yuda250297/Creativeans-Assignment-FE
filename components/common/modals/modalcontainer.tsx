import { useModalStore } from "@/store/modalstore";
import { ModalLocationDetail } from "./modal-locationdetail";
import { ModalDeliveryList } from "./modal-deliverylist";

export default function ModalContainer() {
  const { openModal, feature, close } = useModalStore();

  switch (openModal) {
    case "locationDetail":
      return <ModalLocationDetail open={true} onOpenChange={close} feature={feature} />;
    case "deliveryList":
      return <ModalDeliveryList open={true} onOpenChange={close} feature={feature} />;
    default:
      return null;
  }
}