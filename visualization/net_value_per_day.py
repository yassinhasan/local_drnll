import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import seaborn as sns

# Function to generate a plot of Net Value per day
def net_value_per_day(df):
    # Correct format string
    correct_format = "%d/%m/%Y"
# Convert to datetime
    df['Trx Date'] = pd.to_datetime(df['Trx Date'])
    df = df.set_index('Trx Date')
    net = df.groupby(df.index)['Net Value'].sum()
    plt.figure(figsize=(14, 10))
    plt.plot(net.index, net.values, marker='o')
    plt.title("Net Value per Day")
    plt.xlabel("Date")
    plt.ylabel("Net Value")
    plt.grid(True)
    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode("utf8")
    plt.close()
    return {"plot_url": plot_url}
