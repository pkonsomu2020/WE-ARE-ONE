#!/usr/bin/env python3
"""
Extract ALL user records from MySQL dump and create clean PostgreSQL migration
"""
import re
import sys

def escape_postgres_string(text):
    """Properly escape strings for PostgreSQL"""
    if text is None or text == 'NULL':
        return 'NULL'
    # Replace single quotes with double single quotes
    return "'" + str(text).replace("'", "''") + "'"

def extract_user_values(content):
    """Extract all user value tuples from INSERT statements"""
    user_records = []
    
    # Find all INSERT INTO users statements
    user_inserts = re.findall(r'INSERT INTO `?users`?.*?VALUES\s*\((.*?)\);', content, re.DOTALL | re.IGNORECASE)
    
    for insert_values in user_inserts:
        # Split by '), (' to get individual records
        records = re.split(r'\),\s*\(', insert_values)
        
        for i, record in enumerate(records):
            # Clean up the record
            if i == 0:
                record = record.lstrip('(')
            if i == len(records) - 1:
                record = record.rstrip(')')
            
            # Parse the record values
            # This is a complex parsing task, so let's use a simpler approach
            user_records.append(f"({record})")
    
    return user_records

def main():
    input_file = 'weareone_donation_app.sql'
    output_file = 'supabase-users-only-migration.sql'
    
    print(f"Extracting ALL users from {input_file}...")
    
    try:
        with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        print("Extracting user records...")
        
        # Find all user INSERT statements with a more comprehensive regex
        pattern = r'INSERT INTO `?users`?[^;]*VALUES\s*\((.*?)\);'
        matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
        
        all_user_values = []
        total_users = 0
        
        for match in matches:
            # Count records in this match by counting '), (' patterns
            record_count = match.count('), (') + 1
            total_users += record_count
            print(f"Found INSERT with {record_count} user records")
            
            # Split into individual records
            records = re.split(r'\),\s*\(', match)
            
            for i, record in enumerate(records):
                # Clean up the record
                if i == 0:
                    record = record.lstrip('(')
                if i == len(records) - 1:
                    record = record.rstrip(')')
                
                # Fix single quotes in the record
                fixed_record = re.sub(r"'([^']*)'", lambda m: escape_postgres_string(m.group(1)), record)
                all_user_values.append(f"({fixed_record})")
        
        print(f"Total users found: {total_users}")
        print(f"Total user value records: {len(all_user_values)}")
        
        # Create the migration file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- PostgreSQL Users Migration for Supabase\n")
            f.write(f"-- Contains {total_users} user records\n")
            f.write("-- All single quotes properly escaped for PostgreSQL\n\n")
            
            f.write("-- Disable triggers for faster import\n")
            f.write("SET session_replication_role = replica;\n\n")
            
            if all_user_values:
                f.write("-- Insert all users\n")
                f.write("INSERT INTO users (id, full_name, email, phone, gender, age, location, password_hash, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, live_location, personal_statement, created_at, updated_at) VALUES\n")
                
                # Write all user records
                for i, record in enumerate(all_user_values):
                    if i == len(all_user_values) - 1:
                        f.write(f"{record};\n\n")
                    else:
                        f.write(f"{record},\n")
            
            f.write("-- Re-enable triggers\n")
            f.write("SET session_replication_role = DEFAULT;\n\n")
            
            f.write("-- Update users sequence\n")
            f.write("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;\n")
        
        print(f"Users migration file created: {output_file}")
        
        # Show first few users for verification
        print("\nFirst 3 user records:")
        for i, record in enumerate(all_user_values[:3]):
            print(f"{i+1}: {record[:100]}...")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())