const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "raaz_super_secret_key_2026";
const dbPath = path.join(__dirname, 'database', 'db.json');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'vehicle-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = allowed.test(file.mimetype);
        if (extOk && mimeOk) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPG, PNG, WEBP, GIF) are allowed.'));
        }
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve uploaded images as static files
app.use('/api/uploads', express.static(uploadsDir));
app.use('/uploads', express.static(uploadsDir)); // Keep for backwards compatibility

// Database Access helpers
function readDB() {
    try {
        const raw = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        console.error("Database read error:", e);
        return { vehicles: [], inquiries: [], sales: [], staff: [], categories: [], settings: {}, activity_logs: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error("Database write error:", e);
    }
}

function addActivityLog(text) {
    const data = readDB();
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getDate()).padStart(2, '0') + ' ' + 
                    String(now.getHours()).padStart(2, '0') + ':' + 
                    String(now.getMinutes()).padStart(2, '0');
    
    data.activity_logs.unshift({ text, date: dateStr });
    writeDB(data);
}

// Token security validation middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied: Session token is missing." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Access Denied: Session has expired or is invalid." });
        }
        req.user = decoded;
        next();
    });
}

// Role checking guard helper
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access Denied: Unauthorized security role privilege." });
        }
        next();
    };
}


// ==============================================
// 1. AUTHENTICATION ROUTERS
// ==============================================
app.post('/api/auth/login', (req, res) => {
    const { email, passwordHash } = req.body;
    
    const secureHashes = {
        admin: "3f984670b64bfdce6af311c41e8f038e8007ca5378b231fd8ae550677c896095",
        manager: "2e064c30dfe840ff76432c401a0d0c19f0b30d823f60fd378353a6a63e431e75",
        staff: "7448477c642e607e214fc8f12e1e68389c59f142459fea8c074b324acb553100"
    };

    let role = null;
    let name = "";
    const lowerEmail = email.toLowerCase().trim();

    if ((lowerEmail === 'raazautocenter@gmail.com' || lowerEmail === 'saroj@raazauto.com') && passwordHash === secureHashes.admin) {
        role = 'admin';
        name = "Raaz";
    } else if ((lowerEmail === 'manager@raazauto.com' || lowerEmail === 'sabin@raazauto.com') && passwordHash === secureHashes.manager) {
        role = 'manager';
        name = "Sabin Shrestha";
    } else if ((lowerEmail === 'staff@raazauto.com' || lowerEmail === 'niraj@raazauto.com') && passwordHash === secureHashes.staff) {
        role = 'staff';
        name = "Niraj Thapa";
    }

    if (role) {
        const token = jwt.sign({ email: lowerEmail, role, name }, JWT_SECRET, { expiresIn: '12h' });
        addActivityLog(`${name} logged in to administration console.`);
        res.json({ success: true, token, user: { name, email: lowerEmail, role } });
    } else {
        res.status(401).json({ success: false, message: "Authentication failed. Invalid email or security passkey." });
    }
});


// ==============================================
// 2. VEHICLE CATALOG ENDPOINTS (CRUD)
// ==============================================
app.get('/api/vehicles', (req, res) => {
    const data = readDB();
    const { brand, category, status, search } = req.query;
    
    let filtered = [...data.vehicles];

    if (brand) {
        filtered = filtered.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
    }
    if (category) {
        filtered = filtered.filter(v => v.category.toLowerCase() === category.toLowerCase());
    }
    if (status) {
        filtered = filtered.filter(v => v.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(v => 
            v.brand.toLowerCase().includes(query) || 
            v.name.toLowerCase().includes(query) || 
            v.year.toString().includes(query)
        );
    }

    res.json(filtered);
});

app.get('/api/vehicles/:id', (req, res) => {
    const data = readDB();
    const vehicle = data.vehicles.find(v => v.id === parseInt(req.params.id));
    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404).json({ error: "Vehicle not found." });
    }
});

app.post('/api/vehicles', verifyToken, requireRole(['admin', 'manager']), (req, res) => {
    const data = readDB();
    const newCar = req.body;
    
    const newId = data.vehicles.length > 0 ? Math.max(...data.vehicles.map(v => v.id)) + 1 : 1;
    newCar.id = newId;
    newCar.features = newCar.features || [];
    
    data.vehicles.push(newCar);
    writeDB(data);

    addActivityLog(`${req.user.name} added new vehicle listing: ${newCar.year} ${newCar.brand} ${newCar.name}`);
    res.status(201).json(newCar);
});

app.put('/api/vehicles/:id', verifyToken, requireRole(['admin', 'manager']), (req, res) => {
    const data = readDB();
    const id = parseInt(req.params.id);
    const index = data.vehicles.findIndex(v => v.id === id);

    if (index !== -1) {
        data.vehicles[index] = { ...data.vehicles[index], ...req.body, id };
        writeDB(data);
        addActivityLog(`${req.user.name} updated vehicle details for: ${data.vehicles[index].year} ${data.vehicles[index].brand} ${data.vehicles[index].name}`);
        res.json(data.vehicles[index]);
    } else {
        res.status(404).json({ error: "Vehicle not found in inventory." });
    }
});

app.delete('/api/vehicles/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const data = readDB();
    const id = parseInt(req.params.id);
    const target = data.vehicles.find(v => v.id === id);

    if (target) {
        data.vehicles = data.vehicles.filter(v => v.id !== id);
        writeDB(data);
        addActivityLog(`${req.user.name} deleted vehicle: ${target.year} ${target.brand} ${target.name}`);
        res.json({ success: true, message: "Vehicle removed from database." });
    } else {
        res.status(404).json({ error: "Vehicle not found." });
    }
});


// ==============================================
// 3. CUSTOMER INQUIRIES ENDPOINTS
// ==============================================
app.get('/api/inquiries', verifyToken, requireRole(['admin', 'manager', 'staff']), (req, res) => {
    const data = readDB();
    res.json(data.inquiries);
});

app.post('/api/inquiries', (req, res) => {
    const data = readDB();
    const newInq = req.body;
    
    newInq.id = Date.now();
    newInq.status = "New";
    newInq.date = new Date().toISOString().split('T')[0];

    data.inquiries.push(newInq);
    writeDB(data);

    addActivityLog(`New lead inquiry logged by ${newInq.name || newInq.customer} for ${newInq.target}`);
    res.status(201).json(newInq);
});

app.put('/api/inquiries/:id', verifyToken, requireRole(['admin', 'manager', 'staff']), (req, res) => {
    const data = readDB();
    const id = parseInt(req.params.id);
    const index = data.inquiries.findIndex(i => i.id === id);

    if (index !== -1) {
        data.inquiries[index].status = req.body.status;
        writeDB(data);
        addActivityLog(`${req.user.name} updated inquiry lead #${id} status to: ${req.body.status.toUpperCase()}`);
        res.json(data.inquiries[index]);
    } else {
        res.status(404).json({ error: "Inquiry ticket not found." });
    }
});

app.delete('/api/inquiries/:id', verifyToken, requireRole(['admin', 'manager']), (req, res) => {
    const data = readDB();
    const id = parseInt(req.params.id);
    const target = data.inquiries.find(i => i.id === id);

    if (target) {
        data.inquiries = data.inquiries.filter(i => i.id !== id);
        writeDB(data);
        addActivityLog(`${req.user.name} deleted inquiry ticket #${id}`);
        res.json({ success: true, message: "Inquiry deleted." });
    } else {
        res.status(404).json({ error: "Inquiry not found." });
    }
});


// ==============================================
// 4. SALES TRANSACTION HISTORY
// ==============================================
app.get('/api/sales', verifyToken, requireRole(['admin', 'manager', 'staff']), (req, res) => {
    const data = readDB();
    res.json(data.sales);
});

app.post('/api/sales', verifyToken, requireRole(['admin', 'manager']), (req, res) => {
    const data = readDB();
    const newSale = req.body;
    
    newSale.id = Date.now();
    newSale.date = new Date().toISOString().split('T')[0];
    newSale.salesperson = req.user.name;

    data.sales.push(newSale);
    
    // Mark the vehicle as Sold Out in catalog if found
    const vIndex = data.vehicles.findIndex(v => v.brand + " " + v.name === newSale.name || v.year + " " + v.brand + " " + v.name === newSale.name);
    if (vIndex !== -1) {
        data.vehicles[vIndex].status = "Sold Out";
    }

    writeDB(data);
    addActivityLog(`Sale completed: ${newSale.name} transacted to buyer ${newSale.buyer}`);
    res.status(201).json(newSale);
});


// ==============================================
// 5. STAFF CREDENTIALS CONTROL (ADMIN ONLY)
// ==============================================
app.get('/api/staff', verifyToken, requireRole(['admin']), (req, res) => {
    const data = readDB();
    res.json(data.staff);
});

app.post('/api/staff', verifyToken, requireRole(['admin']), (req, res) => {
    const data = readDB();
    const newStaff = req.body;
    
    const newId = data.staff.length > 0 ? Math.max(...data.staff.map(s => s.id)) + 1 : 1;
    newStaff.id = newId;

    data.staff.push(newStaff);
    writeDB(data);

    addActivityLog(`${req.user.name} created login access credentials for: ${newStaff.name}`);
    res.status(201).json(newStaff);
});

app.put('/api/staff/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const data = readDB();
    const id = parseInt(req.params.id);
    const index = data.staff.findIndex(s => s.id === id);

    if (index !== -1) {
        data.staff[index] = { ...data.staff[index], ...req.body, id };
        writeDB(data);
        addActivityLog(`${req.user.name} modified staff permissions profile for: ${data.staff[index].name}`);
        res.json(data.staff[index]);
    } else {
        res.status(404).json({ error: "Staff account not found." });
    }
});

app.delete('/api/staff/:id', verifyToken, requireRole(['admin']), (req, res) => {
    const data = readDB();
    const id = parseInt(req.params.id);
    const target = data.staff.find(s => s.id === id);

    if (target) {
        data.staff = data.staff.filter(s => s.id !== id);
        writeDB(data);
        addActivityLog(`${req.user.name} deleted staff user credential: ${target.name}`);
        res.json({ success: true, message: "Staff user removed from system database." });
    } else {
        res.status(404).json({ error: "Staff user record not found." });
    }
});


// ==============================================
// 6. SYSTEM LOGS & CONFIG SETTINGS
// ==============================================
app.get('/api/logs', verifyToken, requireRole(['admin', 'manager', 'staff']), (req, res) => {
    const data = readDB();
    res.json(data.activity_logs);
});

app.get('/api/settings', (req, res) => {
    const data = readDB();
    res.json(data.settings);
});

app.put('/api/settings', verifyToken, requireRole(['admin', 'manager']), (req, res) => {
    const data = readDB();
    data.settings = { ...data.settings, ...req.body };
    writeDB(data);
    
    addActivityLog(`${req.user.name} updated global dealership metadata fields.`);
    res.json(data.settings);
});


// ==============================================
// 7. CATEGORIES CONTROL
// ==============================================
app.get('/api/categories', (req, res) => {
    const data = readDB();
    res.json(data.categories);
});

app.post('/api/categories', verifyToken, requireRole(['admin', 'manager']), (req, res) => {
    const data = readDB();
    const { name } = req.body;
    
    if (data.categories.includes(name)) {
        return res.status(400).json({ error: "Category folder already exists." });
    }

    data.categories.push(name);
    writeDB(data);
    addActivityLog(`${req.user.name} created category folder: ${name.toUpperCase()}`);
    res.status(201).json(data.categories);
});

app.delete('/api/categories/:name', verifyToken, requireRole(['admin', 'manager']), (req, res) => {
    const data = readDB();
    const catName = req.params.name;

    // Block deletion if catalog has items
    const count = data.vehicles.filter(v => v.category === catName).length;
    if (count > 0) {
        return res.status(400).json({ error: "Access Denied: Category folder contains active vehicles." });
    }

    data.categories = data.categories.filter(c => c !== catName);
    writeDB(data);
    addActivityLog(`${req.user.name} deleted category folder: ${catName.toUpperCase()}`);
    res.json(data.categories);
});


// ==============================================
// 8. IMAGE UPLOAD ENDPOINT
// ==============================================
app.post('/api/upload', verifyToken, requireRole(['admin', 'manager']), upload.array('images', 4), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No image files were uploaded.' });
    }

    const urls = req.files.map(f => `/api/uploads/${f.filename}`);
    addActivityLog(`${req.user.name} uploaded ${req.files.length} vehicle image(s).`);
    res.json({ success: true, urls });
});

// Multer error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File is too large. Maximum size is 10MB per image.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Maximum 4 images allowed per upload.' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});


// Serve static frontend files for Production
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Catch-all route to serve React app for non-API requests
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAAZ AUTO Center API server running on port ${PORT}`);
});
