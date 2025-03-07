from flask import Blueprint, current_app, render_template, request, jsonify
import requests
from helpers.auth import handle_logged_in_user, is_user_logged
from helpers.files import read_file_from_firebase, read_file_from_request
from helpers.responses import error_response, get_response, json_response
import pandas as pd
import matplotlib.pyplot as plt
import io
import datetime
import base64
import seaborn as sns

data_bp = Blueprint('data', __name__)

@data_bp.route("/data", methods=['GET'])
def data_page():
    """Handle the data page route."""
    firebase_services = current_app.firebase_services
    database = firebase_services['database']  # Pyrebase DB
    # Check if the user is already logged in
    if is_user_logged():
        return handle_logged_in_user(
            database,
            "data.html",
            "(data)✌Dr.Null"
        )
    else:
        isLogged = False
        messages = {
            "type" : "warning" , 
            "msg" : "you shoud login first!",
             "mustLogin" : True
        }
        template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
        return get_response(template)     

@data_bp.route("/analyze", methods=['POST'])
def analyze():
    
    # Get the file path from the request (uploaded by the user)
    if 'file' not in request.files:
            return error_response("No file uploaded")
    # READ THE FILE
    file = request.files['file']
    df = read_file_from_request(file)
    dtypes_dict = df.dtypes.astype(str).to_dict()

    # Perform analysis
    analysis_results = {}
    analysis_results['net_value_histogram_img'] = net_value_histogram(df)
    analysis_results['net_value_per_day_img'] = net_value_per_day(df)['plot_url']
    analysis_results['net_value_per_day_period'] = net_value_per_day(df)['period']
    # Return the analysis results to the frontend
    return json_response({"analysis": analysis_results})

def net_value_histogram(df):
    fig,ax = plt.subplots(2,figsize=(14,10))
    df['Net Value'].hist(ax=ax[0],bins=12)
    ax[0].set_title("Net Value Distribution")
    ax[0].set_xlabel("Net Value")
    ax[0].set_ylabel("Frequency")

    df['Net Value'].plot.box(ax=ax[1],vert=False)
    ax[1].set_title("Net Value Boxplot")
    ax[1].set_xlabel("Net Value")
    ax[1].set_ylabel("Frequency")
    fig.tight_layout()
    imge = io.BytesIO()
    fig.savefig(imge)
    imge.seek(0)
    plot_url = base64.b64encode(imge.getvalue()).decode("utf8")
    fig.figure.clear()
    return plot_url

# get net value for every day 
def net_value_per_day(df):
    # Add columns with year, month, and weekday name
    if  'Trx Date' in df.columns  :
        df = df.set_index('Trx Date')

    df['Year'] = df.index.year
    df['Month'] = df.index.month
    df['Day'] = df.index.day
    df['Weekday Name'] = df.index.day_name()

    net = df.groupby(df.index)['Net Value'].sum()
    sales_merged = pd.merge(net ,  df[['Weekday Name' , 'Month' , 'Day']] , on='Trx Date' ).drop_duplicates()
    # show only 30 days

    sales_merged = sales_merged.head(30)
    x_labels = [f"{row['Day']}-{row['Month']} {row['Weekday Name'][:3]}" for _, row in sales_merged.iterrows()]
    plt.figure(figsize=(14,10))
    plt.plot( range(len( sales_merged['Weekday Name'])) , sales_merged['Net Value'] , marker='o')
    plt.xticks( range(len( sales_merged['Weekday Name'])) ,  x_labels , rotation=90)
    plt.grid(True)
    # show valy on each point
    for i in range(len(sales_merged['Weekday Name'])):
        plt.text(i, sales_merged['Net Value'][i] + 100, f"{sales_merged['Net Value'][i]:,.0f}", ha = 'center')
    start_Day = sales_merged.index[0].strftime('%Y-%m-%d')
    end_day   = sales_merged.index[-1].strftime('%Y-%m-%d')
    plt.title(f"Net Value from {start_Day} to {end_day}")
    plt.xlabel("Weekday")
    plt.ylabel("Net Value")
    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode("utf8")
    plt.close()
    return {"plot_url":plot_url , "period" : f"{start_Day} to {end_day}"}



  
 






























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



