document.getElementById('removeCommentsButton').addEventListener('click', function() {
    let code = document.getElementById('codeInput').value;
    const language = document.getElementById('languageSelector').value;

    switch(language) {
        case 'c_cpp_java_js_cs':
            code = code.replace(/\/\/.*$/gm, ''); // Remove single-line comments
            code = code.replace(/\/\*[\s\S]*?\*\//gm, ''); // Remove multi-line comments
            break;
        case 'python':
            code = code.replace(/#.*$/gm, ''); // Remove single-line comments
            break;
        case 'html':
            code = code.replace(/<!--[\s\S]*?-->/gm, ''); // Remove comments
            break;
        case 'bash_perl_ruby':
            code = code.replace(/#.*$/gm, ''); // Remove single-line comments
            break;
        default:
            break;
    }

    document.getElementById('codeOutput').value = code.trim();
});
