// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - EXPORT SERVICE
// PDF, CSV, and Screenshot generation
// ═══════════════════════════════════════════════════════════════════════════

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

class ExportService {
  constructor() {
    this.companyName = 'STARK INDUSTRIES'
    this.systemName = 'SI-OS v1.0.0'
    this.classification = 'CONFIDENTIAL'
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PDF GENERATION
  // ═════════════════════════════════════════════════════════════════════════

  async generatePDF(reportType, data) {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    // Header
    yPos = this.addHeader(pdf, pageWidth, yPos, margin)

    // Report Title
    pdf.setFontSize(18)
    pdf.setTextColor(0, 150, 200)
    pdf.text(this.getReportTitle(reportType), margin, yPos)
    yPos += 10

    // Timestamp
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos)
    yPos += 15

    // Content based on report type
    switch (reportType) {
      case 'system':
        yPos = this.addSystemReport(pdf, data, margin, yPos, pageWidth)
        break
      case 'security':
        yPos = this.addSecurityReport(pdf, data, margin, yPos, pageWidth)
        break
      case 'ai':
        yPos = this.addAIReport(pdf, data, margin, yPos, pageWidth)
        break
      case 'projects':
        yPos = this.addProjectsReport(pdf, data, margin, yPos, pageWidth)
        break
      default:
        yPos = this.addGenericReport(pdf, data, margin, yPos, pageWidth)
    }

    // Footer
    this.addFooter(pdf, pageWidth, pageHeight, margin)

    // Save
    const fileName = `stark-industries-${reportType}-report-${Date.now()}.pdf`
    pdf.save(fileName)
    
    return fileName
  }

  addHeader(pdf, pageWidth, yPos, margin) {
    // Background bar
    pdf.setFillColor(10, 10, 15)
    pdf.rect(0, 0, pageWidth, 35, 'F')

    // Company name
    pdf.setFontSize(20)
    pdf.setTextColor(0, 212, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.text(this.companyName, margin, 15)

    // System name
    pdf.setFontSize(10)
    pdf.setTextColor(150, 150, 150)
    pdf.setFont('helvetica', 'normal')
    pdf.text(this.systemName, margin, 23)

    // Classification
    pdf.setFontSize(8)
    pdf.setTextColor(255, 100, 100)
    pdf.text(this.classification, pageWidth - margin - 30, 15)

    // Arc reactor symbol (simple circle)
    pdf.setDrawColor(0, 212, 255)
    pdf.setLineWidth(0.5)
    pdf.circle(pageWidth - margin - 10, 17, 8)
    pdf.circle(pageWidth - margin - 10, 17, 5)
    pdf.circle(pageWidth - margin - 10, 17, 2)

    return 45
  }

  addFooter(pdf, pageWidth, pageHeight, margin) {
    const footerY = pageHeight - 15

    pdf.setDrawColor(0, 212, 255)
    pdf.setLineWidth(0.3)
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5)

    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    pdf.text('© Stark Industries - All Rights Reserved', margin, footerY)
    pdf.text('J.A.R.V.I.S Generated Report', pageWidth - margin - 50, footerY)
  }

  getReportTitle(type) {
    const titles = {
      system: 'SYSTEM STATUS REPORT',
      security: 'SECURITY ANALYSIS REPORT',
      ai: 'AI CORE ACTIVITY REPORT',
      projects: 'R&D PROJECTS REPORT',
      default: 'GENERAL REPORT'
    }
    return titles[type] || titles.default
  }

  addSystemReport(pdf, data, margin, yPos, pageWidth) {
    // Section: System Overview
    yPos = this.addSection(pdf, 'SYSTEM OVERVIEW', margin, yPos)

    const metrics = data?.metrics || {
      cpu: 45,
      memory: 62,
      network: 88,
      uptime: '720 hours'
    }

    const systemData = [
      ['CPU Usage', `${metrics.cpu}%`],
      ['Memory Usage', `${metrics.memory}%`],
      ['Network Status', `${metrics.network}%`],
      ['System Uptime', metrics.uptime],
      ['Status', 'OPERATIONAL']
    ]

    yPos = this.addTable(pdf, systemData, margin, yPos, pageWidth)
    yPos += 10

    // Section: Active Modules
    yPos = this.addSection(pdf, 'ACTIVE MODULES', margin, yPos)

    const modules = [
      ['Dashboard', 'Active', 'Primary control interface'],
      ['AI Core', 'Active', 'J.A.R.V.I.S neural network'],
      ['Security', 'Active', 'Threat monitoring enabled'],
      ['Data Hub', 'Active', 'Analytics processing'],
      ['R&D Lab', 'Active', '6 active projects']
    ]

    yPos = this.addTable(pdf, modules, margin, yPos, pageWidth, ['Module', 'Status', 'Description'])

    return yPos
  }

  addSecurityReport(pdf, data, margin, yPos, pageWidth) {
    yPos = this.addSection(pdf, 'SECURITY STATUS', margin, yPos)

    const securityData = [
      ['Threat Level', data?.threatLevel || 'LOW'],
      ['Firewall Status', 'ACTIVE'],
      ['Encryption', 'AES-256'],
      ['Last Scan', new Date().toLocaleString()],
      ['Threats Blocked (24h)', data?.blockedThreats || '47']
    ]

    yPos = this.addTable(pdf, securityData, margin, yPos, pageWidth)
    yPos += 10

    yPos = this.addSection(pdf, 'RECENT SECURITY EVENTS', margin, yPos)

    const events = data?.events || [
      ['14:32:18', 'Authentication successful', 'Tony Stark'],
      ['14:31:45', 'Biometric scan verified', 'System'],
      ['14:30:22', 'Access denied - Invalid credentials', 'Unknown'],
      ['14:29:55', 'Security protocol updated', 'J.A.R.V.I.S']
    ]

    yPos = this.addTable(pdf, events, margin, yPos, pageWidth, ['Time', 'Event', 'User'])

    return yPos
  }

  addAIReport(pdf, data, margin, yPos, pageWidth) {
    yPos = this.addSection(pdf, 'J.A.R.V.I.S STATUS', margin, yPos)

    const aiData = [
      ['Neural Load', `${data?.neuralLoad || 45}%`],
      ['Memory Allocation', '2.4 GB'],
      ['Response Time', '23ms'],
      ['Queries Today', data?.queriesCount || '1,247'],
      ['Accuracy Rate', '99.7%']
    ]

    yPos = this.addTable(pdf, aiData, margin, yPos, pageWidth)
    yPos += 10

    yPos = this.addSection(pdf, 'AI CAPABILITIES', margin, yPos)

    const capabilities = [
      ['Natural Language', '98%', 'Active'],
      ['Code Analysis', '95%', 'Active'],
      ['Data Analysis', '92%', 'Active'],
      ['Voice Interface', '95%', 'Active'],
      ['Creative Tasks', '85%', 'Active']
    ]

    yPos = this.addTable(pdf, capabilities, margin, yPos, pageWidth, ['Capability', 'Level', 'Status'])

    return yPos
  }

  addProjectsReport(pdf, data, margin, yPos, pageWidth) {
    yPos = this.addSection(pdf, 'ACTIVE R&D PROJECTS', margin, yPos)

    const projects = data?.projects || [
      ['Mark LXXXV', '95%', 'On Track', 'Final testing phase'],
      ['Hulkbuster 2.0', '78%', 'On Track', 'Structural assembly'],
      ['Arc Reactor v4', '88%', 'On Track', 'Energy optimization'],
      ['Nanotech Suite', '92%', 'Complete', 'Ready for deployment'],
      ['EDITH System', '65%', 'Delayed', 'AI integration pending'],
      ['Project Jericho', '42%', 'On Track', 'Initial development']
    ]

    yPos = this.addTable(pdf, projects, margin, yPos, pageWidth, ['Project', 'Progress', 'Status', 'Notes'])

    return yPos
  }

  addGenericReport(pdf, data, margin, yPos, pageWidth) {
    yPos = this.addSection(pdf, 'REPORT DATA', margin, yPos)

    if (typeof data === 'object') {
      const entries = Object.entries(data).map(([key, value]) => [key, String(value)])
      yPos = this.addTable(pdf, entries, margin, yPos, pageWidth)
    } else {
      pdf.setFontSize(10)
      pdf.setTextColor(50, 50, 50)
      pdf.text(String(data || 'No data available'), margin, yPos)
    }

    return yPos
  }

  addSection(pdf, title, margin, yPos) {
    pdf.setFontSize(12)
    pdf.setTextColor(0, 150, 200)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, margin, yPos)
    
    pdf.setDrawColor(0, 212, 255)
    pdf.setLineWidth(0.5)
    pdf.line(margin, yPos + 2, margin + 60, yPos + 2)

    return yPos + 10
  }

  addTable(pdf, rows, margin, yPos, pageWidth, headers = null) {
    const colWidth = (pageWidth - margin * 2) / (rows[0]?.length || 2)
    const rowHeight = 8

    // Headers
    if (headers) {
      pdf.setFillColor(20, 20, 30)
      pdf.rect(margin, yPos - 5, pageWidth - margin * 2, rowHeight, 'F')
      
      pdf.setFontSize(9)
      pdf.setTextColor(0, 212, 255)
      pdf.setFont('helvetica', 'bold')
      
      headers.forEach((header, i) => {
        pdf.text(header, margin + i * colWidth + 2, yPos)
      })
      
      yPos += rowHeight
    }

    // Rows
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    
    rows.forEach((row, rowIndex) => {
      // Alternate row background
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(245, 245, 250)
        pdf.rect(margin, yPos - 5, pageWidth - margin * 2, rowHeight, 'F')
      }

      pdf.setTextColor(50, 50, 50)
      row.forEach((cell, colIndex) => {
        const text = String(cell).substring(0, 30) // Truncate long text
        pdf.text(text, margin + colIndex * colWidth + 2, yPos)
      })
      
      yPos += rowHeight
    })

    return yPos
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CSV EXPORT
  // ═════════════════════════════════════════════════════════════════════════

  exportToCSV(data, filename = 'export') {
    let csvContent = ''

    if (Array.isArray(data)) {
      // If array of objects
      if (data.length > 0 && typeof data[0] === 'object') {
        const headers = Object.keys(data[0])
        csvContent += headers.join(',') + '\n'
        
        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header]
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          csvContent += values.join(',') + '\n'
        })
      } else {
        // Simple array
        csvContent = data.join('\n')
      }
    } else if (typeof data === 'object') {
      // Single object
      const headers = Object.keys(data)
      csvContent = headers.join(',') + '\n'
      csvContent += headers.map(h => data[h]).join(',') + '\n'
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const finalFilename = `stark-industries-${filename}-${Date.now()}.csv`
    saveAs(blob, finalFilename)
    
    return finalFilename
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SCREENSHOT
  // ═════════════════════════════════════════════════════════════════════════

  async captureScreenshot(elementId = null, filename = 'screenshot') {
    try {
      const element = elementId 
        ? document.getElementById(elementId) 
        : document.body

      if (!element) {
        throw new Error('Element not found')
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        logging: false,
        useCORS: true
      })

      canvas.toBlob((blob) => {
        const finalFilename = `stark-industries-${filename}-${Date.now()}.png`
        saveAs(blob, finalFilename)
      }, 'image/png')

      return true
    } catch (error) {
      console.error('[Export] Screenshot error:', error)
      return false
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // JSON EXPORT
  // ═════════════════════════════════════════════════════════════════════════

  exportToJSON(data, filename = 'data') {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const finalFilename = `stark-industries-${filename}-${Date.now()}.json`
    saveAs(blob, finalFilename)
    
    return finalFilename
  }
}

export const exportService = new ExportService()
export default exportService