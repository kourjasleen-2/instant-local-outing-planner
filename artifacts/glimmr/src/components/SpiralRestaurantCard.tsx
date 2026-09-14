import { Clock3, IndianRupee, MapPin, Star, Users2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Place } from '@/types/glimmr';
import { placePrice } from '@/lib/glimmr-format';

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border?: string }> = {
  Cafe: { bg: '#FDF1D5', color: '#8A5408', border: '#E8BF73' },
  Dinner: { bg: '#FCE4E6', color: '#9A2E3F', border: '#E6A3AD' },
  Drinks: { bg: '#E4EAFF', color: '#3347A9', border: '#AFC0FF' },
  Dessert: { bg: '#F7E6F4', color: '#95417A', border: '#D7A7CB' },
  Activity: { bg: '#E2F4EB', color: '#1E6A4B', border: '#99D2B5' },
  Culture: { bg: '#EEE8FF', color: '#6244AE', border: '#C7BAF8' },
  Outdoor: { bg: '#DFF4EF', color: '#0F6A62', border: '#8ECDC2' },
};

const defaultColor = { bg: '#EDF2F8', color: '#334155', border: '#CBD5E1' };

export interface SpiralRestaurantCardProps {
  place: Place;
  index: number;
}

export default function SpiralRestaurantCard({ place }: SpiralRestaurantCardProps) {
  const color = CATEGORY_COLORS[place.category] ?? defaultColor;
  const price = placePrice(place);
  const priceText = price === 0 ? 'FREE' : `₹${price}`;
  const categoryStyle = {
    '--spiral-category-bg': color.bg,
    '--spiral-category-color': color.color,
    '--spiral-category-border': color.border,
  } as CSSProperties;

  return (
    <div className="spiral-restaurant">
      <div className="spiral-restaurant__head">
        <span className="spiral-restaurant__category" style={categoryStyle}>
          {place.subcategory ?? place.category}
        </span>
        <span className="spiral-restaurant__rating">
          <Star size={10} className="spiral-restaurant__ratingStar" />
          {place.rating.toFixed(1)}
        </span>
      </div>

      <h3 className="spiral-restaurant__name">{place.name}</h3>
      <p className="spiral-restaurant__vibe">“{place.vibe}”</p>
      <p className="spiral-restaurant__desc">{place.description}</p>

      <div className="spiral-restaurant__tags">
        {place.activities.slice(0, 3).map((activity) => (
          <span key={activity} className="spiral-restaurant__tag">{activity}</span>
        ))}
      </div>

      <div className="spiral-restaurant__meta">
        <div className="spiral-restaurant__metaItem" title="Price per person">
          <IndianRupee size={11} />
          <strong>{priceText}</strong>
        </div>
        <div className="spiral-restaurant__metaItem" title="Typical visit duration">
          <Clock3 size={11} />
          <strong>{place.typicalVisitDuration} min</strong>
        </div>
        <div className="spiral-restaurant__metaItem" title="Best for">
          <Users2 size={11} />
          <strong>{place.suitableFor.slice(0, 2).join(', ')}</strong>
        </div>
        <div className="spiral-restaurant__metaItem" title="Address">
          <MapPin size={11} />
          <strong>{place.address.split(',')[0]}</strong>
        </div>
      </div>
    </div>
  );
}
