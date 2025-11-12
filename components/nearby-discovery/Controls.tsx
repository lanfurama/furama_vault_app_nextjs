import { useState } from 'react'

import { BrainIcon, SearchIcon } from './icons'

interface ControlsProps {
  onSearch: (
    categories: string[],
    radius: number,
    isThinkingMode: boolean,
  ) => void
  isLoading: boolean
}

const CATEGORIES = ['Coffee', 'Restaurant', 'Park', 'Bar', 'Museum', 'Bakery']

const Controls = ({ onSearch, isLoading }: ControlsProps) => {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(['Coffee'])
  const [radius, setRadius] = useState<number>(5)
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false)

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(current => current !== category)
        : [...prev, category],
    )
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (selectedCategories.length > 0) {
      onSearch(selectedCategories, radius, isThinkingMode)
    }
  }

  return (
    <div className="sticky top-4 z-10 mb-8 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-lg dark:border-charcoal-700 dark:bg-charcoal-900/80">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-600">
            What are you looking for?
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => !isLoading && handleCategoryToggle(category)}
                disabled={isLoading}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-charcoal-800 dark:text-secondary-300 dark:hover:bg-charcoal-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex w-full items-center gap-3 md:w-auto md:min-w-[220px]">
            <label
              htmlFor="radius"
              className="shrink-0 text-sm font-medium text-gray-600"
            >
              Radius:
            </label>
            <input
              id="radius"
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={event => setRadius(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-charcoal-800"
              disabled={isLoading}
            />
            <span className="w-12 text-center text-sm font-semibold text-blue-600">
              {radius} km
            </span>
          </div>

          <button
            type="button"
            className="flex select-none items-center gap-2"
            onClick={() => !isLoading && setIsThinkingMode(!isThinkingMode)}
            disabled={isLoading}
          >
            <span
              className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                isThinkingMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-charcoal-700'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                  isThinkingMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
            <span className="flex items-center gap-1.5">
              <BrainIcon
                className={`h-5 w-5 transition-colors ${
                  isThinkingMode ? 'text-blue-500' : 'text-gray-500 dark:text-secondary-400'
                }`}
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  isThinkingMode ? 'text-blue-600' : 'text-gray-500 dark:text-secondary-400'
                }`}
              >
                Thinking Mode
              </span>
            </span>
          </button>

          <button
            type="submit"
            disabled={isLoading || selectedCategories.length === 0}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:cursor-not-allowed disabled:bg-gray-400 md:ml-auto md:w-auto dark:disabled:bg-charcoal-700"
          >
            {isLoading ? (
              <svg
                className="mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <SearchIcon className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Controls

