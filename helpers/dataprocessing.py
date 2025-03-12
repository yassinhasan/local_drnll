import pandas as pd

# Helper function to prepare DataFrame from JSON data
def preapreDF(json_data):
    headers = json_data[0]  # First row contains headers
    # Create DataFrame with headers as column names
    df = pd.DataFrame(json_data[2:], columns=headers)
    return df

# Helper function to process each chunk of data
def process_chunk(chunk):
    """
    Process each chunk of data.
    :param chunk: pandas.DataFrame chunk.
    :return: Processed pandas.DataFrame chunk.
    """
    chunk['Net Value'] = pd.to_numeric(chunk['Net Value'], errors='coerce') 
    return chunk