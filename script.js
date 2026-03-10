document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
function summarizeText(){
    const inputText = document.getElementById('inputText').value;
    if (!inputText.trim()){
        alert('الرجاء إدخال نص أولاً')
        return;
    }
    const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
    if (sentences.length <= 3){
        document.getElementById('output').innerHTML = inputText;
        return;
    }
    let summary = '';
    summary += sentences[0].trim() + '';
    if (sentences.length > 1){
        summary += sentences[1].trim() + '';
    }
    if (sentences.length > 3){
        summary += '... ';
    }
    summary += sentences[sentences.length - 1].trim();
    document.getElementById('output').innerHTML = summary;
}
function copyToClipboard(){
    const outputText = document.getElementById('output').innerHTML;
    if (!outputText){
        alert('لا يوجد نص لنسخه');
        return;
    }
    const textToCopy = outputText.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('تم نسخ النص بنجاح!');
    }).catch(err => {
        alert('فشل النشخ، جرب يدوياً')
    });
}
function advancedSummarize(text, sentenceCount = 3){
    return text;
}