import type { Restaurant } from '@/types/nearby-discovery'

import { MapPinIcon } from './icons'

interface RestaurantCardProps {
  restaurant: Restaurant
  index: number
}

const RestaurantCard = ({ restaurant, index }: RestaurantCardProps) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${restaurant.name}, ${restaurant.address}`,
  )}`
  const animationDelay = `${index * 100}ms`

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-safe:animate-slide-up dark:border-charcoal-700 dark:bg-charcoal-900"
      style={{ animationDelay }}
    >
      <div className="flex-grow p-5">
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-300">
          {restaurant.name}
        </h3>
        {restaurant.address && (
          <p className="mt-1 flex items-center text-sm text-gray-500 dark:text-secondary-400">
            <MapPinIcon className="mr-1.5 h-4 w-4 shrink-0" />
            {restaurant.address}
          </p>
        )}
        <p className="mt-4 text-base text-gray-700 dark:text-secondary-300">
          {restaurant.description}
        </p>
      </div>
      {restaurant.address && (
        <div className="mt-auto p-5 pt-0">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full rounded-lg bg-gray-100 px-4 py-2 text-center font-semibold text-blue-600 transition-colors hover:bg-gray-200 dark:bg-charcoal-800 dark:text-blue-300 dark:hover:bg-charcoal-700"
          >
            View on Map
          </a>
        </div>
      )}
    </div>
  )
}

export default RestaurantCard

