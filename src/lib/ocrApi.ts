// OCR API Configuration
const OCR_API_BASE_URL = 'https://5d669f67b422.ngrok-free.app';

export interface OcrResult {
    text: string;
    image: string;
}

export interface OcrOptions {
    modelSize?: 'Tiny' | 'Small' | 'Base' | 'Large' | 'Gundam (Recommended)';
    taskType?: '📝 Free OCR' | '📄 Convert to Markdown' | '📈 Parse Figure' | '🔍 Locate Object by Reference';
    refText?: string;
}

/**
 * Process a PDF file using the OCR API
 * @param file - The PDF file to process
 * @param options - Optional parameters for OCR processing
 * @returns Promise with OCR result containing text and image
 */
export async function processOcr(file: File, options?: OcrOptions): Promise<OcrResult> {
    const formData = new FormData();
    formData.append('file', file);

    // Add optional parameters
    if (options?.modelSize) {
        formData.append('model_size', options.modelSize);
    }
    if (options?.taskType) {
        formData.append('task_type', options.taskType);
    }
    if (options?.refText) {
        formData.append('ref_text', options.refText);
    }

    try {
        const response = await fetch(`${OCR_API_BASE_URL}/ocr`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OCR API error (${response.status}): ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error(
                `Cannot connect to OCR API at ${OCR_API_BASE_URL}. ` +
                `Please check: 1) API is running, 2) CORS is enabled, 3) URL is correct`
            );
        }
        throw error;
    }
}
