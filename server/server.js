const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./firebase');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;

// --- Middleware ---

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('[DEBUG] Auth Header:', authHeader);
    
    if (!authHeader) {
        console.warn('[DEBUG] No authorization header found');
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('[DEBUG] JWT Verification Failed:', err.message);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        console.log('[DEBUG] JWT Verified for user:', decoded.id);
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Require Admin Role' });
    }
};

// --- Auth Routes ---

app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Signup attempt:', { name, email });
    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email.includes('admin') ? 'Admin' : 'Student';
        
        console.log('Inserting user with role:', role);
        const userRef = await db.collection('users').add({
            name,
            email,
            password: hashedPassword,
            role,
            created_at: new Date().toISOString()
        });

        const token = jwt.sign({ id: userRef.id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log('Signup successful:', email);
        res.json({ success: true, user: { id: userRef.id, name, email, role }, token });
    } catch (err) {
        console.error('Signup error details:', err);
        res.status(500).json({ error: err.message, message: 'Internal server error during signup' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (userSnapshot.empty) return res.status(400).json({ message: 'User not found' });

        const userDoc = userSnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', verifyToken, async (req, res) => {
    const { title, organizer, date, time, location, price, image, description, category, maxCapacity } = req.body;
    try {
        const eventRef = await db.collection('events').add({
            title, 
            organizer, 
            date, 
            time, 
            location, 
            price: parseFloat(price) || 0, 
            image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 
            description, 
            category, 
            maxCapacity: parseInt(maxCapacity) || 0,
            createdBy: req.user.id,
            status: req.user.role === 'Admin' ? 'Approved' : 'Pending',
            created_at: new Date().toISOString()
        });
        res.json({ success: true, eventId: eventRef.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Event Routes ---

app.get('/api/events', async (req, res) => {
    try {
        const snapshot = await db.collection('events').get();
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const doc = await db.collection('events').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: 'Event not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/events/:id', verifyToken, isAdmin, async (req, res) => {
    const { title, organizer, date, time, location, price, image, description, category, maxCapacity } = req.body;
    try {
        await db.collection('events').doc(req.params.id).update({
            title, organizer, date, time, location, 
            price: parseFloat(price), 
            image, description, category, 
            maxCapacity: parseInt(maxCapacity)
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/events/:id', verifyToken, async (req, res) => {
    try {
        const eventDoc = await db.collection('events').doc(req.params.id).get();
        if (!eventDoc.exists) return res.status(404).json({ message: 'Event not found' });
        
        // Only allow creator or admin to delete
        if (eventDoc.data().createdBy !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await db.collection('events').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/events/user/hosted', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('events').where('createdBy', '==', req.user.id).get();
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Registration Routes ---

app.post('/api/registrations', verifyToken, async (req, res) => {
    const { eventId, userId, seats, totalPrice, total } = req.body;
    const finalPrice = totalPrice || total || 0;
    
    console.log('[DEBUG] Registration Body:', req.body);
    console.log('[DEBUG] Authenticated User:', req.user);
    
    // Use the ID from the token if the body doesn't have it
    const finalUserId = userId || req.user.id;
    
    try {
        const registrationData = {
            eventId, 
            userId: finalUserId, 
            seats: parseInt(seats) || 1, 
            totalPrice: parseFloat(finalPrice),
            timestamp: new Date().toISOString()
        };
        
        console.log('[DEBUG] Attempting to save to Firestore:', registrationData);
        
        const regRef = await db.collection('registrations').add(registrationData);
        
        console.log('✅ Registration successful! ID:', regRef.id);
        res.json({ success: true, registrationId: regRef.id });
    } catch (err) {
        console.error('❌ Registration Database Error:', err);
        res.status(500).json({ error: err.message, message: 'Failed to save registration to Firestore' });
    }
});

app.get('/api/registrations/count/:eventId', async (req, res) => {
    try {
        const snapshot = await db.collection('registrations').where('eventId', '==', req.params.eventId).get();
        let totalSeats = 0;
        snapshot.forEach(doc => {
            totalSeats += doc.data().seats || 0;
        });
        res.json({ count: totalSeats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/registrations/user/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('registrations').orderBy('timestamp', 'desc').get();
        const registrations = [];
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const eventDoc = await db.collection('events').doc(data.eventId).get();
            const userDoc = await db.collection('users').doc(data.userId).get();
            
            registrations.push({
                id: doc.id,
                ...data,
                title: eventDoc.exists ? eventDoc.data().title : 'Unknown Event',
                date: eventDoc.exists ? eventDoc.data().date : 'Unknown Date',
                location: eventDoc.exists ? eventDoc.data().location : 'Unknown Location',
                email: userDoc.exists ? userDoc.data().email : 'Unknown Email'
            });
        }
        res.json(registrations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/registrations/user/:userId', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('registrations').where('userId', '==', req.params.userId).get();
        const registrations = [];
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const eventDoc = await db.collection('events').doc(data.eventId).get();
            
            registrations.push({
                id: doc.id,
                ...data,
                title: eventDoc.exists ? eventDoc.data().title : 'Unknown Event',
                date: eventDoc.exists ? eventDoc.data().date : 'Unknown Date',
                location: eventDoc.exists ? eventDoc.data().location : 'Unknown Location'
            });
        }
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Review Routes ---

app.post('/api/reviews', async (req, res) => {
    const { eventId, userId, userName, rating, comment } = req.body;
    try {
        const reviewRef = await db.collection('reviews').add({
            eventId, userId, userName, 
            rating: parseInt(rating), 
            comment,
            timestamp: new Date().toISOString()
        });
        res.json({ success: true, reviewId: reviewRef.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reviews/:eventId', async (req, res) => {
    try {
        const snapshot = await db.collection('reviews')
            .where('eventId', '==', req.params.eventId)
            .get();
            
        const reviews = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reviews/all/manage', verifyToken, isAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('reviews').get();
        const reviews = [];
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const eventDoc = await db.collection('events').doc(data.eventId).get();
            
            reviews.push({
                id: doc.id,
                ...data,
                eventTitle: eventDoc.exists ? eventDoc.data().title : 'Unknown Event'
            });
        }
        
        reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/reviews/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.collection('reviews').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Static Files ---
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// --- Fallback for SPA Routing ---
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
