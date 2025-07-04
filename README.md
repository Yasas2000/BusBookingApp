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
