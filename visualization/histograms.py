import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import seaborn as sns

# Function to generate a histogram of Net Value
def net_value_histogram(df):
    df['Net Value'] = pd.to_numeric(df['Net Value'], errors='coerce')
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
    return {'plot_url': plot_url}