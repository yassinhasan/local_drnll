import time
from flask import current_app
import pandas as pd
from io import StringIO, BytesIO
from openpyxl import load_workbook

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

def read_file_from_request(file):
    # filename = file.filename
    # if filename.endswith('txt'):
    #    df = pd.read_csv(file , delimiter="'\t") 
    # elif filename.endswith('csv'):
    #     df = pd.read_csv(file)
    # elif filename.endswith("xlsx"):
    #     df = pd.read_excel(file)

    # return df    
    # from openpyxl import load_workbook


    dtypes =  {
    "Customer ID": "float64",
    "Customer Name": "object",
    "DeliveryNo": "float64",
    "Discount Value": "float64",
    "Document Type": "object",
    "Indirect Customer": "object",
    "Insurance Approval": "object",
    "Insurance Type": "float64",
    "Item Lines Count": "int64",
    "Items": "int64",
    "Location": "object",
    "Loyalty Customer ID": "float64",
    "Loyalty Name": "object",
    "Loyalty Phone": "float64",
    "Membership ID": "object",
    "Net Value": "float64",
    "Order No": "object",
    "Payment Lines Count": "int64",
    "Receipt Number": "int64",
    "Staff ID": "int64",
    "Staff Name": "object",
    "Staff Phone": "float64",
    "Sub Document Type": "object",
    "Trx Date": "object",
    "Trx Month": "object",
    "Trx Status": "object",
    "Trx Time": "datetime64[ns]",
    "Trx Type": "object",
  }
    usecols =  [
    "Customer ID",
    "Customer Name",
    "DeliveryNo",
    "Discount Value",
    "Document Type",
    "Indirect Customer",
    "Insurance Approval",
    "Insurance Type",
    "Item Lines Count",
    "Items",
    "Location",
    "Loyalty Customer ID",
    "Loyalty Name",
    "Loyalty Phone",
    "Membership ID",
    "Net Value",
    "Order No",
    "Payment Lines Count",
    "Receipt Number",
    "Staff ID",
    "Staff Name",
    "Staff Phone",
    "Sub Document Type",
    "Trx Date",
    "Trx Month",
    "Trx Status",
    "Trx Time",
    "Trx Type"

  ]
    df = pd.read_excel(file ,
    sheet_name='Headers',  # Specify the sheet name
    dtype=dtypes,         # Specify data types
    usecols=usecols,      # Load only necessary columns
    engine='openpyxl' ,
    skiprows=[1]   # Use the openpyxl engine
    )
    return df      

