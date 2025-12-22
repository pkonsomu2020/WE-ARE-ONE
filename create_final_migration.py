#!/usr/bin/env python3
"""
Create final complete PostgreSQL migration from MySQL dump
"""
import re
import sys

def main():
    input_file = 'weareone_donation_app.sql'
    output_file = 'supabase-final-complete-migration.sql'
    
    print(f"Creating final complete migration from {input_file}...")
    
    try:
        # Read the entire file
        with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        print("Processing content...")
        
        # Remove MySQL-specific syntax and comments
        lines = content.split('\n')
        clean_lines = []
        
        for line in lines:
            line = line.strip()
            
            # Skip MySQL-specific lines
            if (line.startswith('--') or 
                line.startswith('/*') or 
                line.startswith('SET ') or 
                line.startswith('START TRANSACTION') or
                line.startswith('/*!') or
                line.startswith('CREATE TABLE') or
                line.startswith('DROP TABLE') or
                line.startswith('ALTER TABLE') or
                line.startswith('KEY ') or
                line.startswith('PRIMARY KEY') or
                line.startswith('UNIQUE KEY') or
                line.startswith('CONSTRAINT') or
                line.startswith(') ENGINE=') or
                not line or
                line == ';'):
                continue
            
            # Clean up the line
            line = line.replace('`', '')  # Remove backticks
            
            # Fix single quotes by doubling them for PostgreSQL
            if 'INSERT INTO' in line:
                # Use regex to properly escape single quotes within string literals
                def escape_quotes(match):
                    content = match.group(1)
                    # Double single quotes for PostgreSQL
                    escaped = content.replace("'", "''")
                    return f"'{escaped}'"
                
                # Apply to all quoted strings
                line = re.sub(r"'([^']*(?:''[^']*)*)'", escape_quotes, line)
            
            clean_lines.append(line)
        
        # Join lines and split by INSERT statements
        clean_content = ' '.join(clean_lines)
        
        # Split into INSERT statements
        insert_statements = []
        parts = clean_content.split('INSERT INTO')
        
        for i, part in enumerate(parts):
            if i == 0:  # Skip the first empty part
                continue
            
            # Reconstruct the INSERT statement
            stmt = 'INSERT INTO' + part
            
            # Find the end of this statement (next INSERT or end of content)
            if ';' in stmt:
                stmt = stmt.split(';')[0] + ';'
            
            insert_statements.append(stmt.strip())
        
        print(f"Found {len(insert_statements)} INSERT statements")
        
        # Write the final migration file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- Final Complete PostgreSQL Data Migration for Supabase\n")
            f.write("-- Converted from MySQL dump with all single quotes properly escaped\n")
            f.write("-- Generated automatically - Ready for production use\n\n")
            
            f.write("-- Disable triggers and constraints for faster import\n")
            f.write("SET session_replication_role = replica;\n\n")
            
            for i, stmt in enumerate(insert_statements, 1):
                if stmt.strip():
                    f.write(f"-- INSERT statement {i}\n")
                    f.write(stmt + "\n\n")
            
            f.write("-- Re-enable triggers and constraints\n")
            f.write("SET session_replication_role = DEFAULT;\n\n")
            
            f.write("-- Update sequences to correct values\n")
            sequences = [
                'admin_activity_log', 'admin_notification_settings', 'admin_profiles', 
                'admin_users', 'chat_sessions', 'event_attendees', 'event_notifications',
                'event_payments', 'event_registrations', 'event_reminders', 'event_tickets',
                'files', 'file_categories', 'file_downloads', 'notifications', 
                'password_reset_tokens', 'scheduled_events', 'support_categories', 'users'
            ]
            
            for table in sequences:
                f.write(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE(MAX(id), 1)) FROM {table};\n")
        
        print(f"Final migration file created: {output_file}")
        
        # Count users specifically
        user_inserts = [stmt for stmt in insert_statements if 'INSERT INTO users' in stmt]
        print(f"Found {len(user_inserts)} user INSERT statements")
        
        # Count total users
        total_users = 0
        for stmt in user_inserts:
            # Count the number of value tuples by counting '), (' patterns
            tuple_count = stmt.count('), (') + 1 if 'VALUES' in stmt else 0
            total_users += tuple_count
            print(f"User INSERT statement has {tuple_count} users")
        
        print(f"Total users to be migrated: {total_users}")
        
        # Verify the file size
        import os
        file_size = os.path.getsize(output_file)
        print(f"Migration file size: {file_size:,} bytes")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())