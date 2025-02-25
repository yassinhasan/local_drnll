from flask import current_app
import pandas as pd
from io import StringIO, BytesIO

def read_file_from_firebase(file_path):
    """
    Reads a file from Firebase Storage and loads it into a Pandas DataFrame.

    Args:
        file_path (str): The path to the file in Firebase Storage.

    Returns:
        pd.DataFrame: The DataFrame containing the file data.

    Raises:
        ValueError: If the file type is unsupported.
    """
    # Access Firebase services from the Flask app context
    firebase_services = current_app.firebase_services

    # Get a reference to the file in Firebase Storage
    bucket = firebase_services['admin_storage'].bucket()
    blob = bucket.blob(file_path)

    # Download the file as a byte stream
    file_content = blob.download_as_bytes()

    # Handle text files (CSV, TXT) and binary files (Excel) differently
    if file_path.endswith('.csv') or file_path.endswith('.txt'):
        try:
            # Attempt to decode as UTF-8 for text files
            file_content_str = file_content.decode('utf-8')
            file_like_object = StringIO(file_content_str)
        except UnicodeDecodeError:
            # If decoding fails, treat it as a binary file
            file_like_object = BytesIO(file_content)
    elif file_path.endswith('.xlsx'):
        # For Excel files, use BytesIO directly
        file_like_object = BytesIO(file_content)
    else:
        raise ValueError("Unsupported file type. Please upload a CSV, Excel, or TXT file.")

    # Load the content into a Pandas DataFrame based on the file type
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_like_object , skiprows=[1])
    elif file_path.endswith('.xlsx'):
        df = pd.read_excel(file_like_object , skiprows=[1])
    elif file_path.endswith('.txt' ):
        df = pd.read_csv(file_like_object, delimiter='\t')  # Adjust delimiter as needed
    else:
        raise ValueError("Unsupported file type. Please upload a CSV, Excel, or TXT file.")

    return df
