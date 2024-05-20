document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('preview-pane');

    // Function to update the preview pane with rendered HTML from Markdown
    const updatePreview = () => {
        const markdownText = input.value;
        const html = marked.parse(markdownText, {
            breaks: true,
            highlight: (code) => {
                return hljs.highlightAuto(code).value;
            }
        });
        preview.innerHTML = html;
    };

    // Update preview as the user types
    input.addEventListener('input', updatePreview);

    // Handle keyboard shortcuts for formatting
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey) {
            switch (event.key) {
                case 'b':
                    event.preventDefault();
                    wrapText('**');
                    break;
                case 'i':
                    event.preventDefault();
                    wrapText('*');
                    break;
                case 'k':
                    event.preventDefault();
                    wrapText('`');
                    break;
            }
        }
    });

    // Function to wrap selected text with specified wrapper
    const wrapText = (wrapper) => {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selectedText = input.value.substring(start, end);
        const wrappedText = wrapper + selectedText + wrapper;
        input.setRangeText(wrappedText, start, end, 'end');
        input.focus();
        updatePreview();
    };

    // Initial preview update
    updatePreview();
});