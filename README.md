# 🎯 Görev Yöneticisi Uygulaması

Bu proje, Angular framework'ü kullanılarak geliştirilmiş modern bir görev yönetim uygulamasıdır. Kullanıcıların günlük görevlerini organize etmelerine, takip etmelerine ve yönetmelerine yardımcı olur.

## ✨ Özellikler

- 📝 Görev ekleme, düzenleme ve silme
- 🏷️ Kategorilere göre görev organizasyonu (İş, Kişisel, Alışveriş, Sağlık, Eğitim)
- ⚡ Öncelik seviyeleri (Yüksek, Orta, Düşük)
- 📅 Son tarih belirleme
- ✅ Görev tamamlama işaretleme
- 🔍 Gelişmiş filtreleme özellikleri
- 📊 Günlük tamamlanan görev istatistikleri
- 🌙 Modern ve kullanıcı dostu arayüz
- 💾 Yerel depolama ile veri kalıcılığı

## 🚀 Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullanici-adi/gorev-yoneticisi.git
cd gorev-yoneticisi
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
ng serve
```

4. Tarayıcınızda uygulamayı açın:
```
http://localhost:4200
```

## 🛠️ Teknolojiler

- Angular 17
- TypeScript
- HTML5
- CSS3
- Font Awesome Icons
- LocalStorage API

## 📱 Kullanım

### Görev Ekleme
1. "Yeni Görev" formunu kullanarak görev detaylarını girin
2. Kategori, öncelik ve son tarih seçin
3. "Ekle" butonuna tıklayın

### Görev Düzenleme
1. Görev kartındaki düzenleme (✏️) ikonuna tıklayın
2. Düzenleme formunda değişiklikleri yapın
3. "Kaydet" butonuna tıklayın

### Görev Tamamlama
1. Görev kartındaki tamamlama (✓) ikonuna tıklayın
2. Görev tamamlandı olarak işaretlenecek

### Filtreleme
- Kategori, öncelik ve duruma göre filtreleme yapabilirsiniz
- Son tarihe göre görevleri sıralayabilirsiniz

## 🎨 Tasarım Özellikleri

- Neon efektli modern tasarım
- Duyarlı (responsive) arayüz
- Kategori bazlı emoji gösterimi
- Öncelik seviyelerine göre renk kodlaması
- Hover efektleri ve animasyonlar

## 📦 Proje Yapısı

```
src/
├── app/
│   ├── components/
│   │   ├── todo-form/
│   │   ├── todo-list/
│   │   ├── filter/
│   │   └── edit-todo/
│   ├── services/
│   │   └── todo.service.ts
│   ├── models/
│   │   └── todo.model.ts
│   └── app.component.ts
├── assets/
└── styles.css
```

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: X'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 İletişim

Sorularınız veya önerileriniz için:
- GitHub Issues
- E-posta: ornek@email.com
