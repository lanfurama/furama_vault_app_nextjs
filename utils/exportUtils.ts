import * as XLSX from 'xlsx'

interface Guest {
  id?: number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  created_at?: string
  updated_at?: string
}

export const exportToExcel = (guests: Guest[], filename: string = 'guests_export') => {
  // Prepare data for export
  const exportData = guests.map(guest => ({
    'ID': guest.id || '',
    'Full Name': guest.first_name && guest.last_name 
      ? `${guest.first_name} ${guest.last_name}`.trim()
      : guest.name || '',
    'First Name': guest.first_name || '',
    'Last Name': guest.last_name || '',
    'Email': guest.email || '',
    'Phone': guest.phone || '',
    'Address': guest.address || '',
    'Created Date': guest.created_at ? new Date(guest.created_at).toLocaleDateString() : '',
    'Updated Date': guest.updated_at ? new Date(guest.updated_at).toLocaleDateString() : '',
    'Created Time': guest.created_at ? new Date(guest.created_at).toLocaleString() : '',
    'Updated Time': guest.updated_at ? new Date(guest.updated_at).toLocaleString() : ''
  }))

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)

  // Set column widths
  const colWidths = [
    { wch: 8 },   // ID
    { wch: 20 },  // Full Name
    { wch: 15 },  // First Name
    { wch: 15 },  // Last Name
    { wch: 25 },  // Email
    { wch: 15 },  // Phone
    { wch: 30 },  // Address
    { wch: 12 },  // Created Date
    { wch: 12 },  // Updated Date
    { wch: 20 },  // Created Time
    { wch: 20 }   // Updated Time
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

  // Prepare data for export
  const exportData = guests.map(guest => ({
    'ID': guest.id || '',
    'Full Name': guest.first_name && guest.last_name 
      ? `${guest.first_name} ${guest.last_name}`.trim()
      : guest.name || '',
    'First Name': guest.first_name || '',
    'Last Name': guest.last_name || '',
    'Email': guest.email || '',
    'Phone': guest.phone || '',
    'Address': guest.address || '',
    'Created Date': guest.created_at ? new Date(guest.created_at).toLocaleDateString() : '',
    'Updated Date': guest.updated_at ? new Date(guest.updated_at).toLocaleDateString() : '',
    'Created Time': guest.created_at ? new Date(guest.created_at).toLocaleString() : '',
    'Updated Time': guest.updated_at ? new Date(guest.updated_at).toLocaleString() : ''
  }))

  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Add filter info sheet
  const filterWs = XLSX.utils.json_to_sheet([filterInfo])
  XLSX.utils.book_append_sheet(wb, filterWs, 'Export Info')

  // Add main data sheet
  const ws = XLSX.utils.json_to_sheet(exportData)
  
  // Set column widths
  const colWidths = [
    { wch: 8 },   // ID
    { wch: 20 },  // Full Name
    { wch: 15 },  // First Name
    { wch: 15 },  // Last Name
    { wch: 25 },  // Email
    { wch: 15 },  // Phone
    { wch: 30 },  // Address
    { wch: 12 },  // Created Date
    { wch: 12 },  // Updated Date
    { wch: 20 },  // Created Time
    { wch: 20 }   // Updated Time
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
