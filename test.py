import requests
import threading
import uuid
import random

# Stałe dane
PASSWORD = "TestPassword123!"
URL = "http://localhost:3001/auth/register"

request_counter = 0
lock = threading.Lock()

# Przykładowe imiona i nazwiska do losowania
FIRST_NAMES = ["Anna", "Jan", "Maria", "Piotr", "Katarzyna", "Tomasz", "Ewa", "Marek"]
LAST_NAMES = ["Kowalski", "Nowak", "Wisniewski", "Wojcik", "Kaczmarek", "Mazur", "Krawczyk", "Zielinski"]

def generate_unique_email_login():
    # Generujemy unikalny identyfikator (np. UUID)
    unique_id = uuid.uuid4().hex
    email = f"user{unique_id}@example.com"
    login = f"user{unique_id}"
    return email, login

def send_register_request():
  
    global request_counter
    while request_counter <= 5:
        try:
            email, login = generate_unique_email_login()
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)

            payload = {
                "email": email,
                "password": PASSWORD,
                "firstName": first_name,
                "lastName": last_name,
                "login": login
            }
            response = requests.post(URL, json=payload)
            lock.acquire()
            request_counter+=1
            print(threading.current_thread().name,' ', request_counter)
            lock.release();

            #print(f"Request for {email} returned status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Error sending request for {email}: {e}")

def main():
    threads = []
    num_threads = 10  # liczba zapytań / wątków

    for _ in range(num_threads):
        thread = threading.Thread(target=send_register_request)
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()