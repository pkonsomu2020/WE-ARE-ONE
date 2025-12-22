-- =====================================================
-- COMPREHENSIVE SUPABASE TABLE LISTING SCRIPT
-- Lists all 29 tables with detailed information
-- =====================================================

-- 1. SIMPLE TABLE LIST (All 29 tables)
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. TABLES WITH ROW COUNTS AND STATUS
SELECT 
    t.table_name,
    COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count,
    CASE 
        WHEN COALESCE(s.n_tup_ins - s.n_tup_del, 0) > 0 
        THEN '✅ HAS DATA (' || (s.n_tup_ins - s.n_tup_del) || ' rows)'
        ELSE '📭 EMPTY'
    END as status,
    t.table_type
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
ORDER BY COALESCE(s.n_tup_ins - s.n_tup_del, 0) DESC, t.table_name;

-- 3. DETAILED TABLE INFORMATION WITH COLUMNS
SELECT 
    t.table_name,
    COUNT(c.column_name) as column_count,
    COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count,
    CASE 
        WHEN COALESCE(s.n_tup_ins - s.n_tup_del, 0) > 0 THEN 'HAS DATA'
        ELSE 'EMPTY'
    END as data_status
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND c.table_schema = 'public'
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
GROUP BY t.table_name, s.n_tup_ins, s.n_tup_del
ORDER BY row_count DESC, t.table_name;

-- 4. TABLES WITH PRIMARY KEYS
SELECT 
    t.table_name,
    kcu.column_name as primary_key_column,
    COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints tc 
    ON t.table_name = tc.table_name AND tc.constraint_type = 'PRIMARY KEY'
LEFT JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
ORDER BY t.table_name;

-- 5. FOREIGN KEY RELATIONSHIPS
SELECT
    tc.table_name as table_with_fk,
    kcu.column_name as fk_column,
    ccu.table_name as referenced_table,
    ccu.column_name as referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 6. EXPECTED VS ACTUAL TABLES CHECK
-- (Based on your backend schema and migration files)
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
),
actual_tables AS (
    SELECT table_name as actual_table
    FROM information_schema.tables 
    WHERE table_schema = 'public'
)
SELECT 
    COALESCE(e.expected_table, a.actual_table) as table_name,
    CASE 
        WHEN e.expected_table IS NOT NULL AND a.actual_table IS NOT NULL THEN '✅ EXISTS'
        WHEN e.expected_table IS NOT NULL AND a.actual_table IS NULL THEN '❌ MISSING'
        WHEN e.expected_table IS NULL AND a.actual_table IS NOT NULL THEN '🆕 EXTRA'
    END as status,
    CASE 
        WHEN e.expected_table IS NOT NULL THEN 'Expected'
        ELSE 'Additional'
    END as category
FROM expected_tables e
FULL OUTER JOIN actual_tables a ON e.expected_table = a.actual_table
ORDER BY 
    CASE 
        WHEN e.expected_table IS NOT NULL AND a.actual_table IS NOT NULL THEN 1
        WHEN e.expected_table IS NOT NULL AND a.actual_table IS NULL THEN 2
        ELSE 3
    END,
    table_name;

-- 7. QUICK ROW COUNT FOR ALL TABLES
-- (This will show exact counts for each table)
DO $$
DECLARE
    table_record RECORD;
    query_text TEXT;
    row_count INTEGER;
BEGIN
    RAISE NOTICE 'TABLE ROW COUNTS:';
    RAISE NOTICE '==================';
    
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
    LOOP
        query_text := 'SELECT COUNT(*) FROM ' || quote_ident(table_record.table_name);
        EXECUTE query_text INTO row_count;
        RAISE NOTICE '% : % rows', RPAD(table_record.table_name, 30), row_count;
    END LOOP;
END $$;

-- 8. TABLE SIZES (Storage information)
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- 9. INDEXES ON ALL TABLES
SELECT 
    t.relname as table_name,
    i.relname as index_name,
    ix.indisprimary as is_primary,
    ix.indisunique as is_unique,
    array_to_string(array_agg(a.attname), ', ') as columns
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
WHERE t.relkind = 'r'
    AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
GROUP BY t.relname, i.relname, ix.indisprimary, ix.indisunique
ORDER BY t.relname, i.relname;

-- 10. SUMMARY STATISTICS
SELECT 
    COUNT(*) as total_tables,
    SUM(CASE WHEN COALESCE(s.n_tup_ins - s.n_tup_del, 0) > 0 THEN 1 ELSE 0 END) as tables_with_data,
    SUM(CASE WHEN COALESCE(s.n_tup_ins - s.n_tup_del, 0) = 0 THEN 1 ELSE 0 END) as empty_tables,
    SUM(COALESCE(s.n_tup_ins - s.n_tup_del, 0)) as total_rows
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public';