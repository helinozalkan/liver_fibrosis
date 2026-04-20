# Liver Fibrosis APASL Proje Raporu

## 1. Proje İçeriği ve Genel Bakış
Proje, karaciğer fibrozisi (liver fibrosis) teşhisi ve tahmini için geliştirilmiş yapay zeka destekli tam yığın (full-stack) bir web uygulamasıdır. Backend tarafında **Python (Flask)**, Frontend tarafında ise **React** kullanılarak geliştirilmiştir. Proje temel olarak laboratuvar verileri ve tıbbi ultrason görüntüleri üzerinden hastaların karaciğer fibrozis evresini (F0-F4) tahmin etmeyi amaçlar.

**Temel Özellikler Modüller:**
- **Klinik Tahmin (Makine Öğrenmesi):** Kan değerleri (Bilirubin, ALP, ALT, AST, Albümin vb.) kullanılarak Random Forest modeli ile sonuç tahmini.
- **Görüntü Analizi (Derin Öğrenme):** Ultrason görüntüleri üzerinden Convolutional Neural Network (CNN) modeli kullanımı.
- **Yapay Zeka Destekli Yorumlama (LLM & VLM):** OpenRouter API üzerinden mistral ve gpt-4o modelleriyle laboratuvar sonuçları ve ultrason görüntüleri için uzman sistem gibi klinik açıklamalar sunma.
- **PDF Analizi:** Hastaların kan tahlil PDF dosyalarından (pdfplumber ile) otomatik olarak lab değerleri (AST, ALT, PLT vb.) çıkarma özelliği.
- **Kullanıcı ve Hasta Yönetimi:** Doktor girişi, her doktora özel hasta kayıtları, lab sonuçlarının kaydı, takibi ve PDF formatında otomatik raporlanması.

## 2. Veritabanı Kullanımı
Projede **SQLite** veritabanı (dosya adı: `users.db`) hafif, ilişkisel ve yerel bir çözüm olarak kullanılmaktadır. 
Veritabanındaki temel tablolar şunlardır:
- `users`: Sisteme giriş yapan yetkili doktorların kullanıcı adı ve şifre bilgilerini tutar.
- `patients`: Hastaların demografik bilgilerini (TC, ad, soyad, yaş, cinsiyet) ve tahmin edilen klinik evresini tutar.
- `lab_values`: Hastaların kan tahlil değerlerini ve tarihini geçmişe dönük tutar.
- `doctor_patient`: Doktorlar ile onların ilgilendiği hastalar arasındaki çoktan çoğa ilişkiyi (birleşimi) yönetir.
- `reports`: Hastalar için üretilen yapay zeka analizli detaylı raporları ve tahmin sonuçlarını veritabanında muhafaza eder.

## 3. Kullanılan Modeller ve Sonuçları
Projede klasik makine öğrenmesi, derin öğrenme, üreten görüş (VLM) ve büyük dil modellerinin (LLM) tümü başarılı bir orkestrasyonla bir arada kullanılmaktadır:

### 3.1 Random Forest Sınıflandırıcısı (`rf_model.pkl` & `scaler.pkl`)
- **Türü:** Sklearn Makine Öğrenmesi Modeli.
- **Giriş:** Klinik ve laboratuvar verileri (Total Bilirubin, Direct Bilirubin, ALP, ALT, AST, Albumin, Protein vb.) 
- **Sonuç:** Ölçeklendirici (Scaler) işleminden geçen değerlere dayanarak hastanın klinik fibrozis sonucu (clinic_prediction) üretilir.

### 3.2 Convolutional Neural Network - CNN (`cnn_model.h5`)
- **Türü:** TensorFlow / Keras Derin Öğrenme Görüntü İşleme Modeli.
- **Giriş:** Hasta karaciğer ultrason görüntüsü. (128x128 piksel olarak işlenir)
- **Sonuç:** `'F0', 'F1', 'F2', 'F3', 'F4'` şeklindeki 5 karaciğer fibrozis evresinden birisi ve bu seçime ait olan **Güvenlik Yüzdesi (Confidence %)** değerini üretir.

### 3.3 Görsel Dil Modeli - VLM (`mistral-small-3.2-24b-instruct`)
- **Türü:** OpenRouter API üzerinden çağrılan Üretken Yapay Zeka Vision Modeli.
- **Giriş:** Base64 formatına çevrilmiş ultrason resmi ve prompt text.
- **Sonuç:** Görüntüde algılanabilen anormallikleri, olası fibroz evrelerini ve diğer önemli bulguları anlatan kısa (ortalama 5 cümlelik) klinik yorum üretir.

### 3.4 Büyük Dil Modeli - LLM (`gpt-4o`)
- **Türü:** OpenRouter API üzerinden çağrılan Gelişmiş GPT Modeli.
- **Giriş:** RF klinik sonuçları, CNN görüntü tahmin sonucu (örn: F3) ve hastanın anlık biyokimyasal lab değerlerinin tümü prompt olarak gönderilir.
- **Sonuç:** Hastanın durumuna dair klinik değerlendirme, fibrozisin organ üzerindeki anlamı, hastalığın potansiyel nedenleri, tedavi önerileri ve ilerleyen süreç için tıbbi takip takviminden oluşan son derece **kapsamlı bir metin raporu** üretir.
- *(Not: Aynı GPT-4o modeli, arayüzdeki `/chat` modülü ile hepatolojik danışman olarak hastaların anlık sorularına yanıt vermek için de kullanılır.)*

---

## 4. Projeyi Adım Adım Çalıştırma Rehberi

Uygulamayı lokal ortamınızda ayağa kaldırmak için aşağıdaki adımları izleyin.

### Adım 1: Backend (Flask) Python Sunucusunu Başlatma
1. Command Prompt (CMD) ya da PowerShell gibi bir terminal açıp proje klasörüne gidin:
   ```bash
   cd c:\liver_fibrosis_apasl\liver_fibrosis
   ```
2. Gerekli kütüphaneleri yükleyin (Daha önce kurmadıysanız):
   ```bash
   pip install -r requirements.txt
   ```
3. Uygulamayı çalıştırın:
   ```bash
   python app.py
   ```
4. Veritabanı ve kullanıcılar otomatik yoksa oluşacaktır. Terminalde `Running on http://127.0.0.1:5001` yazdığını gördüğünüzde Backend hazırdır.

### Adım 2: Frontend (React) Arayüzünü Başlatma
Backend çalışmaya devam ederken projede yeni bir terminal sekmesi/penceresi açın.
1. Frontend de aynı dizinde olduğu için tekrardan;
   ```bash
   cd c:\liver_fibrosis_apasl\liver_fibrosis
   ```
2. Gerekli node.js bağımlılıklarını indirin:
   ```bash
   npm install
   ```
   *(Hata alırsanız `npm install --legacy-peer-deps` kullanabilirsiniz)*
3. React geliştirme ortamını başlatın:
   ```bash
   npm start
   ```
4. Tarayıcınız otomatik açılacak ve sizi `http://localhost:3000` adresine yönlendirecektir.

### Sisteme Giriş Yapma
Sistem (`users.db` içinden) otomatik olarak örnek yetkili doktorlar oluşturmuştur. Giriş için aşağıdaki gibi bir örneği kullanabilirsiniz:
- **Kullanıcı Adı:** `helin.ozalkan` (veya test ortamındaki diğer doktorlardan biri `erva.ergul`, `busra.inan`, `enes.coban`)
- **Şifre:** `123456`
