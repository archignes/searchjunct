import os

# Preamble
PREAMBLE = """// This file is a concatenation of key files in a web application.
// name: Searchjunct
// description: Searchjunct is a single-page application designed to facilitate multi-engine search selection and routing. This tool serves as a speculative or exploratory design prototype, providing a platform for wondering, particularly around user interaction with multiple search engines and finding & supporting better tools and practices.
// stack: Next.js, TypeScript, React, Tailwind CSS, Jest, Puppeteer
// author: Daniel Griffin
// license: MIT
// version: 0.1.0


"""

def get_directory_structure(path):
    """
    Generate the directory structure of the given path.

    Ignores:
        files starting with '.'
        directories starting with '.'
        node_modules/
        concat.py
    Args:
        path (str): The path to the directory.

    Returns:
        str: The directory structure.
    """
    structure = ""
    for root, dirs, files in os.walk(path):
        # implement ignores
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        files[:] = [f for f in files if not f.startswith('.')]
        if 'node_modules' in root:
            continue
        if 'concat.py' in root:
            continue
        level = root.replace(path, "").count(os.sep)
        indent = " " * 4 * (level)
        structure += f"{indent}{os.path.basename(root)}/\n"
        sub_indent = " " * 4 * (level + 1)
        for file in files:
            structure += f"{sub_indent}{file}\n"
    return structure

# Directory where the component files are located
components_path = './src/components'
# Directory where the e2e test files are located
e2e_tests_path = './e2e/'
# Additional files with their respective paths
additional_files = ["./pages/index.tsx", "./pages/_app.tsx"]

# Output file
output_file = '/Users/dsg/searchjunct_concat.md'

# Get all the files in the components directory (without entering the ui subdirectory)
filenames = []
for root, dirs, files in os.walk(components_path):
    if os.path.basename(root) == 'ui':
        continue
    for file in files:
        if file.endswith('.tsx'):
            filenames.append(os.path.join(root, file))

# Add the paths of the e2e test files to the filenames list
for file_path in os.listdir(e2e_tests_path):
    if file_path.endswith('.ts'):
        filenames.append(os.path.join(e2e_tests_path, file_path))

# Add the paths of the additional files to the filenames list
# Note: Since these files are outside the components directory, add them separately
for file_path in additional_files:
    filenames.append(file_path)


included_files = []  # List to store the names of included files

# Open the output file in write mode
with open(output_file, 'w') as outfile:
    # Write the preamble to the output file
    outfile.write(PREAMBLE)
    # Write the directory structure to the output file
    outfile.write("```\n")
    outfile.write(get_directory_structure("."))
    outfile.write("```\n")
    # Iterate over each file (path) in the components directory (without entering subdirectories)
    for file_path in filenames:
        # Check if the file exists
        if os.path.isfile(file_path):
            # Open the file in read mode
            with open(file_path, 'r') as infile:
                # Read the file's content
                contents = infile.read()
                # Write the content to the output file
                outfile.write("\n```\n")
                outfile.write(contents)
                # Optionally, write a newline or some separator if needed
                outfile.write('\n')
                outfile.write("```\n")
                included_files.append(file_path)  # Add the file name to the included_files list
        else:
            print(f"File not found: {file_path}")

# Print the names of all included files
print("Included files:")
for file_name in included_files:
    print(file_name)

# Print a message upon successful completion
print(f"Concatenation complete. Output written to: {output_file}")
