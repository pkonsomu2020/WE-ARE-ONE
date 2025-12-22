-- =====================================================
-- DETAILED TABLE STATUS - IDENTIFY DATA vs EMPTY TABLES
-- Based on your 30 tables with 1,136 total rows
-- =====================================================

-- 1. LIST ALL 30 TABLES WITH EXACT ROW COUNTS
SELECT 
    t.table_name,
    COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count,
    CASE 
        WHEN COALESCE(s.n_tup_ins - s.n_tup_del, 0) > 0 
        THEN '✅ HAS DATA (' || (s.n_tup_ins - s.n_tup_del) || ' rows)'
        ELSE '📭 EMPTY'
    END as status
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
ORDER BY COALESCE(s.n_tup_ins - s.n_tup_del, 0) DESC, t.table_name;

-- 2. TABLES WITH DATA (21 tables)
SELECT 
    t.table_name,
    COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
    AND COALESCE(s.n_tup_ins - s.n_tup_del, 0) > 0
ORDER BY COALESCE(s.n_tup_ins - s.n_tup_del, 0) DESC;

-- 3. EMPTY TABLES (9 tables)
SELECT 
    t.table_name,
    'Empty - Ready for data' as status
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
    AND COALESCE(s.n_tup_ins - s.n_tup_del, 0) = 0
ORDER BY t.table_name;

-- 4. CHECK IF USERS TABLE EXISTS AND HAS DATA
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public')
        THEN '✅ Users table exists'
        ELSE '❌ Users table missing'
    END as users_table_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public')
        THEN (SELECT COUNT(*) FROM users)
        ELSE 0
    END as users_count;

-- 5. IDENTIFY THE EXTRA TABLE (You have 30, expected ~21-29)
WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'admin_activity_log',
        'admin_notification_settings', 
        'admin_profiles',
        'admin_users',
        'chat_messages',
        'chat_sessions',
        'event_attendees',
        'event_notifications',
        'event_payments',
        'event_registrations',
        'event_reminders',
        'event_tickets',
        'file_categories',
        'file_downloads',
        'files',
        'notifications',
        'password_reset_tokens',
        'scheduled_events',
        'support_categories',
        'user_support_categories',
        'users'
    ]) as expected_table
)
SELECT 
    t.table_name,
    CASE 
        WHEN e.expected_table IS NOT NULL THEN '✅ Expected'
        ELSE '🆕 Additional/Extra'
    END as table_type,
    COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count
FROM information_schema.tables t
LEFT JOIN expected_tables e ON t.table_name = e.expected_table
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
ORDER BY 
    CASE WHEN e.expected_table IS NOT NULL THEN 1 ELSE 2 END,
    COALESCE(s.n_tup_ins - s.n_tup_del, 0) DESC;

-- 6. MIGRATION STATUS CHECK
SELECT 
    'MIGRATION STATUS' as check_type,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') >= 21
        THEN '✅ Sufficient tables created'
        ELSE '⚠️ Missing tables'
    END as table_status,
    CASE 
        WHEN (SELECT SUM(COALESCE(s.n_tup_ins - s.n_tup_del, 0)) FROM information_schema.tables t LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname WHERE t.table_schema = 'public') > 1000
        THEN '✅ Significant data migrated (' || (SELECT SUM(COALESCE(s.n_tup_ins - s.n_tup_del, 0)) FROM information_schema.tables t LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname WHERE t.table_schema = 'public') || ' rows)'
        ELSE '⚠️ Limited data'
    END as data_status;