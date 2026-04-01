import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import {
  PROTEIN_TYPES,
  ABSORPTION_OPTIONS,
  GOAL_OPTIONS,
  FLAVOR_OPTIONS,
  PRICE_RANGES,
} from '@/data/herbalifeProducts';

export interface ActiveFilters {
  proteinTypes: string[];
  absorption: string[];
  goals: string[];
  flavors: string[];
  priceRange: string | null;
}

interface Props {
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
}

const FilterSection = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-3 mb-3 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-bold text-foreground py-1">
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 mt-2' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};

const CheckboxItem = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <label className="flex items-center gap-2 py-1 cursor-pointer group">
    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-[hsl(142,70%,35%)] border-[hsl(142,70%,35%)]' : 'border-muted-foreground/40 group-hover:border-[hsl(142,70%,35%)]'}`}>
      {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
    <span className="text-sm text-muted-foreground">{label}</span>
  </label>
);

export default function ProProductFilters({ filters, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (arr: string[], val: string) => arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const activeCount = filters.proteinTypes.length + filters.absorption.length + filters.goals.length + filters.flavors.length + (filters.priceRange ? 1 : 0);

  const clearAll = () => onChange({ proteinTypes: [], absorption: [], goals: [], flavors: [], priceRange: null });

  const panel = (
    <div className="space-y-1">
      <FilterSection title="סוג חלבון">
        {PROTEIN_TYPES.map(pt => (
          <CheckboxItem key={pt.id} label={pt.name} checked={filters.proteinTypes.includes(pt.id)} onChange={() => onChange({ ...filters, proteinTypes: toggle(filters.proteinTypes, pt.id) })} />
        ))}
      </FilterSection>

      <FilterSection title="מהירות ספיגה">
        {ABSORPTION_OPTIONS.map(opt => (
          <CheckboxItem key={opt.id} label={opt.name} checked={filters.absorption.includes(opt.id)} onChange={() => onChange({ ...filters, absorption: toggle(filters.absorption, opt.id) })} />
        ))}
      </FilterSection>

      <FilterSection title="מטרה">
        {GOAL_OPTIONS.map(opt => (
          <CheckboxItem key={opt.id} label={opt.name} checked={filters.goals.includes(opt.id)} onChange={() => onChange({ ...filters, goals: toggle(filters.goals, opt.id) })} />
        ))}
      </FilterSection>

      <FilterSection title="טעם">
        {FLAVOR_OPTIONS.map(flavor => (
          <CheckboxItem key={flavor} label={flavor} checked={filters.flavors.includes(flavor)} onChange={() => onChange({ ...filters, flavors: toggle(filters.flavors, flavor) })} />
        ))}
      </FilterSection>

      <FilterSection title="טווח מחיר">
        {PRICE_RANGES.map(range => (
          <label key={range.id} className="flex items-center gap-2 py-1 cursor-pointer group">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${filters.priceRange === range.id ? 'border-[hsl(142,70%,35%)]' : 'border-muted-foreground/40 group-hover:border-[hsl(142,70%,35%)]'}`}>
              {filters.priceRange === range.id && <div className="w-2 h-2 rounded-full bg-[hsl(142,70%,35%)]" />}
            </div>
            <span className="text-sm text-muted-foreground">{range.name}</span>
          </label>
        ))}
        {filters.priceRange && (
          <button onClick={() => onChange({ ...filters, priceRange: null })} className="text-xs text-[hsl(142,70%,35%)] mt-1">
            נקה בחירה
          </button>
        )}
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-bold text-foreground w-full justify-center"
        >
          <Filter className="w-4 h-4" />
          סינון מתקדם
          {activeCount > 0 && (
            <span className="bg-[hsl(142,70%,35%)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{activeCount}</span>
          )}
        </button>
        {isOpen && (
          <div className="mt-3 bg-card border border-border rounded-xl p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-foreground">סינון</span>
              <div className="flex items-center gap-2">
                {activeCount > 0 && <button onClick={clearAll} className="text-xs text-[hsl(142,70%,35%)]">נקה הכל</button>}
                <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            </div>
            {panel}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-card border border-border rounded-xl p-5 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4" />
            סינון מתקדם
          </span>
          {activeCount > 0 && <button onClick={clearAll} className="text-xs text-[hsl(142,70%,35%)]">נקה הכל ({activeCount})</button>}
        </div>
        {panel}
      </div>
    </>
  );
}
