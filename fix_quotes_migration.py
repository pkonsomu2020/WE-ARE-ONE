#!/usr/bin/env python3
"""
Fix single quote issues in MySQL to PostgreSQL migration
"""
import re
import sys

def fix_single_quotes_in_sql(content):
    """Fix single quotes in SQL INSERT statements for PostgreSQL"""
    
    # Pattern to match VALUES clause with parentheses
    values_pattern = r"VALUES\s*\((.*?)\);"
    
    def fix_quotes_in_values(match):
        values_content = match.group(1)
        
        # Split by '), (' to get individual value sets
        value_sets = re.split(r'\),\s*\(', values_content)
        
        fixed_sets = []
        for i, value_set in enumerate(value_sets):
            # Clean up the value set
            if i == 0:
                value_set = value_set.lstrip('(')
            if i == len(value_sets) - 1:
                value_set = value_set.rstrip(')')
            
            # Fix single quotes within string literals
            # This regex finds quoted strings and fixes single quotes inside them
            def fix_string_quotes(string_match):
                string_content = string_match.group(1)
                # Replace single quotes with double single quotes for PostgreSQL
                fixed_content = string_content.replace("'", "''")
                return f"'{fixed_content}'"
            
            # Apply the fix to all quoted strings in this value set
            fixed_value_set = re.sub(r"'([^']*(?:''[^']*)*)'", fix_string_quotes, value_set)
            fixed_sets.append(fixed_value_set)
        
        # Reconstruct the VALUES clause
        return f"VALUES ({'), ('.join(fixed_sets)});"
    
    # Apply the fix to all VALUES clauses
    fixed_content = re.sub(values_pattern, fix_quotes_in_values, content, flags=re.DOTALL)
    
    return fixed_content

def main():
    input_file = 'weareone_donation_app.sql'
    output_file = 'supabase-clean-migration.sql'
    
    print(f"Reading {input_file}...")
    
    try:
        with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        print("Extracting INSERT statements...")
        
        # Extract only INSERT statements
        insert_statements = []
        lines = content.split('\n')
        current_insert = []
        in_insert = False
        
        for line in lines:
            line = line.strip()
            
            # Skip non-INSERT lines
            if not line or line.startswith('--') or line.startswith('/*') or line.startswith('SET ') or line.startswith('CREATE ') or line.startswith('DROP ') or line.startswith('ALTER ') or line.startswith('/*!'):
                continue
            
            # Start of INSERT statement
            if line.startswith('INSERT INTO'):
                in_insert = True
                current_insert = [line]
                continue
            
            # Continue collecting INSERT statement
            if in_insert:
                current_insert.append(line)
                
                # End of INSERT statement
                if line.endswith(');'):
                    full_insert = ' '.join(current_insert)
                    # Remove MySQL backticks
                    full_insert = full_insert.replace('`', '')
                    insert_statements.append(full_insert)
                    current_insert = []
                    in_insert = False
        
        print(f"Found {len(insert_statements)} INSERT statements")
        
        # Fix single quotes in all statements
        print("Fixing single quotes...")
        fixed_statements = []
        for stmt in insert_statements:
            try:
                fixed_stmt = fix_single_quotes_in_sql(stmt)
                fixed_statements.append(fixed_stmt)
            except Exception as e:
                print(f"Error fixing statement: {e}")
                print(f"Problematic statement: {stmt[:200]}...")
                # Use original statement if fixing fails
                fixed_statements.append(stmt)
        
        # Write the clean migration file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- Clean PostgreSQL Data Migration for Supabase\n")
            f.write("-- All single quotes properly escaped\n")
            f.write("-- Generated automatically\n\n")
            
            f.write("-- Disable triggers and constraints for faster import\n")
            f.write("SET session_replication_role = replica;\n\n")
            
            for i, stmt in enumerate(fixed_statements, 1):
                f.write(f"-- INSERT statement {i}\n")
                f.write(stmt + "\n\n")
            
            f.write("-- Re-enable triggers and constraints\n")
            f.write("SET session_replication_role = DEFAULT;\n\n")
            
            f.write("-- Update sequences to correct values\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_activity_log', 'id'), COALESCE(MAX(id), 1)) FROM admin_activity_log;\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_notification_settings', 'id'), COALESCE(MAX(id), 1)) FROM admin_notification_settings;\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_profiles', 'id'), COALESCE(MAX(id), 1)) FROM admin_profiles;\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_users', 'id'), COALESCE(MAX(id), 1)) FROM admin_users;\n")
            f.write("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;\n")
            f.write("SELECT setval(pg_get_serial_sequence('event_payments', 'id'), COALESCE(MAX(id), 1)) FROM event_payments;\n")
            f.write("SELECT setval(pg_get_serial_sequence('event_registrations', 'id'), COALESCE(MAX(id), 1)) FROM event_registrations;\n")
            f.write("SELECT setval(pg_get_serial_sequence('event_tickets', 'id'), COALESCE(MAX(id), 1)) FROM event_tickets;\n")
            f.write("SELECT setval(pg_get_serial_sequence('files', 'id'), COALESCE(MAX(id), 1)) FROM files;\n")
            f.write("SELECT setval(pg_get_serial_sequence('notifications', 'id'), COALESCE(MAX(id), 1)) FROM notifications;\n")
            f.write("SELECT setval(pg_get_serial_sequence('scheduled_events', 'id'), COALESCE(MAX(id), 1)) FROM scheduled_events;\n")
        
        print(f"Clean migration file created: {output_file}")
        
        # Count users specifically
        user_inserts = [stmt for stmt in fixed_statements if 'INSERT INTO users' in stmt]
        print(f"Found {len(user_inserts)} user INSERT statements")
        
        # Count total users by looking at the VALUES
        total_users = 0
        for stmt in user_inserts:
            # Count the number of value tuples
            values_match = re.search(r'VALUES\s*\((.*?)\);', stmt, re.DOTALL)
            if values_match:
                values_content = values_match.group(1)
                # Count occurrences of '), (' which separate value tuples
                tuple_count = values_content.count('), (') + 1
                total_users += tuple_count
                print(f"User INSERT statement has {tuple_count} users")
        
        print(f"Total users to be migrated: {total_users}")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())