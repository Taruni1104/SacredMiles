"""Small intermediate itinerary helper.

Usage:
    python python/itinerary_helper.py --days 7 --state "Uttar Pradesh"

The web app remains independent of Python. This script is useful for testing
planning rules before they are moved into a Node service.
"""

import argparse
import json
import re
from pathlib import Path


def load_destinations():
    source = Path(__file__).parents[1] / "lib" / "data.js"
    records = []
    for line in source.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line.startswith("{ id:"):
            continue
        values = {}
        for field in ("id", "name", "state", "type", "description"):
            match = re.search(rf"{field}: ['\"](.*?)['\"]", line)
            if match:
                values[field] = match.group(1)
        if values.get("id"):
            records.append(values)
    return records


def create_itinerary(days, state):
    destinations = load_destinations()
    if state != "All India":
        destinations = [item for item in destinations if item.get("state") == state]

    result = []
    for day, destination in enumerate(destinations[:days], start=1):
        result.append(
            {
                "day": day,
                "location": destination["name"],
                "description": destination.get("description", ""),
                "activities": [
                    {"time": "08:00 AM", "activity": f"Travel to {destination['name']}"},
                    {"time": "10:00 AM", "activity": "Check-in and refresh"},
                    {"time": "04:00 PM", "activity": f"Visit {destination['name']}"},
                    {"time": "08:00 PM", "activity": "Dinner and rest"},
                ],
            }
        )
    return result


def main():
    parser = argparse.ArgumentParser(description="Generate a simple Yatra itinerary.")
    parser.add_argument("--days", type=int, default=7)
    parser.add_argument("--state", default="All India")
    args = parser.parse_args()
    if not 3 <= args.days <= 48:
        parser.error("--days must be between 3 and 48")
    print(json.dumps(create_itinerary(args.days, args.state), indent=2))


if __name__ == "__main__":
    main()
