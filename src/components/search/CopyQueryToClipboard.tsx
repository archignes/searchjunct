const CopyQueryToClipboard = async ({ query }: { query: string }) => {
    if (!query) return null;
    try {
        await navigator.clipboard.writeText(query);
        console.log('Query copied to clipboard');
        return true;
    } catch (err) {
        console.error('Could not copy query to clipboard: ', err);
        return false;
    }
};

export default CopyQueryToClipboard;
