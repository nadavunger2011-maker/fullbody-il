import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted" dir="rtl">
      <Helmet>
        <title>404 - הדף לא נמצא | FullBody</title>
        <meta name="description" content="הדף שחיפשת לא נמצא. חזור לדף הבית של FullBody ומצא מוצרי תזונה איכותיים." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404 - הדף לא נמצא</h1>
        <p className="mb-4 text-xl text-muted-foreground">הדף שחיפשת לא קיים או הועבר</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
