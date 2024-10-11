const useFileHandler = (fileNames, setAttachments, setFileNames, setError) => {
    const trimExtension = (filename) => {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
        const validFiles = [];
        const invalidFiles = [];

        files.forEach(file => {
            if (allowedTypes.includes(file.type)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            setError('Some files were not added because they are not in PNG, JPEG, JPG, or PDF format.');
        } else {
            setError('');
        }

        setAttachments(prevAttachments => [
            ...prevAttachments, 
            ...validFiles
        ]);

        setFileNames(prevFileNames => [
            ...prevFileNames, 
            ...validFiles.map(file => trimExtension(file.name))
        ]);
    };

    const handleFileNameChange = (index, event) => {
        const newFileNames = [...fileNames];
        newFileNames[index] = event.target.value;
        setFileNames(newFileNames);
    };

    const handleFileRemove = (index) => {
        setAttachments(prevAttachments => 
            prevAttachments.filter((_, i) => i !== index)
        );
        setFileNames(prevFileNames => 
            prevFileNames.filter((_, i) => i !== index)
        );
    };

    return {
        trimExtension, // Return trimExtension
        handleFileChange,
        handleFileNameChange,
        handleFileRemove,
    };
};

export default useFileHandler;
