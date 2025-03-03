from datetime import datetime
import time

def check_user_activity(last_access_str):
    """
    Check if the user has been inactive for more than 7 days.

    Args:
        last_access_str (str): The last access time as a string (e.g., "2025-03-01 14:34:26.183706").

    Returns:
        bool: True if the user has been inactive for more than 7 days, False otherwise.
    """
    try:
        # Step 1: Convert last_access string to a datetime object
        last_access = datetime.strptime(last_access_str, "%Y-%m-%d %H:%M:%S.%f")

        # Step 2: Convert last_access datetime to milliseconds
        last_access_ms = int(last_access.timestamp() * 1000)

        # Step 3: Get the current time in milliseconds
        current_time_ms = int(time.time() * 1000)

        # Step 4: Calculate the difference in milliseconds
        time_difference_ms = current_time_ms - last_access_ms

        # Step 5: Convert the difference to days
        time_difference_days = time_difference_ms / (1000 * 60 * 60 * 24)

        # Step 6: Check if the user has been inactive for more than 7 days
        if time_difference_days > 7:
            return False  # User is inactive
        else:
            return True  # User is active
    except Exception as e:
        print(f"Error checking user inactivity: {e}")
        return False  # Default to active if there's an error