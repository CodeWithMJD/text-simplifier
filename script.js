document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

function summarizeText() {
    const inputText = document.getElementById('inputText').value;
    
    if (!inputText.trim()) {
        alert('الرجاء إدخال نص أولاً');
        return;
    }
    
    // إزالة المسافات الزائدة وتقسيم النص إلى جمل
    const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
    
    // إذا كان النص قصيراً، اعرضه كما هو
    if (sentences.length <= 3) {
        document.getElementById('output').innerHTML = inputText;
    } else {
        // استراتيجية التبسيط: نأخذ أول جملتين وآخر جملة
        let summary = '';
        
        // الجملة الأولى
        summary += sentences[0].trim() + ' ';
        
        // الجملة الثانية إذا وجدت
        if (sentences.length > 1) {
            summary += sentences[1].trim() + ' ';
        }
        
        // إذا كان هناك جمل كثيرة، أضف "..."
        if (sentences.length > 3) {
            summary += '... ';
        }
        
        // آخر جملة
        summary += sentences[sentences.length - 1].trim();
        
        document.getElementById('output').innerHTML = summary;
    }
    
    // تحديث الإحصائيات
    updateWordCount();
}

function copyToClipboard() {
    const outputText = document.getElementById('output').innerHTML;
    
    if (!outputText) {
        alert('لا يوجد نص لنسخه');
        return;
    }
    
    // إزالة وسوم HTML إن وجدت
    const textToCopy = outputText.replace(/<[^>]*>/g, '');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('تم نسخ النص بنجاح!');
    }).catch(err => {
        alert('فشل النسخ، جرب يدوياً');
    });
}

// دالة تحديث الإحصائيات
function updateWordCount() {
    const inputText = document.getElementById('inputText').value;
    const outputElement = document.getElementById('output');
    const outputText = outputElement.innerHTML.replace(/<[^>]*>/g, '');
    
    const inputWords = inputText.trim() ? inputText.split(/\s+/).length : 0;
    const outputWords = outputText.trim() ? outputText.split(/\s+/).length : 0;
    
    let reductionPercent = 0;
    if (inputWords > 0) {
        reductionPercent = Math.round((1 - outputWords/inputWords) * 100);
    }
    
    // إنشاء محتوى الإحصائيات
    const statsHTML = `
        <div style="display: flex; gap: 20px; justify-content: space-around; text-align: center; padding: 10px;">
            <div style="background: #e6f7ff; padding: 10px; border-radius: 8px; flex: 1;">
                <strong style="color: #0891b2;">📝 قبل:</strong> ${inputWords} كلمة
            </div>
            <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; flex: 1;">
                <strong style="color: #16a34a;">✨ بعد:</strong> ${outputWords} كلمة
            </div>
            <div style="background: #fff7ed; padding: 10px; border-radius: 8px; flex: 1;">
                <strong style="color: #ea580c;">📊 تبسيط:</strong> ${reductionPercent}%
            </div>
        </div>
    `;
    
    document.getElementById('stats').innerHTML = statsHTML;
}

// تحديث الإحصائيات عند بداية الصفحة (فارغة)
window.onload = function() {
    document.getElementById('stats').innerHTML = '';
};