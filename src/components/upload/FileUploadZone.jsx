import React, { useRef } from 'react'
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Camera, 
  Smartphone,
  Cloud
} from "lucide-react"
import Button from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

const FileUploadZone = ({ onFileSelect, dragActive, setDragActive }) => {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
      <CardContent className="p-0">
        <div className={`transition-all duration-300 ${
          dragActive ? "bg-gradient-to-br from-primary-50 to-primary-100" : "bg-white"
        }`}>
          <div className="p-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    dragActive 
                      ? "bg-gradient-to-br from-primary-400 to-primary-500" 
                      : "bg-gradient-to-br from-slate-100 to-slate-200"
                  }`}
                >
                  <Cloud className={`w-10 h-10 ${
                    dragActive ? "text-white" : "text-slate-500"
                  }`} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Upload Your Invoice
                </h2>
                <p className="text-lg text-slate-600">
                  Drag & drop files here, or choose an upload method
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragActive 
                      ? "border-primary-400 bg-primary-50/50" 
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                  onClick={handleBrowseClick}
                >
                  <input
                    ref__={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={onFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Browse Files
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Select PDF or image files from your device
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                <div
                  className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:bg-slate-50/50"
                  onClick={handleCameraClick}
                >
                  <input
                    ref__={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={onFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                    {isMobile ? (
                      <Smartphone className="w-8 h-8 text-purple-600" />
                    ) : (
                      <Camera className="w-8 h-8 text-purple-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {isMobile ? "Use Camera" : "Take Photo"}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Capture your invoice with your camera
                  </p>
                  <Button variant="outline">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  Supported formats: PDF, PNG, JPEG • Max file size: 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FileUploadZone