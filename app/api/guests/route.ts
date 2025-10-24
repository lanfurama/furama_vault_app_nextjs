import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Use default API URL for Vercel deployment
    const API_BASE_URL = process.env.API_BASE_URL || 'http://phulonghotels.com:8001'

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const hasEmail = searchParams.get('has_email')
    
    // Build API URL with parameters
    let apiUrl = `${API_BASE_URL}/api/v1/guests/guests/`
    const queryParams = new URLSearchParams()
    
    if (hasEmail === 'true') {
      queryParams.append('has_email', 'true')
    }
    
    if (queryParams.toString()) {
      apiUrl += `?${queryParams.toString()}`
    }
    
    console.log('🔗 Backend API URL:', apiUrl)
    console.log('🔗 API_BASE_URL:', API_BASE_URL)
    console.log('🔗 has_email parameter:', hasEmail)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    })

    console.log('📡 Backend response status:', response.status)
    console.log('📡 Backend response ok:', response.ok)
    console.log('📡 Backend response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Backend error response:', errorText)
      throw new Error(`Backend API responded with status: ${response.status} - ${errorText}`)
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    console.log('📡 Content-Type:', contentType)
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text()
      console.log('❌ Non-JSON response:', textResponse)
      throw new Error(`Backend API returned non-JSON response: ${textResponse}`)
    }

    const data = await response.json()
    console.log('📦 Backend response data:', JSON.stringify(data, null, 2))
    console.log('📦 Backend response keys:', Object.keys(data))
    
    // Log first item structure if exists
    if (data.data && data.data.length > 0) {
      console.log('👤 First guest item:', JSON.stringify(data.data[0], null, 2))
      console.log('👤 First guest keys:', Object.keys(data.data[0]))
    } else if (Array.isArray(data) && data.length > 0) {
      console.log('👤 First guest item:', JSON.stringify(data[0], null, 2))
      console.log('👤 First guest keys:', Object.keys(data[0]))
    }
    
    // Return the data as-is for frontend pagination
    console.log('📦 Returning data:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Error fetching guests from backend:', error)
    
    // Return empty data structure instead of error to prevent JSON parse issues
    return NextResponse.json({
      data: [],
      total: 0,
      skip: 0,
      limit: 20,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
