-- =====================================================
-- CORRECTED POSTGRESQL QUERIES FOR SUPABASE
-- =====================================================

-- 1. Check which tables have data (CORRECTED for PostgreSQL)
SELECT 
    t.table_name,
    CASE 
        WHEN c.n_tup_ins - c.n_tup_del > 0 THEN 'HAS DATA (' || (c.n_tup_ins - c.n_tup_del) || ' rows)'
        ELSE 'EMPTY'
    END as status,
    COALESCE(c.n_tup_ins - c.n_tup_del, 0) as row_count
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables c ON t.table_name = c.relname
WHERE t.table_schema = 'public'
ORDER BY COALESCE(c.n_tup_ins - c.n_tup_del, 0) DESC, t.table_name;

-- 2. Get all tables with column details (CORRECTED)
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'PK'
         WHEN tc.constraint_type = 'FOREIGN KEY' THEN 'FK'
         WHEN tc.constraint_type = 'UNIQUE' THEN 'UQ'
         ELSE ''
    END as constraint_type
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN information_schema.key_column_usage kcu ON c.table_name = kcu.table_name AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc ON kcu.constraint_name = tc.constraint_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;

-- 3. Simple table row counts (CORRECTED)
SELECT 
    schemaname,
    relname as table_name,
    n_tup_ins - n_tup_del as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY (n_tup_ins - n_tup_del) DESC;

-- 4. Get foreign key relationships (CORRECTED)
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 5. Quick table existence and row count check
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'admin_profiles', COUNT(*) FROM admin_profiles
UNION ALL
SELECT 'event_registrations', COUNT(*) FROM event_registrations
UNION ALL
SELECT 'event_payments', COUNT(*) FROM event_payments
UNION ALL
SELECT 'event_tickets', COUNT(*) FROM event_tickets
UNION ALL
SELECT 'support_categories', COUNT(*) FROM support_categories
UNION ALL
SELECT 'password_reset_tokens', COUNT(*) FROM password_reset_tokens
UNION ALL
SELECT 'chat_sessions', COUNT(*) FROM chat_sessions
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages
ORDER BY row_count DESC;

-- 6. Check if all required tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM (
    VALUES 
        ('users'),
        ('admin_users'),
        ('admin_profiles'),
        ('password_reset_tokens'),
        ('support_categories'),
        ('user_support_categories'),
        ('event_registrations'),
        ('event_payments'),
        ('event_tickets'),
        ('chat_sessions'),
        ('chat_messages'),
        ('admin_activity_log'),
        ('admin_notification_settings'),
        ('event_attendees'),
        ('event_notifications'),
        ('event_reminders'),
        ('files'),
        ('file_categories'),
        ('file_downloads'),
        ('notifications'),
        ('scheduled_events')
) AS required_tables(table_name)
ORDER BY status, table_name;