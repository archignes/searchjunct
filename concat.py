import os

# Directory where the component files are located
components_path = '/Users/dsg/searchjunct/src/components'
# Additional files with their respective paths
additional_files = [
    '/Users/dsg/searchjunct/pages/index.tsx',
    '/Users/dsg/searchjunct/pages/_app.tsx'
]

# List of filenames to concatenate within the components directory
filenames = [
    'DataContext.tsx',
    'Footer.tsx',
    'Header.tsx',
    'SearchContext.tsx',
    'SettingsCard.tsx',
    'SortableItem.tsx',
    'StorageContext.tsx',
    'SystemCard.tsx',
    'SystemList.tsx',
    'SystemsContext.tsx',
    'Toolbar.tsx'
]


# Output file
output_file = '/Users/dsg/searchjunct_concat.tsx'

# Get all the files in the components directory (without entering subdirectories)
filenames = [file for file in os.listdir(components_path) if file.endswith('.tsx')]

# Add the paths of the additional files to the filenames list
# Note: Since these files are outside the components directory, add them separately
for file_path in additional_files:
    filenames.append(file_path)


included_files = []  # List to store the names of included files

# Open the output file in write mode
with open(output_file, 'w') as outfile:
    # Iterate over each file (path) in the components directory (without entering subdirectories)
    for file_path in filenames:
        # For files in the components directory, prepend the directory path
        if not file_path.startswith('/'):
            file_path = os.path.join(components_path, file_path)
        # Check if the file exists
        if os.path.isfile(file_path):
            # Open the file in read mode
            with open(file_path, 'r') as infile:
                # Read the file's content
                contents = infile.read()
                # Write the content to the output file
                outfile.write(contents)
                # Optionally, write a newline or some separator if needed
                outfile.write('\n')
                included_files.append(file_path)  # Add the file name to the included_files list
        else:
            print(f"File not found: {file_path}")

# Print the names of all included files
print("Included files:")
for file_name in included_files:
    print(file_name)

# Print a message upon successful completion
print(f"Concatenation complete. Output written to: {output_file}")
