# Manufacturing Management System - Frontend Only

A modern, voice-enabled React application for managing manufacturing operations, work orders, and inventory. This is a **frontend-only** implementation with mock data for demonstration purposes.

## Features

- 🎤 **Voice Commands**: Hands-free operation using Web Speech API
- 📊 **Dashboard**: Real-time overview of manufacturing operations
- 🏭 **Manufacturing Orders**: Complete order lifecycle management
- ⚙️ **Work Orders**: Detailed work order tracking and analysis
- 📦 **Stock Management**: Inventory and stock ledger management
- 📋 **Bills of Materials**: Material requirement planning
- 🏢 **Work Centers**: Production center management
- 📈 **Reports**: Comprehensive analytics and reporting
- 🎭 **Mock Data**: Fully functional with realistic demo data

## Technology Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Web Speech API** - Voice recognition and synthesis
- **Mock Data** - No backend required

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Voice Commands

The application supports hands-free operation through voice commands:

### Navigation Commands
- "Go to dashboard"
- "Go to manufacturing orders"
- "Go to work orders"
- "Go to stock ledger"
- "Go to reports"

### Action Commands
- "Create manufacturing order"
- "Create work order"
- "Start manufacturing order"
- "Confirm order"
- "Cancel order"

### Search Commands
- "Search for [term]"

### Help
- "Help" - Shows available voice commands

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   ├── DashboardCard.js
│   │   ├── OrderTable.js
│   │   └── VoiceCommand.js
│   ├── pages/           # Application screens
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── ManufacturingOrders.js
│   │   ├── WorkOrders.js
│   │   ├── BillsOfMaterials.js
│   │   ├── WorkCenter.js
│   │   ├── StockLedger.js
│   │   └── Reports.js
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── manufacturingAPI.js
│   │   ├── workOrderAPI.js
│   │   └── stockAPI.js
│   ├── hooks/           # Custom hooks
│   │   └── useVoiceCommand.js
│   ├── context/         # Global state
│   │   └── AuthContext.js
│   ├── styles/          # Styling
│   │   └── tailwind.css
│   ├── App.js           # Main component
│   └── index.js         # React entry point
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Mock Data Integration

This frontend uses mock data for demonstration purposes. All API calls are simulated with realistic data. The application is fully functional without requiring a backend server.

### Data Sources
- **Manufacturing Orders**: Mock data with realistic order information
- **Work Orders**: Simulated work order tracking data
- **Stock Items**: Sample inventory and stock ledger data
- **Bills of Materials**: Demo material requirement data
- **Work Centers**: Mock production center information

## Browser Support

- Chrome (recommended for voice features)
- Firefox
- Safari
- Edge

**Note**: Voice commands require a modern browser with Web Speech API support.

## Demo Credentials

- User ID: `admin`
- Password: `password`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
