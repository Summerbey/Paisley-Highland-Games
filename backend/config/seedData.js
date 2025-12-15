const mongoose = require('mongoose');
const Event = require('../models/Event');
const Competitor = require('../models/Competitor');
const connectDB = require('./db');
require('dotenv').config();

//  Events Data
const events = [
  {
    name: 'Caber Toss',
    description: 'The iconic Highland Games event where athletes toss a large wooden pole (caber) end over end.',
    category: 'Heavy',
    maxCompetitors: 15,
    status: 'Open'
  },
  {
    name: 'Stone Put',
    description: 'Similar to shot put, competitors throw a heavy stone for distance.',
    category: 'Heavy',
    maxCompetitors: 20,
    status: 'Open'
  },
  {
    name: 'Hammer Throw',
    description: 'Athletes swing and throw a metal ball attached to a wooden handle.',
    category: 'Heavy',
    maxCompetitors: 18,
    status: 'Open'
  },
  {
    name: 'Weight for Distance',
    description: 'Throw a 56lb or 28lb weight for maximum distance.',
    category: 'Heavy',
    maxCompetitors: 16,
    status: 'Open'
  },
  {
    name: '100m Sprint',
    description: 'Traditional track sprint race.',
    category: 'Track',
    maxCompetitors: 12,
    status: 'Open'
  },
  {
    name: 'Hill Race',
    description: 'Running race up and down a steep hill.',
    category: 'Track',
    maxCompetitors: 25,
    status: 'Open'
  },
  {
    name: 'High Jump',
    description: 'Athletes jump over a horizontal bar.',
    category: 'Field',
    maxCompetitors: 15,
    status: 'Open'
  },
  {
    name: 'Long Jump',
    description: 'Athletes run and jump for maximum distance.',
    category: 'Field',
    maxCompetitors: 15,
    status: 'Open'
  },
  {
    name: 'Piping Competition',
    description: 'Traditional Scottish bagpipe performance competition.',
    category: 'Piping',
    maxCompetitors: 10,
    status: 'Open'
  },
  {
    name: 'Highland Dancing',
    description: 'Traditional Scottish dance competition including Sword Dance and Highland Fling.',
    category: 'Dancing',
    maxCompetitors: 20,
    status: 'Open'
  }
];

// Competitors Data
const competitors = [
  {
    name: 'James Thornton-Crawford',
    email: 'B01388374@studentmail.uws.ac.uk',
    country: 'Scotland'
  },
  {
    name: 'Tahir Mahmood',
    email: 'Tahir.Mahmood@uws.ac.uk',
    country: 'UWS Scotland'
  },
  {
    name: 'Dr Sajjad Bagheri',
    email: 'Sajjad.Bagheri@uws.ac.uk',
    country: 'UWS Scotland'
  },
  {
    name: 'Dr Derek Turner',
    email: 'Derek.Turner@uws.ac.uk',
    country: 'UWS Scotland'
  },
  {
    name: 'Dr Pablo Salva Garcia',
    email: 'Pablo.Salva-Garcia@uws.ac.uk',
    country: 'UWS Scotland'
  },
  {
    name: 'Bibika Ghimire',
    email: 'B00838239@studentmail.uws.ac.uk',
    country: 'UWS Scotland'
  },
  {
    name: 'Mateusz Nowak',
    email: 'B00350243@studentmail.uws.ac.uk',
    country: 'Scotland'
  },
  {
    name: 'Summer Rhoda',
    email: 'B00477047@studentmail.uws.ac.uk',
    country: 'UWS Scotland'
  }
];

// Seed Database Function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Event.deleteMany({});
    await Competitor.deleteMany({});
    console.log('✅ Data cleared successfully');

    // Insert Events
    console.log('📝 Creating events...');
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Created ${createdEvents.length} events`);

    // Insert Competitors
    console.log('👥 Creating competitors...');
    const createdCompetitors = await Competitor.insertMany(competitors);
    console.log(`✅ Created ${createdCompetitors.length} competitors`);

    // Register some competitors for events (randomly)
    console.log('📋 Registering competitors for events...');
    
    for (let i = 0; i < createdCompetitors.length; i++) {
      const competitor = createdCompetitors[i];
      
      // Register each competitor for 2-4 random events
      const numEvents = Math.floor(Math.random() * 3) + 2;
      const selectedEvents = [];
      
      for (let j = 0; j < numEvents; j++) {
        const randomEvent = createdEvents[Math.floor(Math.random() * createdEvents.length)];
        
        if (!selectedEvents.includes(randomEvent._id)) {
          selectedEvents.push(randomEvent._id);
          
          // Update competitor's registered events
          await Competitor.findByIdAndUpdate(
            competitor._id,
            { $push: { registeredEvents: randomEvent._id } }
          );
          
          // Update event's current competitors count
          await Event.findByIdAndUpdate(
            randomEvent._id,
            { $inc: { currentCompetitors: 1 } }
          );
        }
      }
    }
    
    console.log('✅ Competitors registered for events');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Total Events: ${createdEvents.length}`);
    console.log(`👥 Total Competitors: ${createdCompetitors.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();