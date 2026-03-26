// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const copyBtn = document.getElementById('copyBtn');
    const pdfBtn = document.getElementById('pdfBtn');

    if (summarizeBtn) summarizeBtn.addEventListener('click', summarizeText);
    if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
    if (pdfBtn) pdfBtn.addEventListener('click', generatePDF);
});

// دالة التلخيص الأساسية
function summarizeText() {
    const inputText = document.getElementById('inputText').value;
    
    if (!inputText.trim()) {
        alert('⚠️ الرجاء إدخال نص أولاً');
        return;
    }
    
    const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
    
    let summary = '';
    if (sentences.length <= 3) {
        summary = inputText;
    } else {
        summary = sentences[0].trim() + ' ' + 
                  (sentences[1] ? sentences[1].trim() + ' ' : '') + 
                  '... ' + 
                  sentences[sentences.length - 1].trim();
    }
    
    document.getElementById('output').innerHTML = summary;
    updateWordCount();
}

// دالة نسخ النص
function copyToClipboard() {
    const outputText = document.getElementById('output').innerText;
    
    if (!outputText.trim()) {
        alert('⚠️ لا يوجد نص لنسخه');
        return;
    }
    
    navigator.clipboard.writeText(outputText).then(() => {
        alert('✅ تم نسخ النص بنجاح!');
    }).catch(() => {
        alert('❌ فشل النسخ');
    });
}

// دالة تحديث الإحصائيات
function updateWordCount() {
    const inputText = document.getElementById('inputText').value;
    const outputText = document.getElementById('output').innerText;
    
    const inputWords = inputText.trim() ? inputText.split(/\s+/).length : 0;
    const outputWords = outputText.trim() ? outputText.split(/\s+/).length : 0;
    const reductionPercent = inputWords ? Math.round((1 - outputWords/inputWords) * 100) : 0;
    
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

// ✅ دالة إنشاء PDF باستخدام html2pdf (تدعم العربية بشكل ممتاز)
async function generatePDF() {
    const outputText = document.getElementById('output').innerText.trim();
    
    if (!outputText) {
        alert('⚠️ لا يوجد نص لتصديره. قم بتلخيص نص أولاً.');
        return;
    }

    const pdfButton = document.getElementById('pdfBtn');
    const originalText = pdfButton.innerHTML;
    pdfButton.innerHTML = '⏳ جاري التحضير...';
    pdfButton.disabled = true;

    try {
        // العنصر الذي سنحوله إلى PDF
        const element = document.getElementById('pdf-content');
        
        // إعدادات PDF
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5], // هوامش الصفحة (بالبوصة)
            filename: 'ملخص_النص.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        // تحويل العنصر إلى PDF وحفظه
        await html2pdf().set(opt).from(element).save();
        
        alert('✅ تم إنشاء ملف PDF بنجاح!');
        
    } catch (error) {
        console.error('خطأ في إنشاء PDF:', error);
        alert('❌ حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
        pdfButton.innerHTML = originalText;
        pdfButton.disabled = false;
    }
}