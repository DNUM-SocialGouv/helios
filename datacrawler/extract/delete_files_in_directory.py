import os


def delete_files_in_directory(directory):
    # Get the list of files in the directory
    file_list = os.listdir(directory)

    # Iterate through each file and delete it
    for file_name in file_list:
        file_path = os.path.join(directory, file_name)
        os.remove(file_path)
