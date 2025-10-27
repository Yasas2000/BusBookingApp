# BusEase: Intelligent Route & Seat Reservation System

BusEase is a modern web-based platform designed to simplify and digitize the process of highway bus booking. It allows users to search for available routes, check real-time seat availability, book tickets, and make secure online payments. The system also provides an admin panel for bus operators to manage routes, buses, schedules, and bookings.

 ### User Side

- Route search by source, destination, and travel date
- **Multileg route search** (suggests shortest combinations of buses if no direct route is found)
- Real-time seat availability
- Interactive seat layout with selection
- Secure online payment integration (Stripe)
- Booking confirmation via email (ticket)
- Booking history dashboard


 ### Admin Side
- Admin login with role-based access
- Add/edit/delete routes, buses, and schedules
- Configure seat layouts per bus
- View passenger lists per trip
- Booking analytics dashboard

 ### Tech Stack

-	Frontend  - React.js, Axios, CSS, Redux, Tailwind CSS      
-	Backend    - Node.js, Express.js       
-	Database   - MongoDB + Mongoose        
-	Payments   - Stripe API                
-	Hosting    - Vercel (Frontend, Backend), MongoDB Atlas (DB) 

 1. Clone the Repository
```bash
git clone https://github.com/Yasas2000/BusBookingApp.git
cd BusBookingApp
```
2. Frontend Setup
```bash
cd Frontend
npm install
```

Create a .env file in /Frontend with the following variables:

for front end env
```bash
VITE_APP_API_PROTOCOL=http
VITE_APP_API_HOST=localhost
VITE_APP_API_PORT=4000
```
Then run: 
```bash
npm run dev
```

2. Backend Setup
```bash
cd ../Backend
npm install
```

Create a .env file in /Backend with the following variables:

for back end env
```bash
MONGO_URI = 
JWT_SECRET = 
REFRESH_SECRET = 
FRONTEND_URL=http://localhost:5000
STRIPE_SECRET_KEY=
SUCCESS_URL = http://localhost:5000/payment/success?session_id={CHECKOUT_SESSION_ID}
CANCEL_URL = http://localhost:5000/cart
TICKET_IMAGE = https://www.shutterstock.com/image-vector/bus-ticketpublic-transport-side-view-600nw-2418862123.jpg
EMAIL_USER=
EMAIL_PASSWORD=
```

Run the backend:
```bash
  npm run dev
```
```bash
#keys and secrets you have to use tour own ones

•Use this for testing:
Card Number: 4242 4242 4242 4242
Expiry Date: any future date
CVC: any 3 digits
ZIP: any 5 digits



•	Bookings must be paid at least 3 hours before the trip starts.
•	If not paid within 1 hour of selection, the booking will be auto-cancelled and the seat released.
•	After successful payment, users receive their ticket by email.

Security & Validation
•	JWT-based authentication and route protection
•	Password hashing with bcrypt
•	Role-based access (user/admin)
•	Stripe for secure, PCI-compliant payments

 Testing
•	Postman used for API testing
•	Manual tests for seat-locking and booking flow
•	Live testing with multiple browser sessions for real-time logic

 Future Enhancements
•	GPS tracking of buses
•	SMS  notifications
•	Multilingual UI
•	AI-based route suggestions

All Rights Reserved
#Owner
Maleesha Piyumani
Faculty of Computing
University of Plymouth
maleeshapiyumani@gmail.com
```
- Sample Images

<img width="1117" height="665" alt="7" src="https://github.com/user-attachments/assets/325f31be-76b9-492d-9402-3a58b9a4d329" />
<img width="825" height="815" alt="8" src="https://github.com/user-attachments/assets/eea5642b-d68f-4871-98ca-1be93fb278d9" />
<img width="1917" height="818" alt="1" src="https://github.com/user-attachments/assets/ca56ea2e-50f9-4c37-a485-0b838119988b" />
<img width="1918" height="822" alt="2" src="https://github.com/user-attachments/assets/499869d7-a916-43d6-b73c-fc9d18167d28" />
<img width="1912" height="741" alt="3" src="https://github.com/user-attachments/assets/8505ab0c-027c-48a8-90f7-736f31f465f4" />
<img width="1918" height="652" alt="5" src="https://github.com/user-attachments/assets/e8fe2148-6a8b-47b1-a636-3d5eac10ede2" />
<img width="1836" height="868" alt="6" src="https://github.com/user-attachments/assets/d2f2b6b8-ee05-4ac8-831b-c4223d03ad0d" />






