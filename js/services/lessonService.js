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
                description: 'A, B, C, D harflerini öğrenmeye başlayın.',
                difficulty: 'Başlangıç',
                type: 'alphabet',
                items: [
                    {
                        id: 'char-a',
                        label: 'A Harfi',
                        content: 'İşaret dilinde "A" harfi, elin yumruk yapılıp baş parmağın diğer parmakların yanına yaslanmasıyla oluşur.',
                        tips: ['Yumruğunuzu çok sıkmayın.', 'Baş parmağınızın dik durduğundan emin olun.'],
                        imageUrl: 'https://images.unsplash.com/photo-1534114775010-0648f3281987?auto=format&fit=crop&q=80&w=400'
                    },
                    {
                        id: 'char-b',
                        label: 'B Harfi',
                        content: 'Dört parmağınızın bitişik ve dik, baş parmağınızın avuç içine doğru kıvrık olduğu işarettir.',
                        tips: ['Parmaklarınızın birbirine değdiğinden emin olun.', 'Eliniz karşıya baksın.'],
                        imageUrl: 'https://images.unsplash.com/photo-1534114775010-0648f3281987?auto=format&fit=crop&q=80&w=400'
                    }
                ]
            },
            {
                id: 'temel-selamlasma',
                title: 'Temel Selamlaşma',
                description: 'Günlük hayatta en çok kullanılan selamlaşma kelimeleri.',
                difficulty: 'Orta',
                type: 'words',
                items: [
                    {
                        id: 'word-merhaba',
                        label: 'Merhaba',
                        content: 'Elinizi alnınıza götürüp hafifçe dışarı doğru selam verir gibi açın.',
                        tips: ['Gülümsemeyi unutmayın.', 'Hareketin akıcı olmasına dikkat edin.'],
                        imageUrl: 'https://images.unsplash.com/photo-1534114775010-0648f3281987?auto=format&fit=crop&q=80&w=400'
                    }
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
