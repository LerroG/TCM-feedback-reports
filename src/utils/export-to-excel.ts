import * as XLSX from 'xlsx'

export const exportToExcel = (table: any, title: string) => {
	const wb = XLSX.utils.book_new()
	const ws = XLSX.utils.json_to_sheet(table)
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
	XLSX.writeFile(wb, `${title}.xlsx`)
}
