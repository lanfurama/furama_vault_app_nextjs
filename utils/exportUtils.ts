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
}

export const exportToExcel = (guests: Guest[], filename: string = 'guests_export') => {
  // Prepare data for export
  const exportData = guests.map(guest => ({
    'Guest ID': guest.guest_id || '',
    'Guest Number': guest.guest_number || '',
    'Title': guest.title || '',
    'Full Name': guest.first_name && guest.last_name 
      ? `${guest.first_name} ${guest.last_name}`.trim()
      : guest.first_name || '',
    'First Name': guest.first_name || '',
    'Last Name': guest.last_name || '',
    'Email': guest.email || '',
    'Phone': guest.phone || '',
    'Guest Type': guest.guest_type || '',
    'VIP Status': guest.vip_status || '',
    'Guest Status': guest.guest_status || '',
    'Loyalty Points': guest.loyalty_points || 0,
    'Loyalty Tier': guest.loyalty_tier || '',
    'Created Date': guest.created_date ? new Date(guest.created_date).toLocaleDateString() : '',
    'Created Time': guest.created_date ? new Date(guest.created_date).toLocaleString() : ''
  }))

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)

  // Set column widths
  const colWidths = [
    { wch: 10 },  // Guest ID
    { wch: 15 },  // Guest Number
    { wch: 8 },   // Title
    { wch: 20 },  // Full Name
    { wch: 15 },  // First Name
    { wch: 15 },  // Last Name
    { wch: 25 },  // Email
    { wch: 15 },  // Phone
    { wch: 12 },  // Guest Type
    { wch: 12 },  // VIP Status
    { wch: 12 },  // Guest Status
    { wch: 12 },  // Loyalty Points
    { wch: 12 },  // Loyalty Tier
    { wch: 12 },  // Created Date
    { wch: 20 }   // Created Time
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
    'Guest ID': guest.guest_id || '',
    'Guest Number': guest.guest_number || '',
    'Title': guest.title || '',
    'Full Name': guest.first_name && guest.last_name 
      ? `${guest.first_name} ${guest.last_name}`.trim()
      : guest.first_name || '',
    'First Name': guest.first_name || '',
    'Last Name': guest.last_name || '',
    'Email': guest.email || '',
    'Phone': guest.phone || '',
    'Guest Type': guest.guest_type || '',
    'VIP Status': guest.vip_status || '',
    'Guest Status': guest.guest_status || '',
    'Loyalty Points': guest.loyalty_points || 0,
    'Loyalty Tier': guest.loyalty_tier || '',
    'Created Date': guest.created_date ? new Date(guest.created_date).toLocaleDateString() : '',
    'Created Time': guest.created_date ? new Date(guest.created_date).toLocaleString() : ''
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
    { wch: 10 },  // Guest ID
    { wch: 15 },  // Guest Number
    { wch: 8 },   // Title
    { wch: 20 },  // Full Name
    { wch: 15 },  // First Name
    { wch: 15 },  // Last Name
    { wch: 25 },  // Email
    { wch: 15 },  // Phone
    { wch: 12 },  // Guest Type
    { wch: 12 },  // VIP Status
    { wch: 12 },  // Guest Status
    { wch: 12 },  // Loyalty Points
    { wch: 12 },  // Loyalty Tier
    { wch: 12 },  // Created Date
    { wch: 20 }   // Created Time
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
