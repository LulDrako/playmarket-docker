import { Star } from 'lucide-react'

export default function StarRating({ rating = 4.0, maxStars = 5, size = 'w-4 h-4' }) {
  const stars = []
  
  for (let i = 1; i <= maxStars; i++) {
    const fillPercentage = Math.min(Math.max(rating - (i - 1), 0), 1) * 100
    
    stars.push(
      <div key={i} className="relative inline-block">
        {/* Étoile vide (gris) */}
        <Star className={`${size} text-gray-600`} />
        
        {/* Étoile remplie partiellement (jaune) */}
        {fillPercentage > 0 && (
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className={`${size} text-yellow-400 fill-current`} />
          </div>
        )}
      </div>
    )
  }
  
  return <div className="flex items-center">{stars}</div>
}

