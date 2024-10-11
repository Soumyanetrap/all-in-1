import { useCallback } from 'react';

const useFileOpener = (existingFiles) => {
    return useCallback(async (fileId, fileExtension) => {
        try {
            const file = existingFiles.find(f => f.doc_id === fileId);

            if (file && file.content) {
                const base64Data = file.content;
                const mimeType = fileExtension === 'pdf' ? 'application/pdf' :
                                fileExtension === 'png' ? 'image/png' :
                                fileExtension === 'jpeg' || fileExtension === 'jpg' ? 'image/jpeg' :
                                'application/octet-stream';

                if (fileExtension === 'pdf') {
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: mimeType });

                    const url = URL.createObjectURL(blob);
                    const newTab = window.open();
                    newTab.location.href = url;

                    newTab.onload = () => URL.revokeObjectURL(url);
                } else {
                    const dataUri = `data:${mimeType};base64,${base64Data}`;
                    const newTab = window.open();
                    newTab.document.open();
                    newTab.document.write(`
                        <html>
                            <head>
                                <style>
                                    body {
                                        margin: 0;
                                        padding: 0;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        background-color: #f0f0f0;
                                        overflow: hidden;
                                    }
                                    img {
                                        max-width: 100%;
                                        max-height: 100%;
                                        display: block;
                                        margin: auto;
                                        object-fit: contain;
                                    }
                                </style>
                            </head>
                            <body>
                                <img src="${dataUri}" />
                            </body>
                        </html>
                    `);
                    newTab.document.close();
                }
            }
        } catch (error) {
            console.error('Error opening file:', error);
        }
    }, [existingFiles]);
};

export default useFileOpener;
