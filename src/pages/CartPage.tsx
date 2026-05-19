import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";
import ProBody from "@/components/ProBody";

export default function CartPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  return (
    <ProBody>
      <CartDrawer isOpen={isOpen} onClose={handleClose} />
    </ProBody>
  );
}
