// ============ STUDIO IG - ЛОКАЛЬНОЕ ХРАНЕНИЕ ============
// Пока Supabase настраивается, используем Local Storage

console.log('✅ Используем локальное хранилище');

// Сохранение данных
async function saveBooking(booking) {
    try {
        // Получаем существующие записи
        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // Создаем новую запись с ID
        const newBooking = {
            id: Date.now(),
            ...booking,
            status: 'active',
            created_at: new Date().toISOString()
        };
        
        // Добавляем и сохраняем
        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        console.log('✅ Запись сохранена локально:', newBooking);
        return newBooking;
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        throw error;
    }
}

async function getBookings() {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        console.log('📋 Загружено записей:', bookings.length);
        return bookings;
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        return [];
    }
}

async function saveClient(client) {
    try {
        let clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const newClient = {
            id: Date.now(),
            ...client,
            created_at: new Date().toISOString()
        };
        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));
        console.log('✅ Клиент сохранен:', newClient);
        return newClient;
    } catch (error) {
        console.error('❌ Ошибка сохранения клиента:', error);
    }
}

async function getClients() {
    try {
        return JSON.parse(localStorage.getItem('clients') || '[]');
    } catch (error) {
        return [];
    }
}

async function getServices() {
    // Услуги по умолчанию
    const defaultServices = [
        { id: 1, name: 'Маникюр', duration: 60, price: 1500, order: 1 },
        { id: 2, name: 'Педикюр', duration: 90, price: 2000, order: 2 },
        { id: 3, name: 'Маникюр + педикюр', duration: 120, price: 3200, order: 3 },
        { id: 4, name: 'Покрытие гель-лак', duration: 60, price: 1000, order: 4 }
    ];
    
    // Сохраняем услуги если их нет
    if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify(defaultServices));
    }
    
    return JSON.parse(localStorage.getItem('services') || JSON.stringify(defaultServices));
}

async function updateBookingStatus(id, status) {
    const bookings = await getBookings();
    const updated = bookings.map(b => 
        b.id == id ? { ...b, status } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updated));
    return { success: true };
}

async function deleteBooking(id) {
    const bookings = await getBookings();
    const filtered = bookings.filter(b => b.id != id);
    localStorage.setItem('bookings', JSON.stringify(filtered));
    return { success: true };
}

async function getAvailableSlots() {
    const timeSlots = [
        '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00'
    ];
    
    const today = new Date().toISOString().split('T')[0];
    const bookings = await getBookings();
    const todayBookings = bookings.filter(b => b.date === today);
    const bookedTimes = todayBookings.map(b => b.time);
    
    return timeSlots.filter(time => !bookedTimes.includes(time));
}

async function getTodayBookings() {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await getBookings();
    return bookings.filter(b => b.date === today);
}

// Делаем функции доступными глобально
window.getServices = getServices;
window.getBookings = getBookings;
window.saveBooking = saveBooking;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.getClients = getClients;
window.saveClient = saveClient;
window.getAvailableSlots = getAvailableSlots;
window.getTodayBookings = getTodayBookings;

console.log('✅ Локальное хранилище готово!');
console.log('💡 Данные сохраняются в браузере (Local Storage)');