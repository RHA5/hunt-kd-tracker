(function() {
    const supabaseUrl = 'https://tcdtgptiwjmoxugfjvmh.supabase.co';
    const supabaseKey = 'sb_publishable_8XdnitORqFlCJLTnGnrlkw_rK9rAHF1';

    // Проверяем наличие библиотеки CDN
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        // Создаем клиент и перезаписываем window.supabase готовым инстансом
        const clientInstance = window.supabase.createClient(supabaseUrl, supabaseKey);
        window.supabase = clientInstance;
    } else {
        console.error('Ошибка: CDN-скрипт Supabase SDK не загрузился до supabase.js!');
    }
})();
