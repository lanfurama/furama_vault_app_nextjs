import * as XLSX from 'xlsx'

interface Guest {
  guest_id: number
  guest_number: string
  title: string
  first_name: string
  last_name: string
  guest_type: string
  vip_status: string
  guest_status: string
  email: string | null
  phone: string | null
  loyalty_points: number
  loyalty_tier: string
  created_date: string
  nationality?: string
}

export const exportToExcel = (guests: Guest[], filename: string = 'guests_export') => {
  // Prepare data for export - only include required columns
  const exportData = guests.map(guest => ({
    'Title': guest.title || '',
    'Full Name': guest.first_name && guest.last_name 
      ? `${guest.first_name} ${guest.last_name}`.trim()
      : guest.first_name || '',
    'Last Name': guest.last_name || '',
    'Email': guest.email || ''
  }))

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)

  // Set column widths for the 4 columns only
  const colWidths = [
    { wch: 8 },   // Title
    { wch: 25 },  // Full Name
    { wch: 20 },  // Last Name
    { wch: 30 }   // Email
  ]
  ws['!cols'] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Guests')

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const finalFilename = `${filename}_${timestamp}.xlsx`

  // Export file
  XLSX.writeFile(wb, finalFilename)
  
  return finalFilename
}

export const exportFilteredToExcel = (
  guests: Guest[], 
  filters: any, 
  filename: string = 'filtered_guests_export'
) => {
  // Add filter info to the export
  const filterInfo = {
    'Export Date': new Date().toLocaleString(),
    'Total Records': guests.length,
    'Date Range': filters.dateRange || 'All',
    'Sort By': filters.sortBy || 'Created Date',
    'Sort Order': filters.sortOrder || 'Descending'
  }

  // Prepare data for export - only include required columns
  const exportData = guests.map(guest => ({
    'Title': guest.title || '',
    'Full Name': guest.first_name && guest.last_name 
      ? `${guest.first_name} ${guest.last_name}`.trim()
      : guest.first_name || '',
    'Last Name': guest.last_name || '',
    'Email': guest.email || ''
  }))

  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Add filter info sheet
  const filterWs = XLSX.utils.json_to_sheet([filterInfo])
  XLSX.utils.book_append_sheet(wb, filterWs, 'Export Info')

  // Add main data sheet
  const ws = XLSX.utils.json_to_sheet(exportData)
  
  // Set column widths for the 4 columns only
  const colWidths = [
    { wch: 8 },   // Title
    { wch: 25 },  // Full Name
    { wch: 20 },  // Last Name
    { wch: 30 }   // Email
  ]
  ws['!cols'] = colWidths

  XLSX.utils.book_append_sheet(wb, ws, 'Guests Data')

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const finalFilename = `${filename}_${timestamp}.xlsx`

  // Export file
  XLSX.writeFile(wb, finalFilename)
  
  return finalFilename
}
