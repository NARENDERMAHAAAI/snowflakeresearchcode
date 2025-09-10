import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('plants_table.csv')

st.set_page_config(page_title="Plants Table Dashboard", layout="wide")
st.title("🌱 Plants Table Dashboard")

# Sidebar filters
st.sidebar.header("Filter Data")
columns = df.columns.tolist()

# Example: Filter by category if exists
if 'category' in columns:
    categories = df['category'].unique().tolist()
    selected_categories = st.sidebar.multiselect("Select Category", categories, default=categories)
    df = df[df['category'].isin(selected_categories)]

# Show dataframe
with st.expander("Show Data Table"):
    st.dataframe(df)

# Summary statistics
st.subheader("Summary Statistics")
st.write(df.describe(include='all'))

# Distribution plots for numeric columns
numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns.tolist()
if numeric_cols:
    st.subheader("Distributions")
    col1, col2 = st.columns(2)
    for i, col in enumerate(numeric_cols):
        with (col1 if i % 2 == 0 else col2):
            fig, ax = plt.subplots()
            sns.histplot(df[col], kde=True, ax=ax)
            ax.set_title(f"Distribution of {col}")
            st.pyplot(fig)

# Correlation heatmap
if len(numeric_cols) > 1:
    st.subheader("Correlation Heatmap")
    fig, ax = plt.subplots(figsize=(8, 4))
    sns.heatmap(df[numeric_cols].corr(), annot=True, cmap='coolwarm', ax=ax)
    st.pyplot(fig)

# Top categories by count (if applicable)
if 'category' in columns:
    st.subheader("Top Categories by Count")
    top_cats = df['category'].value_counts().head(10)
    st.bar_chart(top_cats)

st.markdown("---")
st.markdown("Dashboard generated with Streamlit. Customize further as needed!")
