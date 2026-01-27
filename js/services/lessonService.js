/**
 * TalkWithHand - Eğitim Müfredatı ve Ders Servisi
 */

const LessonService = {
    // Tüm derslerin listesi
    getCurriculum() {
        return [
            {
                id: 'harfler-1',
                title: 'Harfler - Bölüm 1',
                description: 'A’dan H’ye kadar TİD harfleri.',
                difficulty: 'Başlangıç',
                type: 'alphabet',
                items: [
                    { id: 'a', label: 'A Harfi', content: 'El yumruk, baş parmak yanda.', tips: ['Bileği sabit tut.', 'Baş parmak işaret parmağına yakın.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=A' },
                    { id: 'b', label: 'B Harfi', content: 'Dört parmak dik ve birleşik, baş parmak avuç içinde.', tips: ['Parmakları birleştir.', 'Avuç içi karşıya dönük.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=B' },
                    { id: 'c', label: 'C Harfi', content: 'El C şeklinde kıvrılır.', tips: ['Parmakları yuvarla.', 'Bileği rahat bırak.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=C' },
                    { id: 'ç', label: 'Ç Harfi', content: 'C pozisyonu, küçük bilek hareketi ile vurgulanır.', tips: ['Bileği hafifçe çevir.', 'Pozisyonu koru.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=%C3%87' },
                    { id: 'd', label: 'D Harfi', content: 'İşaret parmağı dik, diğerleri kapalı.', tips: ['İşaret parmağını dik tut.', 'Diğer parmakları kapat.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=D' },
                    { id: 'e', label: 'E Harfi', content: 'Parmak uçları avuç içine doğru kıvrık.', tips: ['Uçları avuca yaklaştır.', 'El rahat.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=E' },
                    { id: 'f', label: 'F Harfi', content: 'Baş parmak ve işaret parmağı halka.', tips: ['Halka formunu koru.', 'Diğerleri doğal.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=F' },
                    { id: 'g', label: 'G Harfi', content: 'İşaret parmağı yatay, baş parmak destek.', tips: ['Bileği sabit tut.', 'İşaret parmağı yatay.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=G' },
                    { id: 'ğ', label: 'Ğ Harfi', content: 'G pozisyonu, hafif vurgu ile.', tips: ['Bilek vurgusu hafif.', 'Pozisyon stabil.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=%C4%9E' },
                    { id: 'h', label: 'H Harfi', content: 'İşaret ve orta parmak birlikte uzatılır.', tips: ['Parmakları yan yana tut.', 'Avuç içi karşıya.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=H' }
                ]
            },
            {
                id: 'harfler-2',
                title: 'Harfler - Bölüm 2',
                description: 'I’dan P’ye kadar TİD harfleri.',
                difficulty: 'Başlangıç',
                type: 'alphabet',
                items: [
                    { id: 'ı', label: 'I Harfi', content: 'İşaret parmağı dik, noktasız I vurgusu.', tips: ['Parmağı dik tut.', 'Avuç içi karşıya.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=%C4%B0siz+I' },
                    { id: 'i', label: 'İ Harfi', content: 'İşaret parmağı dik, noktalı İ vurgusu.', tips: ['Parmağı dik tut.', 'Bileği sabit.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=%C4%B0' },
                    { id: 'j', label: 'J Harfi', content: 'İşaret parmağı ile küçük J hareketi.', tips: ['Küçük kavis çiz.', 'Hareketi abartma.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=J' },
                    { id: 'k', label: 'K Harfi', content: 'İşaret ve orta parmak ayrık, baş parmak destek.', tips: ['Parmakları ayır.', 'Bileği rahat tut.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=K' },
                    { id: 'l', label: 'L Harfi', content: 'Baş parmak ile işaret parmağı L oluşturur.', tips: ['L formunu koru.', 'Avuç içi karşıya.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=L' },
                    { id: 'm', label: 'M Harfi', content: 'Üç parmak baş parmağın üstüne kapanır.', tips: ['Parmakları kapat.', 'Bileği sabit.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=M' },
                    { id: 'n', label: 'N Harfi', content: 'İki parmak baş parmağın üstüne kapanır.', tips: ['İki parmak kullan.', 'Pozisyonu koru.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=N' },
                    { id: 'o', label: 'O Harfi', content: 'El O şeklinde halka.', tips: ['Halka formu.', 'Elini rahat bırak.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=O' },
                    { id: 'ö', label: 'Ö Harfi', content: 'O pozisyonu, hafif dudak vurgusu.', tips: ['Halka sabit.', 'Küçük vurgular.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=%C3%96' },
                    { id: 'p', label: 'P Harfi', content: 'Baş parmak ile işaret parmağı destekli form.', tips: ['Baş parmağı hizala.', 'Bileği düz tut.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=P' }
                ]
            },
            {
                id: 'harfler-3',
                title: 'Harfler - Bölüm 3',
                description: 'R’den Z’ye kadar TİD harfleri.',
                difficulty: 'Başlangıç',
                type: 'alphabet',
                items: [
                    { id: 'r', label: 'R Harfi', content: 'İşaret parmağı kıvrık, küçük vurgu.', tips: ['Kıvrımı net yap.', 'Hareketi abartma.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=R' },
                    { id: 's', label: 'S Harfi', content: 'El yumruk, baş parmak üstte.', tips: ['Yumruğu rahat tut.', 'Baş parmak üstte dursun.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=S' },
                    { id: 'ş', label: 'Ş Harfi', content: 'S pozisyonu, hafif bilek vurgusu.', tips: ['Vurguyu hafif yap.', 'Pozisyon stabil.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=%C5%9E' },
                    { id: 't', label: 'T Harfi', content: 'Baş parmak işaret parmağıyla kesişir.', tips: ['Kesişimi netleştir.', 'Avuç içi karşıya.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=T' },
                    { id: 'u', label: 'U Harfi', content: 'İşaret ve orta parmak birleşik.', tips: ['Parmakları birleştir.', 'Bileği sabit.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=U' },
                    { id: 'ü', label: 'Ü Harfi', content: 'U pozisyonu, küçük vurgular.', tips: ['Hafif vurgu.', 'Pozisyonu koru.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=%C3%9C' },
                    { id: 'v', label: 'V Harfi', content: 'İşaret ve orta parmak V.', tips: ['V formu.', 'Parmakları aç.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=V' },
                    { id: 'y', label: 'Y Harfi', content: 'Baş parmak ve serçe parmak açık.', tips: ['Uçları aç.', 'Bileği rahat tut.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=Y' },
                    { id: 'z', label: 'Z Harfi', content: 'İşaret parmağı ile küçük Z hareketi.', tips: ['Küçük çizim.', 'Hareketi abartma.'], imageUrl: 'https://dummyimage.com/400x300/2563eb/ffffff.png&text=Z' }
                ]
            }
        ];
    },

    // ID'ye göre ders getir
    getLessonById(lessonId) {
        return this.getCurriculum().find(l => l.id === lessonId);
    },

    // Bir sonraki dersi bul
    getNextLesson(currentLessonId) {
        const curriculum = this.getCurriculum();
        const currentIndex = curriculum.findIndex(l => l.id === currentLessonId);
        return curriculum[currentIndex + 1] || null;
    }
};

export default LessonService;
