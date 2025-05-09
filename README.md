# **MERN Stack E-Commerce**

This project is an e-commerce clothing platform developed using MERN Stack technologies. Users can browse products, apply filters, search, and view detailed product information. They can also add items to their cart, manage quantities, and complete purchases via Stripe or cash on delivery. The platform includes features like user authentication, order management, and an admin panel for managing products and viewing statistics.



### 🔑 **Features:**

- **Authentication:**
  - Strong and secure authentication.
  - Login with popular service providers.

- **Product Browsing and Management:**
  - View and filter clothing products by category, sub category, and sorting
  - Search for specific products.
  - View detailed product information and customer reviews.
  - Add products to cart in desired sizes.
  - Add ,Edit or delete product reviews.

- **Shopping Cart and Orders:**
  - Manage cart items (increase quantity, remove items).
  - Checkout with payment via Stripe or cash on delivery.
  - View and track orders in the user profile.

- **Admin Dashboard:**
  - Admin can add, update, delete, and list products.
  - Manage customer orders and view detailed order history.
  - Access sales and other statistics with charts and reports.





### 🔨 **Technologies Used:**

### 💻 **Frontend:**
- **React**: JavaScript library for building user interfaces .
- **Sass**: CSS preprocessor for cleaner, more efficient styling.
- **React Icons**: For user interface icons.
- **Tanstack React Query**: Data-fetching library for managing server state and caching.
- **React Hook Form** and **Zod**: Form validation and management.
- **Axios**: Promise-based HTTP client for API requests.
- **Framer Motion**: Animation library for smooth transitions in React.
- **Zustand**: Lightweight state management library for React.
- **React Router Dom**: Routing library for navigation in SPAs.
- **Recharts and React Google Charts**: Libraries for creating interactive data charts.
- **React Helmet**: Manages HTML head tags for better SEO.
- **React Hot Toast**: Switch between dark and light mode.
- **Day.js**: Lightweight library for date manipulation.
- **Clsx**: Utility for conditionally combining class names.
- **React Responsive**: Makes it easier to process breakpoints on react.
- **React Select**: Customizable select input component.
- **IMask**: Input masking for formatting user input.
- **Millify**: Formats large numbers for readability.

### 🌐 **Backend:**
- **Express.js**: Web framework for building Rest APIs in Node.js.
- **Helmet**: Adds security headers to Express apps.
- **Cors**: To manage CORS policies.
- **Express Async Handler**:  Middleware for handling async errors.
- **Stripe**: Payment processing for online transactions.
- **Swagger-jsdoc & Swagger-UI-Express**: Auto-generates API documentation.
- **Passport & Passport Google OAuth**:Authentication middleware with OAuth support.
- **Cookie Parser**: Parses cookies for session management.
- **JWT**: More secure session management with access token and refresh token .
- **MongoDB**: Database system.
- **Redis**: Database that we use to cache data for faster responses and request limiting.
- **Bcryptjs**: For hashing password with encryption algorithm.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary & Multer**: Media hosting and file upload handling.
- **Dotenv**: Loads environment variables for secure app configuration.

### 🌐 **Devops:**
- **Docker** : For application containerization





### Desktop View

<img src="https://github.com/user-attachments/assets/11c450f9-474a-4d38-a0c6-d90527fa4c59" width=500 />
<img src="https://github.com/user-attachments/assets/20679e6c-6b2e-4690-a992-a2371ef74953" width=500 />
<img src="https://github.com/user-attachments/assets/5f8e9b7c-0293-4b80-869b-344a0471563a" width=500 />
<img src="https://github.com/user-attachments/assets/48ef8587-7532-4d0a-a314-99723d090087" width=500 />
<img src="https://github.com/user-attachments/assets/5a6ce9c5-7481-4253-8eb5-ce30a8f39bb6" width=500 />
<img src="https://github.com/user-attachments/assets/c7d26cfb-571f-4fb0-88e6-d3bd33c175ad" width=500 />
<img src="https://github.com/user-attachments/assets/23503dbc-7671-4e1c-9a84-7c3cbab04180" width=500 />





### Mobile View


<img src="https://github.com/user-attachments/assets/92ee38f4-5028-4bcd-8521-734a5fe68647" width=300 />
<img src="https://github.com/user-attachments/assets/02b6e1e6-e9ea-4e33-b794-767dbe8cb763" width=300 />
<img src="https://github.com/user-attachments/assets/b0f365a5-9e42-487d-a3be-f621b886140e" width=300 />
<img src="https://github.com/user-attachments/assets/d408d7d5-f8d7-46d7-b820-0bf54f95dc81" width=300 />
<img src="https://github.com/user-attachments/assets/482e67f2-ee15-4682-a83e-cc483997c8d9" width=300 />











## 🔧 **Setup**

1.**Download the repository**

```
git clone https://github.com/GezerGoktug/MERN-E-commerce.git
```

2.**Enter the project directory**

```
cd MERN-E-commerce
```

3.**Install Required Dependencies for Frontend**

```
cd frontend
npm install
```
4.**Create a mongo db database on mongo db website if it doesn't exist**

You can create your database by opening your account via Mongodb, choosing a free plan and authorizing your IP address to access it.

5.**Create an .env file with the following content in the same directory**

```
VITE_REACT_API_URL = <YOUR_BACKEND_BASE_API_URL> ex: <your_base_url>/api 

VITE_REACT_STRIPE_PUBLISHABLE_KEY = <YOUR_STRIPE_ACCOUNT_PUBLISH_KEY>

```


6.**Go a up directory ,then enter backend directory**

```
cd ..
cd backend
```

7.**Install Required Dependencies for Backend**

```
npm install
```

8.**Create an .env file with the following content in the same directory**

```
MONGO_URI = <YOUR_MONGO_URI>
PORT= <YOUR_BACKEND_RUNNING_PORT>
NODE_ENV = <WORKING_ENVIRONMENT>

CLIENT_URL= <YOUR_FRONTEND_BASE_URL>

JWT_ACCESS_SECRET =  <YOUR_JWT_ACCESS_TOKEN_SECRET_KEY>
JWT_REFRESH_SECRET = <YOUR_JWT_REFRESH_TOKEN_SECRET_KEY>

GOOGLE_CLIENT_ID = <YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET = <YOUR_GOOGLE_CLIENT_SECRET>



STRIPE_SECRET_KEY = <YOUR_STRIPE_ACCOUNT_SECRET_KEY>

CLOUDINARY_CLOUD_NAME = <YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY = <YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET = <YOUR_CLOUDINARY_API_SECRET>

```

9.**Start the application backend directory ,then start the application frontend directory**

```
npm run dev
```
10.**Show in browser**

Go to `http://localhost:3000` in your browser for frontend application.

## 🔧 **Setup with Docker**

**NOTE**: For this process, Docker must be installed on your computer.

1.**Update mongu_urı value your .env file in backend directory**

```
MONGO_URI = "mongodb://mongo-db/<YOUR_DATABASE_NAME>"
...
```
2.**Run docker command**

```
docker compose up -d
```

3.**Show in browser**

Go to `http://localhost:3000` in your browser.



## Contribute 🤝

- You can use the [Issues](https://github.com/GezerGoktug/MERN-E-commerce) tab for bug reports and suggestions.
- If you want to contribute to the project, create a fork and submit a pull request.

