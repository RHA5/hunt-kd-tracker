const supabaseUrl = 'https://tcdtgptiwjmoxugfjvmh.supabase.co';
const supabaseKey = 'sb_publishable_8XdnitORqFlCJLTnGnrlkw_rK9rAHF1';

// Используем правильное имя глобального объекта из CDN v2
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

window.supabase = supabase;
