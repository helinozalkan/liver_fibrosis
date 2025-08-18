# FİBROCHECK

**Karaciğer Fibrozisinin Evrelerini Non-Invaziv Yöntemlerle Tahmin Eden Yapay Zeka Tabanlı Sistem**

## Proje Özeti

FibroCheck, karaciğer fibrozisinin evrelerini (**F0-F4**) non-invaziv yöntemlerle tahmin etmeyi amaçlayan iki modüllü yapay zeka tabanlı bir karar destek sistemidir.

**Neden Önemli?**
Karaciğer biyopsisi, fibrozisin evrelendirilmesinde altın standart olsa da **invaziv, ağrılı ve riskli** bir yöntemdir. FibroCheck, biyopsi ihtiyacını azaltacak, yüksek doğrulukla çalışan bir **alternatif tanı sistemi** sunmaktadır.

## Sistem Mimarisi

FibroCheck iki aşamalı modüler yapıya sahiptir:

1. **Kan Tahlili Analizi (Structured Data)**

   * Model: **Random Forest**
   * Girdi: AST, ALT, Albumin vb. karaciğer fonksiyon testleri
   * Çıktı: Fibrozis evresi için öngörü

2. **Ultrason Görüntü Analizi (Imaging Data)**

   * Model: **CNN (ResNet-50, Transfer Learning)**
   * Girdi: B-mod karaciğer ultrason görüntüleri
   * Çıktı: Görüntü tabanlı evre tahmini (%96.26 doğruluk)

3. **Entegrasyon & Raporlama**

   * Her iki modelin çıktıları birleştirilir.
   * **LLM destekli doğal dil yorumlayıcı** aracılığıyla detaylı medikal rapor oluşturulur.
   * Rapor: Türkçe & İngilizce dil seçenekleri

## Web Arayüzü

FibroCheck, kullanıcı dostu **web tabanlı bir arayüze** sahiptir:

* **Ultrason görüntüsü yükleme alanı**
* **Kan tahlili giriş alanları** (manuel veya otomatik doldurma)
* **Grafiksel & istatistiksel analizler**
* **Doktor için özelleşmiş kişisel Doktor Paneli**
* **Not ekleme ve kişiselleştirme**
* **Chatbot desteği**
* **Yardım alanı**

## Özellikler

* Non-invaziv tanı yöntemi → biyopsi ihtiyacını azaltır
* Kan ve görüntü verilerini birlikte analiz eder
* %96’ya varan yüksek doğruluk
* LLM destekli doğal dil raporlama (TR/EN)
* Klinik karar destek sistemlerine entegre edilebilir
* Hızlı, pratik ve kullanıcı dostu arayüz

## Model Performansı

* **ResNet-50 (Ultrason verileri):** %96.26 doğruluk
* **Random Forest (Kan verileri):** Yüksek doğruluk ve F1 skoru
* **Değerlendirme Metrikleri:** Accuracy, F1-score, ROC-AUC

## Proje Katkıları

* Yeni bir **biyopsi alternatifi** sunulmuştur.
* Hem **kan verileri** hem de **ultrason görüntüleri** entegre edilmiştir.
* Klinik uygulamalarda kullanılabilecek **karar destek mekanizması** geliştirilmiştir.
* Çok dilli (TR/EN) raporlama ile uluslararası kullanım desteği sağlanmıştır.

## Anahtar Kelimeler
`Fibrozis` • `Karaciğer Hastalığı` • `Yapay Zeka` • `CNN` • `ResNet-50` • `Random Forest` • `Ultrason` • `Kan Tahlili` • `Evre Tahmini` • `Biyopsi Alternatifi`

---

## Proje sahipleri: 
* **Helin ÖZALKAN**
* **Sümeyye AĞIR**
* **Kevser SEMİZ**
* **Büşra İNAN**
* **Devran ŞAHİN**
* **Ege KUZU**
* **Erva ERGÜL**
* **Cengizhan KARAMAN**
* **Kerem GÜNEY**
* **Enes Can ÇOBAN**

##Geliştirilme amacı: 
**Klinik karar destek sistemlerine entegre edilebilir, non-invaziv fibrozis evre tahmini**
