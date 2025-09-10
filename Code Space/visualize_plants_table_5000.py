import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the data
df = pd.read_csv('plants_table_5000.csv')

# Set style
sns.set(style="whitegrid")

# 1. Distribution of Health Score
plt.figure(figsize=(8, 5))
sns.histplot(df['Health_Score'], bins=30, kde=True, color='green')
plt.title('Distribution of Health Score')
plt.xlabel('Health Score')
plt.ylabel('Count')
plt.tight_layout()
plt.savefig('health_score_distribution.png')
plt.close()

# 2. Average Health Score by Plant Category
plt.figure(figsize=(10, 6))
cat_means = df.groupby('Category')['Health_Score'].mean().sort_values()
sns.barplot(x=cat_means.values, y=cat_means.index, palette='viridis')
plt.title('Average Health Score by Plant Category')
plt.xlabel('Average Health Score')
plt.ylabel('Category')
plt.tight_layout()
plt.savefig('avg_health_by_category.png')
plt.close()

# 3. Correlation Heatmap (selected numeric columns)
numeric_cols = ['Health_Score', 'AI_Growth_Index', 'Yield_Prediction',
                'Market_Price', 'Photosynthesis_Rate', 'Chlorophyll_Level']
plt.figure(figsize=(8, 6))
corr = df[numeric_cols].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('Correlation Heatmap')
plt.tight_layout()
plt.savefig('correlation_heatmap.png')
plt.close()

# 4. Top 10 Most Common Plant Names
plt.figure(figsize=(10, 5))
top_plants = df['Plant_Name'].value_counts().head(10)
sns.barplot(x=top_plants.values, y=top_plants.index, palette='mako')
plt.title('Top 10 Most Common Plant Names')
plt.xlabel('Count')
plt.ylabel('Plant Name')
plt.tight_layout()
plt.savefig('top_10_plant_names.png')
plt.close()

# 5. Yield Prediction vs. Market Price (scatter)
plt.figure(figsize=(8, 6))
sns.scatterplot(x='Yield_Prediction', y='Market_Price', data=df, alpha=0.5)
plt.title('Yield Prediction vs. Market Price')
plt.xlabel('Yield Prediction')
plt.ylabel('Market Price')
plt.tight_layout()
plt.savefig('yield_vs_market_price.png')
plt.close()

print('Visualizations generated and saved as PNG files.')
