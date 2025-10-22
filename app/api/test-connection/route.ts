import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiUrl = searchParams.get('url')

    if (!apiUrl) {
      return NextResponse.json({
        success: false,
        error: 'API URL is required'
      })
    }

    console.log('🔍 Testing connection to:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    })

    console.log('📡 Response status:', response.status)
    console.log('📡 Response ok:', response.ok)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    console.log('📡 Content-Type:', contentType)
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text()
      console.log('❌ Non-JSON response:', textResponse)
      throw new Error(`API returned non-JSON response: ${textResponse}`)
    }

    const data = await response.json()
    console.log('📦 Response data:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      data: data
    })
    
  } catch (error) {
    console.error('❌ Connection test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
