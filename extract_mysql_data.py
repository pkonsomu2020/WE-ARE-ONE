#!/usr/bin/env python3
"""
Extract INSERT statements from MySQL dump and convert to PostgreSQL format
"""
import re
import sys

def escape_single_quotes(text):
    """Escape single quotes for PostgreSQL"""
    if text is None:
        return 'NULL'
    if isinstance(text, str):
        # Replace single quotes with double single quotes for PostgreSQL
        return text.replace("'", "''")
    return str(text)

def convert_mysql_to_postgres_insert(line):
    """Convert MySQL INSERT statement to PostgreSQL format"""
    # Remove MySQL-specific backticks
    line = line.replace('`', '')
    
    # Handle MySQL specific syntax
    line = line.replace('ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;', '')
    
    return line

def extract_insert_statements(filename):
    """Extract all INSERT statements from MySQL dump"""
    insert_statements = []
    current_insert = []
    in_insert = False
    
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            
            # Skip CREATE TABLE statements and other schema definitions
            if line.startswith('CREATE TABLE') or line.startswith('DROP TABLE') or line.startswith('ALTER TABLE'):
                continue
            if line.startswith('--') or line.startswith('/*') or line.startswith('SET ') or line.startswith('/*!'):
                continue
            if not line or line == ';':
                continue
                
            # Start of INSERT statement
            if line.startswith('INSERT INTO'):
                in_insert = True
                current_insert = [line]
                continue
            
            # Continue collecting INSERT statement
            if in_insert:
                current_insert.append(line)
                
                # End of INSERT statement (ends with );)
                if line.endswith(');'):
                    full_insert = ' '.join(current_insert)
                    # Convert to PostgreSQL format
                    postgres_insert = convert_mysql_to_postgres_insert(full_insert)
                    insert_statements.append(postgres_insert)
                    current_insert = []
                    in_insert = False
    
    return insert_statements

def main():
    input_file = 'weareone_donation_app.sql'
    output_file = 'supabase-postgres-data-migration.sql'
    
    print(f"Extracting INSERT statements from {input_file}...")
    
    try:
        insert_statements = extract_insert_statements(input_file)
        
        print(f"Found {len(insert_statements)} INSERT statements")
        
        # Write PostgreSQL migration file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- PostgreSQL Data Migration for Supabase\n")
            f.write("-- Converted from MySQL dump\n")
            f.write("-- Generated automatically\n\n")
            
            f.write("-- Disable triggers and constraints for faster import\n")
            f.write("SET session_replication_role = replica;\n\n")
            
            for i, stmt in enumerate(insert_statements, 1):
                f.write(f"-- INSERT statement {i}\n")
                f.write(stmt + "\n\n")
            
            f.write("-- Re-enable triggers and constraints\n")
            f.write("SET session_replication_role = DEFAULT;\n")
            f.write("\n-- Update sequences to correct values\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_activity_log', 'id'), COALESCE(MAX(id), 1)) FROM admin_activity_log;\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_notification_settings', 'id'), COALESCE(MAX(id), 1)) FROM admin_notification_settings;\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_profiles', 'id'), COALESCE(MAX(id), 1)) FROM admin_profiles;\n")
            f.write("SELECT setval(pg_get_serial_sequence('admin_users', 'id'), COALESCE(MAX(id), 1)) FROM admin_users;\n")
            f.write("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;\n")
            f.write("-- Add more sequence updates as needed for other tables\n")
        
        print(f"PostgreSQL migration file created: {output_file}")
        
        # Count users specifically
        user_inserts = [stmt for stmt in insert_statements if 'INSERT INTO users' in stmt]
        print(f"Found {len(user_inserts)} user INSERT statements")
        
        # Show first few characters of each user insert to verify
        for i, stmt in enumerate(user_inserts):
            print(f"User INSERT {i+1}: {stmt[:100]}...")
            
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())