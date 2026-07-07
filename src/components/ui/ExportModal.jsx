// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - EXPORT MODAL
// Export and report generation interface
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  FileText,
  Download,
  Camera,
  Table,
  FileJson,
  Loader2,
  CheckCircle,
  Shield,
  Brain,
  Activity,
  FlaskConical,
  Zap
} from 'lucide-react'
import { toast } from './Toast'
import exportService from '../../services/exportService'

// Report types
const reportTypes = [
  {
    id: 'system',
    icon: Activity,
    title: 'System Report',
    description: 'Full system status and metrics overview',
    color: 'arc'
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Security Report',
    description: 'Security status, threats, and access logs',
    color: 'red'
  },
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Activity Report',
    description: 'J.A.R.V.I.S neural network statistics',
    color: 'cyan'
  },
  {
    id: 'projects',
    icon: FlaskConical,
    title: 'R&D Projects Report',
    description: 'Active projects and progress summary',
    color: 'purple'
  }
]

export default function ExportModal({ isOpen, onClose, data = {} }) {
  const [selectedReport, setSelectedReport] = useState('system')
  const [exportFormat, setExportFormat] = useState('pdf')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      let filename
      
      switch (exportFormat) {
        case 'pdf':
          filename = await exportService.generatePDF(selectedReport, data)
          toast.success('PDF Generated', `Report saved as ${filename}`)
          break
        case 'csv':
          filename = exportService.exportToCSV(data.tableData || [], selectedReport)
          toast.success('CSV Exported', `Data saved as ${filename}`)
          break
        case 'json':
          filename = exportService.exportToJSON(data, selectedReport)
          toast.success('JSON Exported', `Data saved as ${filename}`)
          break
        case 'screenshot':
          const success = await exportService.captureScreenshot(null, 'dashboard')
          if (success) {
            toast.success('Screenshot Captured', 'Dashboard image saved')
          } else {
            toast.error('Screenshot Failed', 'Could not capture screen')
          }
          break
        default:
          break
      }
      
      onClose()
    } catch (error) {
      console.error('[Export] Error:', error)
      toast.error('Export Failed', error.message || 'An error occurred')
    } finally {
      setIsExporting(false)
    }
  }

  const colorClasses = {
    arc: 'bg-arc-500/20 text-arc-400 border-arc-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="
              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-full max-w-2xl max-h-[90vh]
              bg-stark-dark/95 backdrop-blur-xl
              border border-arc-500/30
              rounded-xl shadow-2xl
              overflow-hidden
              z-[9999]
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-arc-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-arc-500/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-arc-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Export & Reports</h2>
                  <p className="text-xs text-white/50">Generate reports and export data</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {/* Report Type Selection */}
              <div>
                <h3 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">
                  Select Report Type
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {reportTypes.map((report) => {
                    const isSelected = selectedReport === report.id
                    const Icon = report.icon
                    
                    return (
                      <motion.button
                        key={report.id}
                        onClick={() => setSelectedReport(report.id)}
                        className={`
                          p-4 rounded-lg border text-left transition-all
                          ${isSelected
                            ? colorClasses[report.color]
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <Icon size={20} className={isSelected ? '' : 'text-white/50'} />
                          <div>
                            <p className={`text-sm font-medium ${isSelected ? '' : 'text-white/80'}`}>
                              {report.title}
                            </p>
                            <p className={`text-xs mt-1 ${isSelected ? 'opacity-70' : 'text-white/40'}`}>
                              {report.description}
                            </p>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle size={16} />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Export Format */}
              <div>
                <h3 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">
                  Export Format
                </h3>
                
                <div className="flex gap-3">
                  {[
                    { id: 'pdf', icon: FileText, label: 'PDF Report' },
                    { id: 'csv', icon: Table, label: 'CSV Data' },
                    { id: 'json', icon: FileJson, label: 'JSON Export' },
                    { id: 'screenshot', icon: Camera, label: 'Screenshot' }
                  ].map((format) => {
                    const isSelected = exportFormat === format.id
                    const Icon = format.icon
                    
                    return (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id)}
                        className={`
                          flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition-all
                          ${isSelected
                            ? 'bg-arc-500/20 border-arc-500/30 text-arc-400'
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                          }
                        `}
                      >
                        <Icon size={24} />
                        <span className="text-xs font-medium">{format.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preview Info */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-arc-500" />
                  <span className="text-xs text-white/60">Export Preview</span>
                </div>
                <p className="text-sm text-white/80">
                  {exportFormat === 'pdf' && `Generate a professional ${reportTypes.find(r => r.id === selectedReport)?.title || 'report'} in PDF format with Stark Industries branding.`}
                  {exportFormat === 'csv' && 'Export raw data in CSV format, compatible with Excel and other spreadsheet applications.'}
                  {exportFormat === 'json' && 'Export structured data in JSON format for integration with other systems.'}
                  {exportFormat === 'screenshot' && 'Capture the current dashboard view as a high-resolution PNG image.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-arc-500/20 bg-white/5">
              <p className="text-xs text-white/40">
                Files will be downloaded automatically
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                
                <motion.button
                  onClick={handleExport}
                  disabled={isExporting}
                  className={`
                    flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                    ${isExporting
                      ? 'bg-arc-500/50 text-white/50 cursor-wait'
                      : 'bg-arc-500 text-white hover:bg-arc-400'
                    }
                  `}
                  whileHover={!isExporting ? { scale: 1.02 } : {}}
                  whileTap={!isExporting ? { scale: 0.98 } : {}}
                >
                  {isExporting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Export Now
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}