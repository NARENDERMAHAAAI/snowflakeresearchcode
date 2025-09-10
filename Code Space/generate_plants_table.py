import csv
import random

# Define headers
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

plant_names = [
    ("Tulasi", "Medicinal", "Ocimum tenuiflorum"),
    ("Neem", "Medicinal", "Azadirachta indica"),
    ("Guava", "Fruit", "Psidium guajava"),
    ("Mango", "Fruit", "Mangifera indica"),
    ("Wheat", "Cereal", "Triticum aestivum")
]

soil_types = ["Loamy", "Clay", "Sandy"]
soil_colors = ["Brown", "DarkBrown", "LightBrown"]
water_sources = ["Well", "Canal", "Tank", "River"]

robot_actions = ["Weeding", "Pruning", "Harvest", "Seeding"]

with open("plants_table.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(headers)

    for i in range(1, 51):
        plant = random.choice(plant_names)
        row = [
            i, plant[0], plant[1], plant[2], "India",
            random.randint(30, 400),   # Age
            random.randint(20, 200),   # Height
            random.randint(10, 150),   # Leaves
            random.randint(0, 50),     # Flowers
            random.randint(0, 30),     # Fruits
            round(random.uniform(5.5, 7.5), 1),   # Soil pH
            random.randint(30, 60),    # Moisture %
            random.randint(20, 30),    # Soil Temp
            random.randint(40, 60),    # N
            random.randint(20, 40),    # P
            random.randint(30, 50),    # K
            round(random.uniform(4.5, 6.5), 1),   # Organic
            round(random.uniform(1.0, 2.0), 1),   # EC
            random.choice(soil_types),
            random.choice(soil_colors),
            round(random.uniform(6.5, 7.5), 1),   # Water pH
            random.randint(20, 30),    # Water Temp
            random.randint(70, 100),   # Water Alk
            random.randint(200, 350),  # TDS
            round(random.uniform(0.01, 0.1), 2),  # Salinity
            round(random.uniform(1.0, 3.0), 1),   # Flow rate
            round(random.uniform(5.0, 10.0), 1),  # Usage
            random.choice(["Good", "Excellent"]),
            random.randint(60, 90),    # Water level
            random.choice(water_sources),
            f"ROB-{i:02d}",
            random.choice(robot_actions),
            random.choice(["Yes", "No"]),
            random.choice(["Yes", "No"]),
            random.randint(70, 90),    # Growth Index
            random.randint(80, 100),   # Health
            round(random.uniform(5.0, 7.0), 1),
            random.randint(30, 40),
            round(random.uniform(10.0, 15.0), 1),
            round(random.uniform(7.0, 10.0), 1),
            random.randint(65, 75),    # Humidity
            random.randint(25, 35),    # Air Temp
            random.randint(700, 900),  # Sunlight
            random.randint(5, 9),      # UV
            random.randint(390, 420),  # CO2
            round(random.uniform(20.0, 22.0), 1),  # O2
            random.randint(3, 6),      # Wind
            random.randint(5, 20),     # Pests
            random.randint(10, 50),    # Yield
            random.randint(10, 100)    # Price
        ]
        writer.writerow(row)

print("✅ plants_table.csv created with 50 rows of sample MahaaAi data")
