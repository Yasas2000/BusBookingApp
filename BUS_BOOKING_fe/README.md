
# Online Bus Ticket Booking System (starter template)

This is just a starter template containing Navbar, Footer, and Theme Switcher Section. And also installed the required resources like react icons, framer motion, and other basic requirements.



## Installation

Install with npm

Clone the project

```bash
  git clone https://github.com/gtech-official08/bus-ticket-booking-setup.git
```

Remove `.git` an `README.md` if you want to push this repo on your github.com.

Go to the project directory

```bash
  cd my-project
```

Install dependencies

``` bash
npm install
```
OR 

```bash
npm i
```

Start the server

``` bash
npm run dev
```

If you want to see live project on your mobile or other local machine with same wifi connection.

```bash
npm run dev -- --host
```


## Usages

Don't forgot to insert this code on `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
}
```

To Enable `Dark & Light Mode` in the system.


## Features

- Light/dark mode toggle
- Live Seat booking
- Live Price Calculate
- Animation (framer motion)


## Tech Stack

**Client:** ReactJs, ViteJs, TailwindCSS


