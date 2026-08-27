"""Farmer Connect CLI application."""

from __future__ import annotations

import json
from dataclasses import dataclass, asdict
from pathlib import Path

DATA_PATH = Path(__file__).parent / "farmer_connect_data.json"


@dataclass
class Farmer:
    name: str
    location: str
    crop: str
    quantity_kg: int


@dataclass
class Buyer:
    name: str
    location: str
    crop_needed: str
    quantity_kg: int


def load_data() -> dict:
    if DATA_PATH.exists():
        return json.loads(DATA_PATH.read_text(encoding="utf-8"))
    return {"farmers": [], "buyers": []}


def save_data(data: dict) -> None:
    DATA_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")


def add_farmer(data: dict) -> None:
    print("\nAdd Farmer")
    farmer = Farmer(
        name=input("Name: ").strip(),
        location=input("Location: ").strip(),
        crop=input("Crop: ").strip(),
        quantity_kg=int(input("Quantity (kg): ").strip()),
    )
    data["farmers"].append(asdict(farmer))
    save_data(data)
    print("Farmer saved.\n")


def add_buyer(data: dict) -> None:
    print("\nAdd Buyer")
    buyer = Buyer(
        name=input("Name: ").strip(),
        location=input("Location: ").strip(),
        crop_needed=input("Crop needed: ").strip(),
        quantity_kg=int(input("Quantity needed (kg): ").strip()),
    )
    data["buyers"].append(asdict(buyer))
    save_data(data)
    print("Buyer saved.\n")


def list_entries(data: dict) -> None:
    print("\nFarmers:")
    if not data["farmers"]:
        print("  No farmers added yet.")
    for farmer in data["farmers"]:
        print(
            f"  {farmer['name']} | {farmer['location']} | {farmer['crop']} |"
            f" {farmer['quantity_kg']} kg"
        )

    print("\nBuyers:")
    if not data["buyers"]:
        print("  No buyers added yet.")
    for buyer in data["buyers"]:
        print(
            f"  {buyer['name']} | {buyer['location']} | {buyer['crop_needed']} |"
            f" {buyer['quantity_kg']} kg"
        )
    print("")


def match_supply(data: dict) -> None:
    print("\nMatches:")
    matches = []
    for farmer in data["farmers"]:
        for buyer in data["buyers"]:
            if farmer["crop"].lower() == buyer["crop_needed"].lower():
                matches.append((farmer, buyer))

    if not matches:
        print("  No matches found yet. Add farmers and buyers with the same crop.")
    else:
        for farmer, buyer in matches:
            print(
                "  Match:"
                f" Farmer {farmer['name']} ({farmer['location']}) can supply"
                f" {farmer['quantity_kg']} kg of {farmer['crop']} to"
                f" Buyer {buyer['name']} ({buyer['location']})"
                f" needing {buyer['quantity_kg']} kg."
            )
    print("")


def main() -> None:
    data = load_data()
    menu = (
        "Farmer Connect\n"
        "1. Add farmer\n"
        "2. Add buyer\n"
        "3. List farmers and buyers\n"
        "4. Match supply with demand\n"
        "5. Exit\n"
    )

    while True:
        print(menu)
        choice = input("Select an option: ").strip()
        if choice == "1":
            add_farmer(data)
        elif choice == "2":
            add_buyer(data)
        elif choice == "3":
            list_entries(data)
        elif choice == "4":
            match_supply(data)
        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please select 1-5.\n")


if __name__ == "__main__":
    main()
