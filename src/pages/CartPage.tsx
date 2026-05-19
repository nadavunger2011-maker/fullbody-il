import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CartDrawer from "@/components/CartDrawer";

export default function CartPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>עגלת קניות | FullBody</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background" />
      <CartDrawer isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
