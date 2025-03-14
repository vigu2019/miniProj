"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, Printer, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocumentViewer({ document }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)

  // For demo purposes, we'll simulate a document with multiple pages
  const totalPages = document.pages

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const zoomIn = () => {
    if (zoom < 2) {
      setZoom(zoom + 0.1)
    }
  }

  const zoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.1)
    }
  }

  const printDocument = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      // Create the print content with only the requested fields
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Job: ${document.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .content {
              margin-top: 30px;
            }
            .page-info {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .meta {
              color: #666;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .field {
              margin-bottom: 15px;
            }
            .field-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .document-preview {
              border: 1px solid #ddd;
              padding: 20px;
              margin-top: 20px;
              background-color: #f9f9f9;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
              .document-preview {
                border: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Print Job: ${document.id}</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="field-label">Print Type:</span> ${document.printType}
            </div>
            <div class="field">
              <span class="field-label">Copies:</span> ${document.copies}
            </div>
            <div class="field">
              <span class="field-label">Customer:</span> ${document.customerName}
            </div>
            <div class="field">
              <span class="field-label">Print Side:</span> ${document.printSide}
            </div>
            <div class="field">
              <span class="field-label">Description:</span> ${document.description}
            </div>
            <div class="field">
              <span class="field-label">Uploaded At:</span> ${new Date(document.submittedAt).toLocaleString()}
            </div>
            <div class="field">
              <span class="field-label">Status:</span> ${document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </div>
            <div class="field">
              <span class="field-label">File:</span> ${document.documentName}
            </div>
            
            <div class="document-preview">
              <h3>Document Preview - Page ${currentPage} of ${totalPages}</h3>
              <p>This is a preview of "${document.documentName}"</p>
              <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
                <p>Document content would appear here in a real implementation.</p>
              </div>
            </div>
          </div>
          <div class="page-info">
            Print Job #${document.id} - Generated on ${new Date().toLocaleString()}
          </div>
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Document
            </button>
          </div>
        </body>
      </html>
    `)

      printWindow.document.close()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={printDocument}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border rounded-lg p-4 flex items-center justify-center bg-gray-50">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            transition: "transform 0.2s ease-in-out",
          }}
          className="bg-white shadow-lg p-8 min-h-[500px] w-full max-w-2xl"
        >
          {/* Simulated document content */}
          <div className="space-y-4">
            <h1 className="text-xl font-bold">{document.documentName}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Print Type</p>
                <p className="text-muted-foreground">{document.printType}</p>
              </div>
              <div>
                <p className="font-medium">Copies</p>
                <p className="text-muted-foreground">{document.copies}</p>
              </div>
              <div>
                <p className="font-medium">Customer</p>
                <p className="text-muted-foreground">{document.customerName}</p>
              </div>
              <div>
                <p className="font-medium">Print Side</p>
                <p className="text-muted-foreground">{document.printSide}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Description</p>
                <p className="text-muted-foreground">{document.description}</p>
              </div>
              <div>
                <p className="font-medium">Uploaded At</p>
                <p className="text-muted-foreground">{new Date(document.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className="text-muted-foreground">
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-200 my-6"></div>

            <p>
              This is a simulated preview of page {currentPage} of {totalPages}.
            </p>

            <div className="mt-8 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}

              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded w-3/4"></div>
              ))}

              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

