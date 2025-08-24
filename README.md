# 🚀 Crypto Portfolio Application

A full-stack cryptocurrency portfolio management application built with modern technologies, featuring real-time trading, portfolio analytics, and professional-grade user experience.

![Crypto Portfolio](https://img.shields.io/badge/Crypto-Portfolio-blue?style=for-the-badge&logo=bitcoin)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### 🔐 **Authentication & Security**
- **User Registration & Login**: Secure account creation and authentication
- **JWT Token Management**: Stateless authentication with automatic token handling
- **Password Security**: Secure password storage and validation
- **Session Management**: Automatic authentication state checking

### 📊 **Portfolio Management**
- **Real-time Portfolio Overview**: Live tracking of total portfolio value
- **Performance Analytics**: Color-coded performance indicators
  - 🟢 **Green**: Positive performance and gains
  - 🔴 **Red**: Negative performance and losses
- **Asset Breakdown**: Detailed view of all cryptocurrency holdings
- **Cash Management**: Track available funds and total investments

### 💰 **Trading Features**
- **Buy Cryptocurrencies**: Purchase assets with available cash
- **Sell Holdings**: Liquidate your cryptocurrency positions
- **Real-time Pricing**: Live market prices from Binance API
- **Transaction History**: Complete record of all trades
- **Portfolio Rebalancing**: Easy asset management

### 🎨 **User Experience**
- **Professional Dashboard**: Modern, responsive interface
- **Interactive Modals**: Clean forms for trading and fund management
- **Real-time Updates**: Portfolio refreshes after each action
- **Responsive Design**: Works seamlessly on all devices
- **Loading States**: Professional loading indicators and error handling

## 🛠️ Tech Stack

### **Backend (FastAPI)**
- **FastAPI**: High-performance, modern Python web framework
- **SQLAlchemy**: Powerful ORM for database operations
- **SQLite**: Lightweight, serverless database
- **JWT**: JSON Web Token authentication
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for production deployment

### **Frontend (React + TypeScript)**
- **React 19**: Latest React with modern hooks and patterns
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Lightning-fast build tool and dev server
- **CSS3**: Custom styling with modern CSS features
- **Responsive Design**: Mobile-first approach

### **APIs & External Services**
- **Binance API**: Real-time cryptocurrency price data
- **RESTful API**: Clean, REST-compliant backend endpoints
- **CORS Support**: Cross-origin request handling

### **Development Tools**
- **ESLint**: Code quality and consistency
- **TypeScript Compiler**: Static type checking
- **Hot Reload**: Instant development feedback

## 🚀 Getting Started

### **Prerequisites**
- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Git** for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Crpyto-Portfolio
   ```

2. **Set up the backend**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv myenv
   
   # Activate virtual environment
   # On Windows:
   myenv\Scripts\activate
   # On macOS/Linux:
   source myenv/bin/activate
   
   # Install dependencies
   pip install fastapi uvicorn sqlalchemy requests python-jose[cryptography] python-multipart
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

### **Running the Application**

1. **Start the backend server**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📖 Usage Guide

### **First Time Setup**
1. **Register** a new account with username and password
2. **Login** with your credentials
3. **Add money** to your portfolio to start trading

### **Portfolio Management**
1. **View Overview**: See total portfolio value, performance, and available cash
2. **Monitor Assets**: Track individual cryptocurrency holdings
3. **Performance Tracking**: Monitor gains/losses with color-coded indicators

### **Trading Cryptocurrencies**
1. **Buy Assets**:
   - Click "Buy Asset" button
   - Enter cryptocurrency symbol (e.g., BTC, ETH, ADA)
   - Specify quantity to purchase
   - Confirm transaction

2. **Sell Assets**:
   - Click "Sell" button on any asset card
   - Enter quantity to sell
   - Confirm transaction

### **Adding Funds**
1. Click "Add Money" button
2. Enter the amount you want to deposit
3. Confirm the transaction

## 🔌 API Endpoints

### **Authentication**
```http
POST /register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=string&password=string
```

### **Portfolio Management**
```http
GET /portfolio
Authorization: Bearer <jwt_token>

# Returns portfolio data with assets and performance
```

```http
POST /add_money
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": number
}
```

### **Trading Operations**
```http
POST /buy
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "symbol": "string",
  "quantity": number
}
```

```http
POST /sell
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "symbol": "string",
  "quantity": number
}
```

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);
```

### **Portfolios Table**
```sql
CREATE TABLE portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_added_money DECIMAL(15,2) DEFAULT 0,
    available_money DECIMAL(15,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### **Assets Table**
```sql
CREATE TABLE assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    symbol VARCHAR NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
);
```

### **Transactions Table**
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    symbol VARCHAR NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
);
```

## 🔒 Security Features

- **JWT Authentication**: Secure, stateless authentication
- **Password Security**: Secure password handling
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation for all inputs
- **Token Expiration**: Automatic token management
- **Secure Headers**: Proper security headers implementation

## ⚡ Performance Features

- **Real-time Updates**: Portfolio refreshes after each action
- **Live Pricing**: Real-time cryptocurrency prices from Binance
- **Optimized Queries**: Efficient database operations
- **FastAPI Performance**: High-performance API responses
- **Responsive UI**: Smooth interactions and animations

## 🎯 Key Components

### **Frontend Components**
- **App.tsx**: Main application router and state management
- **Dashboard.tsx**: Portfolio overview and trading interface
- **Login.tsx**: User authentication form
- **Register.tsx**: User registration form
- **api.ts**: API service layer with TypeScript interfaces

### **Backend Structure**
- **main.py**: FastAPI application with all endpoints
- **models.py**: SQLAlchemy database models
- **schemas.py**: Pydantic data validation schemas
- **crypto_portfolio.db**: SQLite database file

## 🚀 Deployment

### **Backend Deployment**
```bash
# Install production dependencies
pip install fastapi uvicorn sqlalchemy

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Serve static files
npm run preview
```

## 🧪 Testing

### **Backend Testing**
```bash
cd backend
python -m pytest
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain consistent code formatting
- Write comprehensive tests
- Update documentation for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/crypto-portfolio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/crypto-portfolio/discussions)
- **Email**: support@cryptoportfolio.com

## 🔮 Roadmap

### **Phase 2 Features**
- [ ] Advanced charting and analytics
- [ ] Portfolio rebalancing tools
- [ ] Tax reporting and calculations
- [ ] Multi-currency support
- [ ] Mobile application

### **Phase 3 Features**
- [ ] Social trading features
- [ ] Advanced order types
- [ ] Portfolio sharing
- [ ] API rate limiting
- [ ] WebSocket real-time updates

## ⚠️ Disclaimer

This application is for **educational and demonstration purposes**. Cryptocurrency trading involves significant risk. Always:
- Do your own research
- Never invest more than you can afford to lose
- Consider consulting with financial advisors
- Be aware of tax implications

## 🙏 Acknowledgments

- **FastAPI** team for the excellent framework
- **React** team for the amazing frontend library
- **Binance** for providing cryptocurrency price data
- **Open source community** for various libraries and tools

---

**Made with ❤️ by the Crypto Portfolio Team**

*Last updated: December 2024*

