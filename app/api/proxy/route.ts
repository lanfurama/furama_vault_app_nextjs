import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 })
    }

    // Build the full API URL with all query parameters except 'endpoint'
    const apiQueryParams = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'endpoint') {
        apiQueryParams.append(key, value)
      }
    }
    
    // Check if endpoint already has query parameters
    const hasExistingParams = endpoint.includes('?')
    const separator = hasExistingParams ? '&' : '?'
    
    const apiUrl = `http://phulonghotels.com:8001${endpoint}${apiQueryParams.toString() ? `${separator}${apiQueryParams.toString()}` : ''}`
    
    console.log('🔗 Proxy API URL:', apiUrl)
    console.log('🔗 Query params:', apiQueryParams.toString())
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 })
    }

    // Build the full API URL with all query parameters except 'endpoint'
    const apiQueryParams = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'endpoint') {
        apiQueryParams.append(key, value)
      }
    }

    // Check if endpoint already has query parameters
    const hasExistingParams = endpoint.includes('?')
    const separator = hasExistingParams ? '&' : '?'

    const body = await request.json()
    const apiUrl = `http://phulonghotels.com:8001${endpoint}${apiQueryParams.toString() ? `${separator}${apiQueryParams.toString()}` : ''}`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to send data to API' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 })
    }

    // Build the full API URL with all query parameters except 'endpoint'
    const apiQueryParams = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'endpoint') {
        apiQueryParams.append(key, value)
      }
    }

    // Check if endpoint already has query parameters
    const hasExistingParams = endpoint.includes('?')
    const separator = hasExistingParams ? '&' : '?'

    const body = await request.json()
    const apiUrl = `http://phulonghotels.com:8001${endpoint}${apiQueryParams.toString() ? `${separator}${apiQueryParams.toString()}` : ''}`
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to update data via API' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 })
    }

    // Build the full API URL with all query parameters except 'endpoint'
    const apiQueryParams = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'endpoint') {
        apiQueryParams.append(key, value)
      }
    }

    // Check if endpoint already has query parameters
    const hasExistingParams = endpoint.includes('?')
    const separator = hasExistingParams ? '&' : '?'

    const apiUrl = `http://phulonghotels.com:8001${endpoint}${apiQueryParams.toString() ? `${separator}${apiQueryParams.toString()}` : ''}`
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to delete data via API' },
      { status: 500 }
    )
  }
}
