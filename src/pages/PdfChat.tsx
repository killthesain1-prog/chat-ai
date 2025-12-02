import { useState, useRef } from "react";
import { Upload, MessageSquare, FileText, Sparkles, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { processOcr } from "@/lib/ocrApi";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UploadedFile {
  id: string;
  name: string;
  file: File;
  uploadDate: string;
  ocrText?: string;
  ocrImage?: string;
}

const PdfChat = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: uploadedFile.name,
        file: uploadedFile,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
      setMessages([]);
      setPageNumber(1);

      // Call OCR API
      setIsLoading(true);
      try {
        const ocrResult = await processOcr(uploadedFile);

        // Update the file object with OCR results
        const updatedFile = {
          ...newFile,
          ocrText: ocrResult.text,
          ocrImage: ocrResult.image
        };

        setFiles(prev => prev.map(f => f.id === newFile.id ? updatedFile : f));
        setSelectedFile(updatedFile);

        // Add OCR result as a system message
        const systemMessage: Message = {
          role: "assistant",
          content: `OCR Processing Complete!\n\nExtracted Text:\n${ocrResult.text || 'No text extracted'}`
        };
        setMessages([systemMessage]);

        console.log('OCR Result stored:', { text: ocrResult.text, image: ocrResult.image });
      } catch (error) {
        console.error('OCR processing failed:', error);
        const errorMessage: Message = {
          role: "assistant",
          content: `Failed to process PDF with OCR: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedFile) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: "I can help you understand this PDF. Please connect Lovable Cloud to enable real AI responses based on the PDF content.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - File List */}
      <div className={cn(
        "border-r border-border bg-muted/30 flex flex-col transition-all duration-300",
        showSidebar ? "w-64" : "w-0"
      )}>
        {showSidebar && (
          <>
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Files ({files.length})</h2>
                </div>
                <Link to="/" className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <Home className="w-4 h-4 text-muted-foreground" />
                </Link>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Add File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={onFileChange}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => {
                    setSelectedFile(file);
                    setMessages([]);
                    setPageNumber(1);
                  }}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-colors border",
                    selectedFile?.id === file.id
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card border-border hover:bg-muted"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.uploadDate}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Center - PDF Viewer */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b border-border px-4 py-3 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {selectedFile ? selectedFile.name : "No PDF loaded"}
                </h2>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg">
                  <button
                    onClick={handleZoomOut}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg">
                  <button
                    onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                    disabled={pageNumber <= 1}
                    className="p-1 hover:bg-background rounded transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                    {pageNumber} / {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                    disabled={pageNumber >= numPages}
                    className="p-1 hover:bg-background rounded transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleRotate}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const url = URL.createObjectURL(selectedFile.file);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = selectedFile.name;
                    a.click();
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/10 flex">
          {selectedFile && numPages > 0 && (
            <div className="w-32 border-r border-border bg-muted/30 overflow-y-auto p-2 space-y-2">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPageNumber(page)}
                  className={cn(
                    "w-full p-1 rounded border transition-all",
                    pageNumber === page
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <Document file={selectedFile.file}>
                    <Page
                      pageNumber={page}
                      width={100}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                  <p className="text-xs text-center text-muted-foreground mt-1">{page}</p>
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            {!selectedFile ? (
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No PDF Selected
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload a PDF file to start analyzing and chatting with your documents
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Upload PDF
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Document
                  file={selectedFile.file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex items-center justify-center"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    className="shadow-lg"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat */}
      <div className="w-[380px] border-l border-border flex flex-col bg-background">
        <div className="border-b border-border p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-semibold text-foreground">AI Inbox</h2>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg">
              Chat
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
              Note (0)
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="space-y-3">
              {selectedFile && (
                <>
                  <div className="text-center text-muted-foreground py-6">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-sm">Ask me anything about this PDF</p>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">REC Note</h3>
                          <p className="text-xs text-muted-foreground">
                            Instantly generate complete notes from your recordings.
                          </p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">Gamify File</h3>
                          <p className="text-xs text-muted-foreground">
                            Generate interactive demos for easier understanding
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {!selectedFile && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload a PDF to start chatting
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-muted rounded-2xl px-4 py-3 border border-border">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={selectedFile ? "Ask about this PDF..." : "Upload a PDF first"}
              disabled={!selectedFile}
              className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !selectedFile || isLoading}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Connect Lovable Cloud for real AI responses
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfChat;
