import csv
import random
import numpy as np
import pandas as pd

# 50 headers aligned with MahaaAi prototype
headers = [
    "Plant_ID", "Plant_Name", "Category", "Scientific_Name", "Region", "Age_Days",
    "Height_cm", "Leaf_Count", "Flower_Count", "Fruit_Count", "Soil_pH",
    "Soil_Moisture", "Soil_Temperature", "Soil_Nutrients_N", "Soil_Nutrients_P",
    "Soil_Nutrients_K", "Organic_Content", "EC_Level", "Soil_Type", "Soil_Color",
    "Water_pH", "Water_Temp", "Water_Alkalinity", "Water_TDS", "Water_Salinity",
    "Water_FlowRate", "Water_Usage", "Water_Quality", "Water_Level", "Water_Source",
    "Robot_ID", "Robot_Action", "Drone_Scan", "AI_Disease_Flag", "AI_Growth_Index",
    "Health_Score", "Photosynthesis_Rate", "Chlorophyll_Level", "Oxygen_Output",
    "Carbon_Absorption", "Humidity", "Air_Temp", "Sunlight_Intensity", "UV_Index",
    "CO2_Level", "O2_Level", "Wind_Speed", "Pest_Count", "Yield_Prediction",
    "Market_Price"
]

# Plant catalog
catalog = [
    ("Tulasi", "Medicinal", "Ocimum tenuiflorum", "India"),
    ("Neem", "Medicinal", "Azadirachta indica", "India"),
    ("Guava", "Fruit", "Psidium guajava", "India"),
    ("Mango", "Fruit", "Mangifera indica", "India"),
    ("Wheat", "Cereal", "Triticum aestivum", "USA"),
    ("Rice", "Cereal", "Oryza sativa", "India"),
    ("Maize", "Cereal", "Zea mays", "USA"),
    ("Turmeric", "Spice", "Curcuma longa", "India"),
    ("Aloe Vera", "Medicinal", "Aloe barbadensis", "UAE"),
    ("Banana", "Fruit", "Musa acuminata", "India"),
    ("Pomegranate", "Fruit", "Punica granatum", "India"),
    ("Cotton", "Fiber", "Gossypium hirsutum", "India"),
    ("Jute", "Fiber", "Corchorus olitorius", "India"),
    ("Tomato", "Vegetable", "Solanum lycopersicum", "USA"),
    ("Potato", "Vegetable", "Solanum tuberosum", "USA"),
]

soil_types = ["Loamy", "Clay", "Sandy", "Silty", "Peaty"]
soil_colors = ["Brown", "DarkBrown", "LightBrown", "Reddish", "Black"]
water_sources = ["Well", "Canal", "Tank", "River", "Reservoir", "Borewell"]
robot_actions = ["Weeding", "Pruning", "Harvest",
                 "Seeding", "Fertilizing", "Spraying", "Soil Scan"]
water_quality_levels = ["Poor", "Fair", "Good", "Very Good", "Excellent"]


def rand_choice_weighted(options, weights):
    return random.choices(options, weights=weights, k=1)[0]


rows = []
for i in range(1, 5001):  # 5000 rows
    plant = random.choice(catalog)

    # Plant base values
    soil_pH = round(np.clip(np.random.normal(6.8, 0.4), 5.0, 8.5), 2)
    water_pH = round(np.clip(np.random.normal(7.2, 0.3), 6.0, 8.5), 2)
    water_tds = int(np.clip(np.random.normal(280, 60), 100, 600))
    organic = round(np.clip(np.random.normal(5.6, 0.8), 2.0, 9.0), 2)
    ec = round(np.clip(np.random.normal(1.3, 0.3), 0.3, 3.0), 2)
    air_temp = int(np.clip(np.random.normal(29, 3), 15, 45))
    humidity = int(np.clip(np.random.normal(70, 6), 40, 95))
    water_quality = rand_choice_weighted(water_quality_levels, [1, 2, 4, 3, 2])

    ai_growth = int(np.clip(
        50
        + (5 if 6.0 <= soil_pH <= 7.5 else -5)
        + (5 if water_quality in ["Very Good", "Excellent"]
           else (-5 if water_quality == "Poor" else 0)),
        0, 100))
    health = int(np.clip(ai_growth + np.random.normal(10, 5), 0, 100))

    row = [
        i, plant[0], plant[1], plant[2], plant[3],             # Plant details
        random.randint(10, 1200),                               # Age_Days
        random.randint(10, 400),                                # Height_cm
        random.randint(5, 300),                                 # Leaf_Count
        random.randint(0, 200),                                 # Flower_Count
        random.randint(0, 100),                                 # Fruit_Count
        soil_pH,
        random.randint(10, 90),                                 # Soil_Moisture
        # Soil_Temperature
        random.randint(10, 45),
        random.randint(20, 90),                                 # Soil_N
        random.randint(10, 70),                                 # Soil_P
        random.randint(10, 90),                                 # Soil_K
        organic,
        ec,
        random.choice(soil_types),
        random.choice(soil_colors),
        water_pH,
        random.randint(10, 40),                                 # Water_Temp
        # Water_Alkalinity
        random.randint(40, 140),
        water_tds,
        # Water_Salinity
        round(random.uniform(0.0, 0.3), 3),
        # Water_FlowRate
        round(random.uniform(0.2, 5.0), 2),
        round(random.uniform(0.5, 20.0), 2),                    # Water_Usage
        water_quality,
        random.randint(10, 100),                                # Water_Level
        random.choice(water_sources),
        f"ROB-{i:05d}",                                         # Robot_ID
        random.choice(robot_actions),                           # Robot_Action
        random.choice(["Yes", "No"]),                            # Drone_Scan
        # AI_Disease_Flag
        random.choice(["Yes", "No"]),
        ai_growth,
        health,
        # Photosynthesis_Rate
        round(random.uniform(3.0, 9.0), 2),
        # Chlorophyll_Level
        random.randint(10, 60),
        round(random.uniform(6.0, 20.0), 2),                    # Oxygen_Output
        # Carbon_Absorption
        round(random.uniform(3.0, 15.0), 2),
        humidity,
        air_temp,
        # Sunlight_Intensity
        random.randint(500, 1100),
        random.randint(1, 12),                                  # UV_Index
        random.randint(360, 480),                               # CO2_Level
        round(random.uniform(19.0, 21.0), 2),                   # O2_Level
        random.randint(0, 15),                                  # Wind_Speed
        random.randint(0, 50),                                  # Pest_Count
        # Yield_Prediction
        random.randint(5, 120),
        random.randint(5, 200),                                 # Market_Price
    ]
    rows.append(row)

# Write to CSV
with open("plants_table_5000.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

print("✅ plants_table_5000.csv created with 5000 rows of sample MahaaAi data")
