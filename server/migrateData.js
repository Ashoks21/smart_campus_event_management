const { db } = require('./firebase');

const sampleEvents = [
    {
        title: 'Tech Fest 2026',
        organizer: 'Coding Club',
        date: 'May 10, 2026',
        time: '10:00 AM - 05:00 PM',
        location: 'Main Auditorium',
        price: 100.00,
        image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=1000',
        description: 'A grand technical festival showcasing innovation, coding competitions, and guest lectures from industry experts.',
        category: 'Technical',
        maxCapacity: 150,
        created_at: new Date().toISOString()
    },
    {
        title: 'Cultural Night',
        organizer: 'Arts & Drama Society',
        date: 'June 15, 2026',
        time: '06:00 PM - 10:00 PM',
        location: 'Open Air Theatre',
        price: 0.00,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
        description: 'A vibrant evening celebrating the diverse cultures on campus through dance, music, and drama performances.',
        category: 'Cultural',
        maxCapacity: 500,
        created_at: new Date().toISOString()
    },
    {
        title: 'Startup Pitch Day',
        organizer: 'EDC Club',
        date: 'July 05, 2026',
        time: '02:00 PM - 06:00 PM',
        location: 'Seminar Hall-B',
        price: 50.00,
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000',
        description: 'Got a business idea? Pitch it to a panel of investors and mentors to win seed funding and incubation support.',
        category: 'Business',
        maxCapacity: 80,
        created_at: new Date().toISOString()
    },
    {
        title: 'Annual Sports Meet',
        organizer: 'Sports Department',
        date: 'August 20, 2026',
        time: '08:00 AM - 06:00 PM',
        location: 'College Ground',
        price: 20.00,
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000',
        description: 'A day filled with energy and sportsmanship. Compete in athletics, football, basketball, and more.',
        category: 'Sports',
        maxCapacity: 300,
        created_at: new Date().toISOString()
    },
    {
        title: 'Robotics Workshop',
        organizer: 'Robotics Club',
        date: 'September 12, 2026',
        time: '10:00 AM - 04:00 PM',
        location: 'Lab 402',
        price: 200.00,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000',
        description: 'Hands-on workshop on building and programming robots using Arduino and Raspberry Pi.',
        category: 'Technical',
        maxCapacity: 50,
        created_at: new Date().toISOString()
    },
    {
        title: 'Photography Exhibition',
        organizer: 'Media Cell',
        date: 'October 05, 2026',
        time: '10:00 AM - 06:00 PM',
        location: 'Art Gallery',
        price: 0.00,
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1000',
        description: 'Showcasing the best clicks from our student photographers capturing campus life and nature.',
        category: 'Cultural',
        maxCapacity: 200,
        created_at: new Date().toISOString()
    },
    {
        title: 'Hackathon 2026',
        organizer: 'Google DSC',
        date: 'November 15, 2026',
        time: '48 Hours',
        location: 'Innovation Hub',
        price: 0.00,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000',
        description: 'A 48-hour hackathon where teams compete to build solutions for real-world problems.',
        category: 'Technical',
        maxCapacity: 120,
        created_at: new Date().toISOString()
    },
    {
        title: 'Music Festival',
        organizer: 'Music Society',
        date: 'December 20, 2026',
        time: '05:00 PM - 11:00 PM',
        location: 'Main Auditorium',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1514525253361-bee8d41dfb7a?q=80&w=1000',
        description: 'An evening of live music performances by bands and solo artists across various genres.',
        category: 'Cultural',
        maxCapacity: 400,
        created_at: new Date().toISOString()
    },
    {
        title: 'Business Case Competition',
        organizer: 'Management Club',
        date: 'January 10, 2027',
        time: '09:00 AM - 05:00 PM',
        location: 'Conference Room',
        price: 100.00,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000',
        description: 'A competition to test your business acumen and problem-solving skills with real-life business cases.',
        category: 'Business',
        maxCapacity: 60,
        created_at: new Date().toISOString()
    }
];

async function migrate() {
    console.log('🚀 Starting migration to Firestore...');
    try {
        const eventsCol = db.collection('events');
        for (const event of sampleEvents) {
            const snapshot = await eventsCol.where('title', '==', event.title).get();
            if (snapshot.empty) {
                await eventsCol.add(event);
                console.log(`✅ Added event: ${event.title}`);
            } else {
                console.log(`ℹ️ Event already exists: ${event.title}`);
            }
        }
        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
