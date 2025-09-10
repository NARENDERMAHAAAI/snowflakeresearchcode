import pandas as pd
"""
Analyzes a plant dataset from 'plants_table_5000.csv' and writes a summary report to 'plants_table_5000_analysis.txt'.

The analysis includes:
- Basic dataset information (row and column counts, column names)
- Summary statistics for numeric columns
- Top 10 most common plant names
- Top 5 most common regions
- Average health score by plant category
- Correlation between health score and AI growth index
- Top 5 plants by yield prediction (including plant ID, name, yield prediction, and market price)

Outputs:
    plants_table_5000_analysis.txt: A text file containing the analysis results.

Dependencies:
    pandas
"""

# Load the data
df = pd.read_csv('plants_table_5000.csv')

# Basic info
with open('plants_table_5000_analysis.txt', 'w') as f:
    f.write('MahaaAi Plants Table 5000 Analysis\n')
    f.write('='*40 + '\n')
    f.write(f'Total rows: {len(df)}\n')
    f.write(f'Total columns: {len(df.columns)}\n')
    f.write('\nColumn Names:\n')
    f.write(', '.join(df.columns) + '\n\n')

    # Summary statistics for numeric columns
    f.write('Summary Statistics (Numeric Columns):\n')
    f.write(df.describe().to_string())
    f.write('\n\n')

    # Most common plant names
    f.write('Top 10 Most Common Plant Names:\n')
    f.write(df['Plant_Name'].value_counts().head(10).to_string())
    f.write('\n\n')

    # Most common regions
    f.write('Top 5 Most Common Regions:\n')
    f.write(df['Region'].value_counts().head(5).to_string())
    f.write('\n\n')

    # Average Health Score by Plant Category
    f.write('Average Health Score by Category:\n')
    f.write(df.groupby('Category')['Health_Score'].mean(
    ).sort_values(ascending=False).to_string())
    f.write('\n\n')

    # Correlation between Health Score and AI Growth Index
    corr = df['Health_Score'].corr(df['AI_Growth_Index'])
    f.write(
        f'Correlation between Health Score and AI Growth Index: {corr:.2f}\n')
    f.write('\n')

    # Top 5 plants by Yield Prediction
    f.write('Top 5 Plants by Yield Prediction:\n')
    top_yield = df.sort_values('Yield_Prediction', ascending=False).head(5)
    f.write(top_yield[['Plant_ID', 'Plant_Name',
            'Yield_Prediction', 'Market_Price']].to_string(index=False))
    f.write('\n')

print('Analysis complete. Results saved to plants_table_5000_analysis.txt')
