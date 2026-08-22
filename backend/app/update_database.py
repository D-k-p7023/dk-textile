import sqlite3

connection = sqlite3.connect("dk_textile.db")
cursor = connection.cursor()

try:
    cursor.execute(
        "ALTER TABLE products ADD COLUMN video_path VARCHAR"
    )

    connection.commit()

    print("video_path column added successfully")

except sqlite3.OperationalError as error:
    print("Database update:", error)

finally:
    connection.close()