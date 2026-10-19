# KORSUP — Landing Page V3 | SEO / GEO / Social Preview

## أهم الملفات
- `index.html`: الصفحة المعدّلة مع الشعار الحقيقي في الهيدر والفوتر.
- `assets/korsup-wordmark.png`: اللوجو المعتمد (صورة بخلفية شفافة).
- `assets/korsup-mark.png`: العلامة المختصرة K للسوشيال، ومعها favicon وأيقونة iPhone.
- `assets/korsup-share-1200x630.jpg`: صورة Open Graph / WhatsApp / Facebook (1200×630).
- `robots.txt` و`sitemap.xml`: لتهيئة الزحف والفهرسة.
- `llms.txt`: ملخص اختياري قابل للقراءة للأنظمة التي تدعمه، دون ضمان استخدامه.
- `site.webmanifest`: اسم وأيقونة الموقع على الهاتف.

## طريقة النشر
1. ارفع **محتويات هذا المجلد** إلى الجذر الذي يخدم `https://korsup.shop/`، بما فيها `assets` و`robots.txt` و`sitemap.xml`.
2. الدومين الموجود في canonical وOpen Graph وTwitter وSchema وsitemap هو **https://korsup.shop/** حسب الدومين السابق للمشروع. إذا كان الدومين النهائي مختلفًا، غيّر كل ظهور لهذا العنوان في الملفات قبل النشر.
3. تأكد من عمل DNS وHTTPS ووصول الزوار إلى الصفحة وصورة `https://korsup.shop/assets/korsup-share-1200x630.jpg` بدون تسجيل دخول أو 403/404. تعذّر التحقق من إتاحة الدومين أثناء التجهيز.
4. بعد الرفع انشر الرابط في واتساب واختبر معاينة المشاركة. قد يحتفظ واتساب بالمعاينة القديمة مؤقتًا. ويمكن إعادة فحصها عبر Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/ .
5. سجّل الدومين في Google Search Console وأرسل `https://korsup.shop/sitemap.xml`، ثم اختبر باستخدام Rich Results Test: https://search.google.com/test/rich-results .
6. أضف رابط الدفع الحقيقي إلى `CONFIG.checkoutUrl` أو رقم واتساب إلى `CONFIG.whatsapp` فقط عند تجهيز التفعيل.
7. السعر 499 جنيه ما زال افتراضيًا، ومدة الوصول والتسليم لم تُعتمد بعد؛ لا تُعلن مدة وصول أو خصمًا أو شهادات لم يُتفق عليها.

## ما الذي أُضيف إلى SEO / GEO؟
- Title وMeta Description عربيان واضحان يعكسان تخصصات المكتبة.
- Canonical وOpen Graph شامل صورة مطلقة URL وTwitter Card وبيانات اللغة ar_EG.
- JSON-LD لـOrganization وWebSite وWebPage وProduct وFAQPage بناءً على النصوص الموجودة في الصفحة.
- بيانات المنتج لا تتضمن تقييمات مختلقة أو ضمان أرباح أو عرض سعر رسمي/AvailableOffer قبل تفعيل البيع.
- robots.txt وsitemap.xml وملخص llms.txt، مع الحفاظ على المحتوى المرئي والفهرس التفاعلي.

## حدود العمل
- ضبط الملفات محليًا لا يعني ضمان ظهور النتائج أو معاينات المشاركة؛ ذلك يعتمد على نشر الموقع، زحف محركات البحث، DNS والصلاحيات.
- Google حاليًا يُطبق أساسيات SEO على AI Overviews وAI Mode، ولا توجد علامة خاصة تضمن الظهور في إجابات الذكاء الاصطناعي.
- نسخة HTML مستقلة باسم `KORSUP_Landing_Page_SEO_GEO.html` مصممة للمعاينة المحلية، لكن **النشر الإنتاجي يفضّل حزمة ZIP** لأن ملف Open Graph الحقيقي يعتمد على URL عام.
