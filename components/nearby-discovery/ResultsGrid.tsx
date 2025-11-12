import { useMemo, useState } from 'react'

import type {
  GroundingSource,
  Restaurant,
} from '@/types/nearby-discovery'

import RestaurantCard from './RestaurantCard'
import { CompassIcon, ExternalLinkIcon, WarningIcon } from './icons'

interface ResultsGridProps {
  results: Restaurant[]
  sources: GroundingSource[]
  isLoading: boolean
  error: string | null
  hasSearched: boolean
}

const SkeletonCard = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-charcoal-700 dark:bg-charcoal-800">
    <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-charcoal-700" />
    <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-charcoal-700" />
    <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-charcoal-700" />
    <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-charcoal-700" />
    <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-charcoal-700" />
  </div>
)

type SortOption = 'rating-desc' | 'rating-asc' | 'name-asc'

const ResultsGrid = ({
  results,
  sources,
  isLoading,
  error,
  hasSearched,
}: ResultsGridProps) => {
  const [sortOption, setSortOption] = useState<SortOption>('rating-desc')

  const sortedResults = useMemo(() => {
    const cloned = [...results]
    switch (sortOption) {
      case 'rating-asc':
        return cloned.sort((a, b) => {
          const ratingA = typeof a.rating === 'number' ? a.rating : -1
          const ratingB = typeof b.rating === 'number' ? b.rating : -1
          return ratingA - ratingB
        })
      case 'name-asc':
        return cloned.sort((a, b) => a.name.localeCompare(b.name))
      case 'rating-desc':
      default:
        return cloned.sort((a, b) => {
          const ratingA = typeof a.rating === 'number' ? a.rating : -1
          const ratingB = typeof b.rating === 'number' ? b.rating : -1
          return ratingB - ratingA
        })
    }
  }, [results, sortOption])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="my-4 flex items-center justify-center rounded-lg border border-danger-300 bg-danger-50 px-4 py-3 text-center text-danger-700 dark:border-danger-700 dark:bg-danger-900/40 dark:text-danger-200"
        role="alert"
      >
        <WarningIcon className="mr-3 h-6 w-6" />
        <span>{error}</span>
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="px-4 py-16 text-center">
        <CompassIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-secondary-400" />
        <h3 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-secondary-100">
          Ready to Explore?
        </h3>
        <p className="mt-2 text-gray-500 dark:text-secondary-400">
          Select a category above to find amazing places near you.
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <CompassIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-secondary-400" />
        <h3 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-secondary-100">
          No results found
        </h3>
        <p className="mt-2 text-gray-500 dark:text-secondary-400">
          Try a different category or expand your search radius.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-secondary-300">
          {sortedResults.length} places found
        </h3>
        <div className="flex items-center gap-2">
          <label
            htmlFor="nearby-sort"
            className="text-sm font-medium text-gray-600 dark:text-secondary-300"
          >
            Sort by
          </label>
          <select
            id="nearby-sort"
            value={sortOption}
            onChange={event => setSortOption(event.target.value as SortOption)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-charcoal-700 dark:bg-charcoal-900 dark:text-secondary-200"
          >
            <option value="rating-desc">Highest rating</option>
            <option value="rating-asc">Lowest rating</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedResults.map((restaurant, index) => (
          <RestaurantCard
            key={`${restaurant.name}-${index}`}
            restaurant={restaurant}
            index={index}
          />
        ))}
      </div>
      {sources.length > 0 && (
        <div className="mt-12 rounded-lg border border-gray-200 bg-white/70 p-4 dark:border-charcoal-700 dark:bg-charcoal-900/50">
          <h3 className="mb-3 text-lg font-semibold text-blue-600 dark:text-blue-300">
            Data Sources
          </h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={`${source.uri}-${index}`}>
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-indigo-500 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  <ExternalLinkIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{source.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ResultsGrid

