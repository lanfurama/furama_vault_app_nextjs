'use client'

import { useCallback, useEffect, useState } from 'react'
import { Compass, MapPin, Sparkles } from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import StudioHeader from '@/components/Header'
import Controls from '@/components/nearby-discovery/Controls'
import ResultsGrid from '@/components/nearby-discovery/ResultsGrid'
import {
  LocationIcon,
  WarningIcon,
} from '@/components/nearby-discovery/icons'
import { requestNearbyDiscovery } from '@/services/nearbyDiscoveryService'
import type {
  Coordinates,
  GroundingSource,
  Restaurant,
} from '@/types/nearby-discovery'

const NearbyDiscoveryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const [location, setLocation] = useState<Coordinates | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationWarning, setLocationWarning] = useState<string | null>(null)
  const [canUseApproximateLocation, setCanUseApproximateLocation] =
    useState<boolean>(false)
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false)

  const [results, setResults] = useState<Restaurant[]>([])
  const [sources, setSources] = useState<GroundingSource[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState<boolean>(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    const html = document.documentElement

    html.classList.add('theme-transitioning')

    if (newDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    void html.offsetHeight

    setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, 50)

    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  const fetchApproximateLocation = useCallback(async () => {
    try {
      setIsGettingLocation(true)
      setLocationWarning(null)

      const response = await fetch('https://ipapi.co/json/')
      if (!response.ok) {
        throw new Error('Unable to determine approximate location right now.')
      }

      const data = await response.json()
      const latitude = Number(data?.latitude)
      const longitude = Number(data?.longitude)

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error(
          'The approximate location service returned invalid coordinates.',
        )
      }

      setLocation({ latitude, longitude })

      const locationLabelParts = [
        data?.city,
        data?.region,
        data?.country_name,
      ].filter(Boolean)
      const locationLabel = locationLabelParts.join(', ')

      setLocationWarning(
        locationLabel
          ? `Using an approximate location near ${locationLabel}. Results might be less accurate.`
          : 'Using an approximate location based on your IP address. Results might be less accurate.',
      )
      setLocationError(null)
      setCanUseApproximateLocation(false)
    } catch (fallbackError) {
      const message =
        fallbackError instanceof Error
          ? fallbackError.message
          : 'Please try again later.'
      setLocationError(
        `We could not access your precise location and the approximate lookup failed. ${message}`,
      )
    } finally {
      setIsGettingLocation(false)
    }
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      setLocationWarning(null)
      setCanUseApproximateLocation(true)
      return
    }

    setIsGettingLocation(true)
    setLocationError(null)
    setLocationWarning(null)
    setCanUseApproximateLocation(false)

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationError(null)
        setLocationWarning(null)
        setCanUseApproximateLocation(false)
        setIsGettingLocation(false)
      },
      err => {
        setLocation(null)
        setIsGettingLocation(false)

        if (err.code === err.PERMISSION_DENIED) {
          setLocationError(
            "We couldn't access your precise location because permission was denied. Enable location in your browser settings and retry, or use an approximate location instead.",
          )
          setCanUseApproximateLocation(true)
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationError(
            "Your device couldn't determine a precise location. Please check your connection and try again.",
          )
          setCanUseApproximateLocation(true)
        } else if (err.code === err.TIMEOUT) {
          setLocationError(
            'Getting your location timed out. Make sure location services are enabled and try again.',
          )
          setCanUseApproximateLocation(true)
        } else {
          setLocationError(
            `Error getting location: ${err.message}. Please try again.`,
          )
          setCanUseApproximateLocation(true)
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  const handleSearch = useCallback(
    async (categories: string[], radius: number, isThinkingMode: boolean) => {
      if (!location) {
        setError(
          'Cannot search without your location. Please enable location services.',
        )
        return
      }

      setIsLoading(true)
      setError(null)
      setResults([])
      setSources([])
      setHasSearched(true)

      try {
        const searchResult = await requestNearbyDiscovery({
          categories,
          radius,
          isThinkingMode,
          location,
        })
        setResults(searchResult.restaurants)
        setSources(searchResult.sources)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred.'
        setError(`Failed to get results: ${errorMessage}`)
      } finally {
        setIsLoading(false)
      }
    },
    [location],
  )

  const formattedCoordinates = location
    ? `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`
    : null

  const locationStatus = location
    ? 'Location locked'
    : isGettingLocation
      ? 'Detecting location…'
      : canUseApproximateLocation
        ? 'Approximate mode available'
        : 'Awaiting permission'

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-charcoal-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="main-content">
        <StudioHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Nearby Discovery"
          subtitle="Gemini-powered concierge scouting"
        />

        <main className="space-y-6 p-4 lg:p-6">
          <section className="rounded-3xl border border-secondary-200 bg-white p-4 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-100">
                  <Sparkles className="h-4 w-4" />
                  Gemini Discovery
                </span>
                <div>
                  <h1 className="text-2xl font-semibold text-charcoal-800 dark:text-secondary-50 lg:text-3xl">
                    Find memorable places around your guests
                  </h1>
                  <p className="mt-2 text-sm text-charcoal-500 dark:text-secondary-400">
                    Curate coffee spots, dining, and cultural highlights in seconds while
                    Gemini handles search and reasoning.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5 text-charcoal-600 dark:bg-charcoal-700/70 dark:text-secondary-200">
                    <Compass className="h-4 w-4" />
                    {locationStatus}
                  </span>
                  {formattedCoordinates && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5 text-charcoal-600 dark:bg-charcoal-700/70 dark:text-secondary-200">
                      <MapPin className="h-4 w-4" />
                      {formattedCoordinates}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5 text-charcoal-600 dark:bg-charcoal-700/70 dark:text-secondary-200">
                    Thinking mode ready
                  </span>
                </div>
              </div>
              <div className="grid w-full max-w-sm gap-3 text-sm">
                <div className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-charcoal-400 dark:text-secondary-500">
                    Next step
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-charcoal-700 dark:text-secondary-100">
                    {location
                      ? 'Adjust your filters and run a search.'
                      : 'Allow location access or switch to approximate mode.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-charcoal-400 dark:text-secondary-500">
                    Coverage
                  </p>
                  <p className="mt-1.5 text-sm text-charcoal-500 dark:text-secondary-400">
                    {canUseApproximateLocation
                      ? 'Approximate mode is available if precise GPS fails.'
                      : 'Using precise geolocation when available.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {locationError && (
              <div
                className="relative flex flex-col gap-4 rounded-2xl border border-danger-300 bg-danger-50 px-4 py-4 text-danger-700 dark:border-danger-700 dark:bg-danger-900/40 dark:text-danger-200 sm:flex-row sm:items-center sm:justify-between"
                role="alert"
              >
                <div className="flex items-start">
                  <WarningIcon className="mr-3 h-6 w-6" />
                  <span>{locationError}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={isGettingLocation}
                    className="rounded-md bg-danger-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger-500 disabled:cursor-not-allowed disabled:bg-danger-300"
                  >
                    {isGettingLocation ? 'Retrying…' : 'Retry location access'}
                  </button>
                  {canUseApproximateLocation && (
                    <button
                      type="button"
                      onClick={fetchApproximateLocation}
                      disabled={isGettingLocation}
                      className="rounded-md border border-danger-600 bg-white px-4 py-2 text-sm font-semibold text-danger-700 transition-colors hover:bg-danger-50 disabled:cursor-not-allowed disabled:border-danger-300 disabled:bg-danger-50 disabled:text-danger-300 dark:bg-transparent dark:hover:bg-danger-900/60"
                    >
                      {isGettingLocation ? 'Determining…' : 'Use approximate location'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {locationWarning && (
              <div
                className="flex items-center rounded-2xl border border-warning-300 bg-warning-50 px-4 py-4 text-warning-700 dark:border-warning-700 dark:bg-warning-900/40 dark:text-warning-100"
                role="status"
              >
                <WarningIcon className="mr-3 h-6 w-6 text-warning-600 dark:text-warning-200" />
                <span>{locationWarning}</span>
              </div>
            )}

            {location ? (
              <Controls onSearch={handleSearch} isLoading={isLoading} />
            ) : (
              !locationError && (
                <div className="flex items-center justify-center rounded-2xl border border-secondary-200 bg-white/60 p-6 text-sm text-charcoal-500 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-900/60 dark:text-secondary-300">
                  <LocationIcon className="mr-3 h-6 w-6 animate-pulse text-charcoal-400 dark:text-secondary-400" />
                  {isGettingLocation
                    ? 'Getting your location…'
                    : 'Waiting for location access…'}
                </div>
              )
            )}
          </section>

          <section className="rounded-3xl border border-secondary-200 bg-white p-4 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800 lg:p-6">
            <ResultsGrid
              results={results}
              sources={sources}
              isLoading={isLoading}
              error={error}
              hasSearched={hasSearched}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default NearbyDiscoveryPage

