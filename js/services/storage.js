/**
 * TalkWithHand - Veri Depolama Servisi
 * GitHub Pages uyumluluğu için localStorage tabanlı backend simülasyonu.
 */

const StorageService = {
    // Veriyi kaydet
    save(key, data) {
        localStorage.setItem(`twh_${key}`, JSON.stringify(data));
    },

    // Veriyi getir
    get(key) {
        const data = localStorage.getItem(`twh_${key}`);
        return data ? JSON.parse(data) : null;
    },

    // Veriyi sil
    remove(key) {
        localStorage.removeItem(`twh_${key}`);
    },

    // Kullanıcıları getir
    getUsers() {
        return this.get('users') || [];
    },

    // Yeni kullanıcı kaydet
    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.save('users', users);
    }
};

export default StorageService;
