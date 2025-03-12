from multiprocessing import Pool
import multiprocessing
from flask import Blueprint, current_app, render_template, request
from helpers.auth import handle_logged_in_user, handle_unauthenticated_user, is_user_logged
from helpers.dataprocessing import process_chunk
from helpers.responses import  get_response, json_response
import pandas as pd
from flask_wtf.csrf import generate_csrf
import matplotlib.pyplot as plt
import io
import base64
import seaborn as sns

from visualization.net_value_per_day import net_value_per_day
from visualization.histograms import net_value_histogram
from helpers.dataprocessing import preapreDF

data_bp = Blueprint('data', __name__)


@data_bp.route("/data", methods=['GET'])
def data_page():
    # Generate the CSRF token

    """Handle the data page route."""
    firebase_services = current_app.firebase_services
    database = firebase_services['database']  # Pyrebase DB
    # Check if the user is already logged in
    if is_user_logged():
        return handle_logged_in_user(
            database,
            "data.html",
            "(data)✌Dr.Null" ,
            csrf_token=generate_csrf()
        )
    else:
        return handle_unauthenticated_user(csrf_token=generate_csrf())



# Analyze endpoint
@data_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    df = preapreDF(data)
    
    # Split DataFrame into chunks for parallel processing
    chunk_size = 2000  # Adjust chunk size based on your data
    chunks = [df[i:i + chunk_size] for i in range(0, df.shape[0], chunk_size)]
    
    # Process chunks in parallel using multiprocessing Pool
    process_count = min(4, multiprocessing.cpu_count()) # Ensure it doesn't exceed 4

    with Pool(processes=process_count) as pool:  # Use 4 processes (adjust based on CPU cores)
        results = pool.map(process_chunk, chunks)
    
    # Combine processed chunks back into a single DataFrame
    processed_df = pd.concat(results)
    
    # Perform analysis on the processed DataFrame
    analysis_results = {}
    analysis_results['net_value_histogram_img'] = net_value_histogram(processed_df)['plot_url']
    analysis_results['net_value_per_day_img'] = net_value_per_day(processed_df)['plot_url']
    
    # Return analysis results as JSON
    return json_response({"analysis": analysis_results})


















    # try:
    #  # Ensure the important columns exist in the DataFrame
    #     important_columns = [
    #         'Trx Date', 'Document Type', 'Sub Document Type', 'Staff ID', 'Staff Name',
    #         'Loyalty Name', 'Loyalty Phone', 'Insurance Approval', 'Items', 'Payment Lines Count', 'Net Value','Gross Value'
    #     ]
    #             # Normalize column names to lowercase
        
    #     # Check if all important columns are present
    #     missing_columns = [col for col in important_columns if col not in df.columns]
    #     if missing_columns:
    #         return  error_response(f"Missing important columns: {missing_columns}")
        
    #     # Select only the important columns
    #     df = df[important_columns]

    #     # Clean the data (handle NaT, nulls, etc.)
    #     df = df.where(pd.notnull(df), None)

    #     # Perform analysis
    #     analysis_results = {}

    #     # 1. Summary Statistics
    #     # summary_stats = df.describe().to_dict()
    #     # analysis_results["summary_stats"] = summary_stats

    #     # 2. Visualizations
    #     # Example: Histogram of Gross Value
    #     plt.figure()
    #     df["Net Value"].hist(bins=20)
    #     plt.title("Distribution of Net Value")
    #     img = io.BytesIO()
    #     plt.savefig(img, format="png")
    #     plt.close()
    #     img.seek(0)
    #     plot_url = base64.b64encode(img.getvalue()).decode("utf8")
    #     analysis_results["net_value_histogram"] = plot_url

    #     # 3. Insights
    #     # Example: Top 5 customers by Net Value
    #     top_customers = df.groupby("Loyalty Name")["Net Value"].sum().nlargest(5).to_dict()
    #     analysis_results["top_customers"] = top_customers

    #     analysis_results['total_net_value'] = df['Net Value'].sum()
    #     analysis_results['average_net_value'] = df["Net Value"].mean()
    #     analysis_results['transaction_count'] = df.shape[0]
    #     # Return the analysis results to the frontend
    #     return json_response({"analysis": analysis_results})

    # except Exception as e:
    #     return error_response({"error": str(e)}), 500
# @data_bp.route("/loaddata", methods=['GET'])
# def loaddata():
#     try:
#     # Example usage
#         uid = request.cookies.get('__session')
#         file_path_in_firebase = f'uploads/data/{uid}/Invoices Summary (2024-12-01 to 2025-02-17).xlsx'  # Replace with the actual path in Firebase Storage
#         df = read_file_from_firebase(file_path_in_firebase)
#         print(df.head())
#         df = df.where(pd.notnull(df), None)
#                 # Convert datetime columns to strings
#         for col in df.columns:
#             if pd.api.types.is_datetime64_any_dtype(df[col]):
#                 df[col] = df[col].astype(str)
#         data = df.to_dict(orient='records')  # 'records' returns a list of dictionaries
#         return jsonify({"data": data})
#     except ValueError as e:
#         return jsonify({"error": str(e)}), 400
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



