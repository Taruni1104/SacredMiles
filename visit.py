import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta

# Sample data for North India
data = {
    'Day': [
        'Day 1: Arrival in Jammu and Kashmir',
        'Day 2: Amarnath and Vaishno Devi',
        'Day 3: Travel to Kurukshetra, Haryana (Night Travel)',
        'Day 4: Kurukshetra, Haryana',
        'Day 5: Travel to Haridwar, Uttarakhand (Night Travel)',
        'Day 6: Haridwar, Uttarakhand',
        'Day 7: Travel to Badrinath, Uttarakhand (Night Travel)',
        'Day 8: Badrinath, Uttarakhand',
        'Day 9: Travel to Mathura, Uttar Pradesh (Night Travel)',
        'Day 10: Mathura and Vrindavan, Uttar Pradesh',
        'Day 11: Ayodhya, Uttar Pradesh',
        'Day 12: Prayagraj (Prayag), Uttar Pradesh',
        'Day 13: Varanasi (Kasi), Uttar Pradesh',
        'Day 14: Varanasi, Uttar Pradesh',
        'Day 15: Departure to Gaya, Bihar (Night Travel)',
        'Day 16: Gaya, Bihar',
        'Day 17: Travel to Jwalamukhi Temple, Himachal Pradesh (Night Travel)',
        'Day 18: Jwalamukhi Temple, Himachal Pradesh',
        'Day 19: Travel to Sharda Peeth, Pakistan Administered Kashmir (Night Travel)',
        'Day 20: Sharda Peeth, Pakistan Administered Kashmir',
    ],
    'Event': [
        'Arrival in Jammu and transfer to Srinagar, Shankaracharya Temple, Dal Lake, Overnight in Srinagar',
        'Helicopter ride to Amarnath Cave, Vaishno Devi Temple, Overnight in Katra',
        'Departure from Katra to Kurukshetra, Overnight in Kurukshetra',
        'Brahma Sarovar, Bhadrakali Temple, Sannihit Sarovar, Overnight in Kurukshetra',
        'Departure from Kurukshetra to Haridwar, Overnight in Haridwar',
        'Har Ki Pauri for Ganga Aarti, Mansa Devi Temple, Chandi Devi Temple, Overnight in Haridwar',
        'Departure from Haridwar to Badrinath, Overnight in Badrinath',
        'Badrinath Temple, Mana Village, Bheem Pul and Saraswati River, Overnight in Badrinath',
        'Departure from Badrinath to Mathura, Overnight in Mathura',
        'Krishna Janmabhoomi Temple, Dwarkadhish Temple, Banke Bihari Temple, Overnight in Vrindavan',
        'Ram Janmabhoomi, Hanuman Garhi, Overnight in Ayodhya',
        'Triveni Sangam, Anand Bhawan, Overnight in Prayagraj',
        'Kashi Vishwanath Temple, Sarnath, Overnight in Varanasi',
        'Assi Ghat, Dashashwamedh Ghat, Durga Temple, Tulsi Manas Temple, Bharat Mata Temple, Overnight in Varanasi',
        'Departure from Varanasi to Gaya, Overnight in Gaya',
        'Mahabodhi Temple in Bodh Gaya, Vishnupad Temple, Mangla Gauri Temple, Overnight in Gaya',
        'Departure from Gaya to Jwalamukhi, Overnight in Jwalamukhi',
        'Jwalamukhi Temple, Overnight in Jwalamukhi',
        'Departure from Jwalamukhi to Sharda Peeth, Overnight in Muzaffarabad',
        'Sharda Peeth, Overnight in Muzaffarabad',
    ]
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Add a Date column starting from a given start date
start_date = datetime(2024, 7, 1)
df['Date'] = [start_date + timedelta(days=i) for i in range(len(df))]

# Plot the data
fig, ax = plt.subplots(figsize=(15, 10))

# Plot each event
for idx, row in df.iterrows():
    ax.plot([row['Date'], row['Date']], [0, 1], color='skyblue', lw=2)
    ax.text(row['Date'], 1.05, row['Day'], rotation=45, ha='right', fontsize=10)
    ax.text(row['Date'], -0.1, row['Event'], rotation=90, va='top', fontsize=8, color='darkblue')

# Formatting
ax.xaxis.set_major_locator(mdates.DayLocator(interval=1))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
plt.setp(ax.get_xticklabels(), rotation=45, ha='right')
ax.set_yticks([])
ax.set_yticklabels([])
ax.set_xlim([start_date - timedelta(days=1), df['Date'].max() + timedelta(days=1)])
ax.set_ylim([-1, 2])
ax.set_title('Travel Itinerary Timeline - North India', fontsize=16)

plt.tight_layout()
plt.show()
