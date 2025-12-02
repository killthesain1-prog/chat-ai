import { useState } from 'react';
import { processOcr, OcrResult } from '@/lib/ocrApi';

/**
 * Example 1: Basic OCR Processing
 */
export async function basicOcrExample(file: File) {
    try {
        const result = await processOcr(file);
        console.log('Extracted text:', result.text);
        console.log('Processed image:', result.image);
        return result;
    } catch (error) {
        console.error('OCR failed:', error);
        throw error;
    }
}

/**
 * Example 2: React Component with OCR
 */
export function OcrUploadComponent() {
    const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const result = await processOcr(file);
            setOcrResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process file');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            {isProcessing && <p>Processing...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {ocrResult && (
                <div>
                    <h3>OCR Results</h3>
                    <div>
                        <h4>Extracted Text:</h4>
                        <pre>{ocrResult.text}</pre>
                    </div>
                    {ocrResult.image && (
                        <div>
                            <h4>Processed Image:</h4>
                            <img src={ocrResult.image} alt="Processed" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Example 3: Search in OCR Text
 */
export function searchInOcrText(ocrText: string, query: string): boolean {
    return ocrText.toLowerCase().includes(query.toLowerCase());
}

/**
 * Example 4: Export OCR Text
 */
export function exportOcrText(text: string, filename: string = 'ocr-result.txt') {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Example 5: Display OCR Image
 */
export function OcrImageDisplay({ imageData }: { imageData: string }) {
    // Handle both base64 and URL formats
    const isBase64 = imageData.startsWith('data:');
    const imageUrl = isBase64 ? imageData : `data:image/png;base64,${imageData}`;

    return (
        <div>
            <img
                src={imageUrl}
                alt="OCR Processed"
                style={{ maxWidth: '100%', height: 'auto' }}
            />
        </div>
    );
}

/**
 * Example 6: Batch Processing Multiple Files
 */
export async function batchProcessOcr(files: File[]): Promise<OcrResult[]> {
    const results: OcrResult[] = [];

    for (const file of files) {
        try {
            const result = await processOcr(file);
            results.push(result);
        } catch (error) {
            console.error(`Failed to process ${file.name}:`, error);
            // Continue with next file
        }
    }

    return results;
}

/**
 * Example 7: Store OCR Results in LocalStorage
 */
export function storeOcrResult(fileId: string, result: OcrResult) {
    const key = `ocr_${fileId}`;
    localStorage.setItem(key, JSON.stringify(result));
}

export function getStoredOcrResult(fileId: string): OcrResult | null {
    const key = `ocr_${fileId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
}

/**
 * Example 8: Word Count from OCR Text
 */
export function getWordCount(text: string): number {
    return text.trim().split(/\s+/).length;
}

/**
 * Example 9: Highlight Text in OCR Results
 */
export function highlightText(text: string, searchTerm: string): string {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Example 10: Copy OCR Text to Clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard');
    } catch (error) {
        console.error('Failed to copy text:', error);
        throw error;
    }
}
