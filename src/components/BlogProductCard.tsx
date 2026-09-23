import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { HerbalifeProduct } from '@/data/herbalifeProducts';

interface BlogProductCardProps {
  product: HerbalifeProduct;
  variant?: 'inline' | 'grid';
  onAddToCart?: (product: HerbalifeProduct) => void;
}

export default function BlogProductCard({ product, variant = 'grid', onAddToCart }: BlogProductCardProps) {
  if (variant === 'inline') {
    return (
      <aside className="my-8 not-prose bg-gradient-to-br from-[hsl(142,70%,97%)] to-card border-2 border-[hsl(142,70%,35%)]/20 rounded-2xl p-5 shadow-card animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[hsl(142,70%,35%)] text-white text-xs font-bold px-3 py-1 rounded-full">מומלץ עבורך</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to={`/product/${product.handle}`} className="shrink-0 bg-secondary/30 rounded-xl p-3 w-32 h-32 flex items-center justify-center">
            <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" loading="lazy" />
          </Link>
          <div className="flex-1 text-right">
            <Link to={`/product/${product.handle}`}>
              <h4 className="font-black text-lg text-foreground hover:text-[hsl(142,70%,35%)] transition-colors mb-1">{product.title}</h4>
            </Link>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.shortHook}</p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-black text-xl text-foreground">₪{product.price}</span>
              {onAddToCart ? (
                <button onClick={() => onAddToCart(product)} className="bg-[hsl(142,70%,35%)] text-white font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />הוסף לעגלה
                </button>
              ) : (
                <Link to={`/product/${product.handle}`} className="bg-[hsl(142,70%,35%)] text-white font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-all">
                  לפרטים
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all">
      <Link to={`/product/${product.handle}`}>
        <div className="aspect-square overflow-hidden bg-secondary/20 flex items-center justify-center p-4">
          <img src={product.image} alt={product.title} className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-[hsl(142,70%,35%)] transition-colors line-clamp-2">{product.title}</h3>
        </Link>
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-lg text-foreground">₪{product.price}</span>
        </div>
        {onAddToCart && (
          <button onClick={() => onAddToCart(product)} className="w-full bg-[hsl(142,70%,35%)] text-white font-bold py-2 text-sm rounded-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1">
            הוסף לעגלה <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
