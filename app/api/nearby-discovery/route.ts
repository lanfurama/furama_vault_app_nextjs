import { NextResponse } from 'next/server'

import { findNearbyEateries } from '@/lib/nearby-discovery'
import type { Coordinates } from '@/types/nearby-discovery'

interface RequestBody {
  categories?: unknown
  radius?: unknown
  isThinkingMode?: unknown
  location?: unknown
}

const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (
    !value ||
    typeof value !== 'object' ||
    typeof (value as Coordinates).latitude !== 'number' ||
    typeof (value as Coordinates).longitude !== 'number'
  ) {
    return false
  }

  return Number.isFinite((value as Coordinates).latitude) &&
    Number.isFinite((value as Coordinates).longitude)
}

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as RequestBody

    if (!Array.isArray(body.categories) || body.categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required.' },
        { status: 400 },
      )
    }

    const categories = body.categories.filter(
      category => typeof category === 'string' && category.trim().length > 0,
    ) as string[]

    if (categories.length === 0) {
      return NextResponse.json(
        { error: 'Categories must be non-empty strings.' },
        { status: 400 },
      )
    }

    const radius = typeof body.radius === 'number' ? body.radius : Number.NaN

    if (!Number.isFinite(radius) || radius <= 0) {
      return NextResponse.json(
        { error: 'Radius must be a positive number.' },
        { status: 400 },
      )
    }

    if (!isValidCoordinates(body.location)) {
      return NextResponse.json(
        { error: 'Valid coordinates are required.' },
        { status: 400 },
      )
    }

    const searchResult = await findNearbyEateries({
      categories,
      radius,
      isThinkingMode: Boolean(body.isThinkingMode),
      location: body.location,
    })

    return NextResponse.json(searchResult)
  } catch (error) {
    console.error('[api/nearby-discovery] Error', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'Unexpected server error.' },
      { status: 500 },
    )
  }
}

