# BusEase: Intelligent Route & Seat Reservation System

BusEase is a modern web-based platform designed to simplify and digitize the process of highway bus booking. It allows users to search for available routes, check real-time seat availability, book tickets, and make secure online payments. The system also provides an admin panel for bus operators to manage routes, buses, schedules, and bookings.

 ### User Side
  
-	Route search by source, destination, and date.
-	Multileg Search results (Give all posiible options between 2 points).
-	Real-time seat availability.
-	Interactive seat selection UI.
-	Secure online payment (Stripe).
-	Booking history dashboard.

 ### Admin Side
-	Admin login & role-based access
-	Route, bus, and schedule management
-	Booking analytics and passenger lists
-	Seat layout configuration per bus

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
1. Frontend Setup
Create a .env file in /Frontend with the following variables:

for front end env

VITE_APP_API_PROTOCOL=http
VITE_APP_API_HOST=localhost
VITE_APP_API_PORT=4000

2. Backend Setup
Create a .env file in /Backend with the following variables:

for back end env

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

#keys and secrets you have to use tour own ones

•	Use test card numbers provided by Stripe for payment testing (Use Expire Date and CVV any number)
 4242 4242 4242 4242

•	Bookings must be paid at least 3 hours before the trip starts.
•	If not paid within 1 hour of selection, the booking will be auto-cancelled and the seat released.
•	
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
•	Mobile App (React Native)
•	GPS tracking of buses
•	SMS  notifications
•	Multilingual UI
•	AI-based route suggestions
Author
Horagala Piyumani (10908162)
NSBM Green University
Final Year Individual Project 
Supervisor: Dr. Shafraz 

