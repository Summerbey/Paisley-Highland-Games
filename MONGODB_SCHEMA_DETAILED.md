# PAISLEY HIGHLAND GAMES - MONGODB DATABASE SCHEMA

## Database Overview

**Database Name**: `paisley_highland_games`
**MongoDB Version**: 6.0+
**Driver**: Mongoose (Node.js ODM)

## Collections Structure

### 1. Users Collection

**Collection Name**: `users`

```javascript
{
  _id: ObjectId("..."),
  email: "competitor@example.com",      // Unique, indexed
  passwordHash: "$2b$12$...",            // Bcrypt hashed
  role: "competitor",                    // Enum: visitor, competitor, vendor, organizer, judge, admin
  profile: {
    firstName: "John",
    lastName: "MacLeod",
    dateOfBirth: ISODate("1995-03-15"),
    phone: "+44 7700 900000",
    address: {
      street: "123 High Street",
      city: "Paisley",
      postcode: "PA1 2BN",
      country: "United Kingdom"
    },
    emergencyContact: {
      name: "Mary MacLeod",
      relationship: "Sister",
      phone: "+44 7700 900001"
    },
    bio: "Competing in Highland athletics for 5 years...",
    profilePhoto: "https://storage.example.com/users/abc123.jpg"
  },
  preferences: {
    emailNotifications: true,
    dataProcessingConsent: true,        // Required: true
    photographyConsent: false,
    marketingConsent: false
  },
  createdAt: ISODate("2025-01-15T10:30:00Z"),
  updatedAt: ISODate("2025-03-20T14:22:00Z")
}
```

**Indexes**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ createdAt: -1 })
db.users.createIndex({ "profile.lastName": 1, "profile.firstName": 1 })
```

**Mongoose Schema**:
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['visitor', 'competitor', 'vendor', 'organizer', 'judge', 'admin'],
    default: 'competitor'
  },
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: Date,
    phone: String,
    address: {
      street: String,
      city: String,
      postcode: String,
      country: { type: String, default: 'United Kingdom' }
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    bio: { type: String, maxlength: 500 },
    profilePhoto: String
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    dataProcessingConsent: { type: Boolean, required: true },
    photographyConsent: { type: Boolean, default: false },
    marketingConsent: { type: Boolean, default: false }
  }
}, {
  timestamps: true  // Auto-creates createdAt and updatedAt
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Virtual for full name
userSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const bcrypt = require('bcryptjs');
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};
```

**Relationships**:
- **One-to-Many**: User → Registrations
- **One-to-Many**: User → Vendors
- **Many-to-Many**: User ↔ Competitions (through Registrations)

---

### 2. Competitions Collection

**Collection Name**: `competitions`

```javascript
{
  _id: ObjectId("..."),
  name: "Caber Toss - Open Category",
  category: "athletic",                 // Enum: athletic, dance, piping, drumming, other
  subcategory: "Caber Toss",
  description: "Traditional Scottish heavy athletics event...",
  rules: "Competitors must throw the caber end over end...",
  eventDate: ISODate("2025-06-21"),
  startTime: "14:00",                   // HH:MM format
  endTime: "16:00",
  location: "Main Field - Section A",
  maxParticipants: 20,
  currentParticipants: 15,              // Updated via triggers or application logic
  ageGroup: "Open (18+)",
  eligibilityRequirements: [
    "Must be 18 years or older",
    "Medical certificate required",
    "Previous competition experience recommended"
  ],
  requiredDocuments: [
    "Medical Certificate",
    "Age Verification"
  ],
  registrationDeadline: ISODate("2025-06-14T23:59:59Z"),
  status: "open",                       // Enum: draft, open, closed, in-progress, completed, cancelled
  imageUrl: "https://storage.example.com/competitions/caber-toss.jpg",
  judges: [
    ObjectId("..."),                    // References to users with judge role
    ObjectId("...")
  ],
  prizes: {
    firstPlace: "£500 + Trophy",
    secondPlace: "£300 + Medal",
    thirdPlace: "£200 + Medal"
  },
  createdBy: ObjectId("..."),           // Reference to admin/organizer user
  createdAt: ISODate("2025-02-01T09:00:00Z"),
  updatedAt: ISODate("2025-03-15T11:30:00Z")
}
```

**Indexes**:
```javascript
db.competitions.createIndex({ name: "text", description: "text" })  // Text search
db.competitions.createIndex({ category: 1, status: 1 })
db.competitions.createIndex({ eventDate: 1, startTime: 1 })
db.competitions.createIndex({ status: 1, registrationDeadline: 1 })
db.competitions.createIndex({ currentParticipants: 1, maxParticipants: 1 })
```

**Mongoose Schema**:
```javascript
const competitionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['athletic', 'dance', 'piping', 'drumming', 'other']
  },
  subcategory: { type: String, required: true },
  description: { type: String, required: true, maxlength: 2000 },
  rules: { type: String, required: true },
  eventDate: { type: Date, required: true },
  startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  location: { type: String, required: true },
  maxParticipants: { type: Number, required: true, min: 1 },
  currentParticipants: { type: Number, default: 0, min: 0 },
  ageGroup: { type: String, required: true },
  eligibilityRequirements: [{ type: String }],
  requiredDocuments: [{ type: String }],
  registrationDeadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['draft', 'open', 'closed', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  imageUrl: String,
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  prizes: {
    firstPlace: String,
    secondPlace: String,
    thirdPlace: String
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

// Indexes
competitionSchema.index({ name: 'text', description: 'text' });
competitionSchema.index({ category: 1, status: 1 });
competitionSchema.index({ eventDate: 1, startTime: 1 });

// Virtual for capacity status
competitionSchema.virtual('isFull').get(function() {
  return this.currentParticipants >= this.maxParticipants;
});

// Virtual for registration open status
competitionSchema.virtual('isRegistrationOpen').get(function() {
  return this.status === 'open' && 
         new Date() < this.registrationDeadline &&
         !this.isFull;
});
```

**Relationships**:
- **Many-to-One**: Competitions → Users (createdBy)
- **Many-to-Many**: Competitions ↔ Users (judges)
- **One-to-Many**: Competition → Registrations
- **One-to-Many**: Competition → Results

---

### 3. Registrations Collection

**Collection Name**: `registrations`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),               // Reference to users collection
  competitionId: ObjectId("..."),        // Reference to competitions collection
  status: "approved",                    // Enum: pending, approved, rejected, withdrawn, waitlisted
  applicationDate: ISODate("2025-03-10T14:30:00Z"),
  reviewedDate: ISODate("2025-03-12T10:15:00Z"),
  reviewedBy: ObjectId("..."),           // Reference to organizer/admin user
  documents: [
    {
      documentType: "Medical Certificate",
      fileUrl: "https://storage.example.com/docs/med-cert-123.pdf",
      uploadedAt: ISODate("2025-03-10T14:32:00Z")
    },
    {
      documentType: "Age Verification",
      fileUrl: "https://storage.example.com/docs/age-verify-123.pdf",
      uploadedAt: ISODate("2025-03-10T14:35:00Z")
    }
  ],
  notes: "Approved - all documentation in order",
  specialRequests: "Prefer morning time slot if possible",
  confirmationCode: "PHG-2025-CB-15A3",
  createdAt: ISODate("2025-03-10T14:30:00Z")
}
```

**Indexes**:
```javascript
// Compound unique index - one registration per user per competition
db.registrations.createIndex({ userId: 1, competitionId: 1 }, { unique: true })
db.registrations.createIndex({ userId: 1, status: 1 })
db.registrations.createIndex({ competitionId: 1, status: 1 })
db.registrations.createIndex({ status: 1, applicationDate: -1 })
db.registrations.createIndex({ confirmationCode: 1 }, { unique: true })
```

**Mongoose Schema**:
```javascript
const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn', 'waitlisted'],
    default: 'pending'
  },
  applicationDate: { type: Date, default: Date.now },
  reviewedDate: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documents: [{
    documentType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: String,
  specialRequests: String,
  confirmationCode: {
    type: String,
    unique: true,
    default: function() {
      // Generate unique code: PHG-YYYY-CC-XXXX
      const year = new Date().getFullYear();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `PHG-${year}-${random}`;
    }
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Compound unique index
registrationSchema.index({ userId: 1, competitionId: 1 }, { unique: true });
registrationSchema.index({ status: 1, applicationDate: -1 });
registrationSchema.index({ confirmationCode: 1 }, { unique: true });

// Pre-save hook to update competition participant count
registrationSchema.post('save', async function(doc) {
  if (doc.status === 'approved') {
    await mongoose.model('Competition').findByIdAndUpdate(
      doc.competitionId,
      { $inc: { currentParticipants: 1 } }
    );
  }
});

// Hook for status changes (approved -> rejected, etc.)
registrationSchema.pre('save', async function(next) {
  if (this.isModified('status')) {
    const oldStatus = this._original?.status;
    const newStatus = this.status;
    
    // Handle participant count changes
    if (oldStatus === 'approved' && newStatus !== 'approved') {
      await mongoose.model('Competition').findByIdAndUpdate(
        this.competitionId,
        { $inc: { currentParticipants: -1 } }
      );
    } else if (oldStatus !== 'approved' && newStatus === 'approved') {
      await mongoose.model('Competition').findByIdAndUpdate(
        this.competitionId,
        { $inc: { currentParticipants: 1 } }
      );
    }
  }
  next();
});
```

**Relationships**:
- **Many-to-One**: Registration → User
- **Many-to-One**: Registration → Competition
- **Many-to-One**: Registration → User (reviewedBy)

---

### 4. Results Collection

**Collection Name**: `results`

```javascript
{
  _id: ObjectId("..."),
  competitionId: ObjectId("..."),        // Reference to competitions collection
  participantId: ObjectId("..."),        // Reference to users collection
  participantName: "John MacLeod",       // Denormalized for performance
  score: 56.3,                           // Can be number or string (e.g., "12.45m", "45 seconds")
  rank: 1,
  attemptDetails: [
    {
      attemptNumber: 1,
      value: 54.2,
      notes: "Good form"
    },
    {
      attemptNumber: 2,
      value: 56.3,
      notes: "Personal best!"
    },
    {
      attemptNumber: 3,
      value: 55.1,
      notes: ""
    }
  ],
  notes: "Excellent performance, new event record",
  isRecord: true,
  recordType: "Event Record",
  recordedBy: ObjectId("..."),           // Reference to judge user
  recordedAt: ISODate("2025-06-21T15:45:00Z"),
  verifiedAt: ISODate("2025-06-21T16:00:00Z")
}
```

**Indexes**:
```javascript
db.results.createIndex({ competitionId: 1, rank: 1 })
db.results.createIndex({ participantId: 1, recordedAt: -1 })
db.results.createIndex({ isRecord: 1, recordType: 1 })
db.results.createIndex({ competitionId: 1, participantId: 1 }, { unique: true })
```

**Mongoose Schema**:
```javascript
const resultSchema = new mongoose.Schema({
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true
  },
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participantName: { type: String, required: true },  // Denormalized
  score: { type: mongoose.Schema.Types.Mixed, required: true },
  rank: { type: Number, required: true, min: 1 },
  attemptDetails: [{
    attemptNumber: { type: Number, required: true },
    value: mongoose.Schema.Types.Mixed,
    notes: String
  }],
  notes: String,
  isRecord: { type: Boolean, default: false },
  recordType: String,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordedAt: { type: Date, default: Date.now },
  verifiedAt: Date
});

// Indexes
resultSchema.index({ competitionId: 1, rank: 1 });
resultSchema.index({ participantId: 1, recordedAt: -1 });
resultSchema.index({ competitionId: 1, participantId: 1 }, { unique: true });

// Virtual for medal status
resultSchema.virtual('medalType').get(function() {
  if (this.rank === 1) return 'gold';
  if (this.rank === 2) return 'silver';
  if (this.rank === 3) return 'bronze';
  return null;
});
```

**Relationships**:
- **Many-to-One**: Result → Competition
- **Many-to-One**: Result → User (participant)
- **Many-to-One**: Result → User (recordedBy)

---

### 5. Vendors Collection

**Collection Name**: `vendors`

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),               // Reference to users collection
  businessName: "Highland Crafts Co.",
  businessType: "crafts",                // Enum: food, beverage, crafts, merchandise, other
  description: "Handmade Scottish crafts including tartan products...",
  website: "https://highlandcrafts.example.com",
  contactEmail: "info@highlandcrafts.example.com",
  contactPhone: "+44 1234 567890",
  pitchRequirements: {
    size: "3m x 3m",
    electricityRequired: true,
    waterRequired: false,
    specialRequirements: "Weather protection preferred"
  },
  insuranceDocuments: [
    "https://storage.example.com/vendor-docs/insurance-123.pdf"
  ],
  foodHygieneCertificate: null,         // Only required for food vendors
  pitchNumber: "C-15",
  pitchLocation: {
    zone: "Craft Village",
    coordinates: {
      lat: 55.845,
      lng: -4.435
    }
  },
  status: "approved",                    // Enum: pending, approved, rejected, cancelled
  applicationDate: ISODate("2025-02-20T10:00:00Z"),
  reviewedDate: ISODate("2025-02-25T14:30:00Z"),
  reviewedBy: ObjectId("..."),
  reviewNotes: "Approved - all documentation complete",
  createdAt: ISODate("2025-02-20T10:00:00Z")
}
```

**Indexes**:
```javascript
db.vendors.createIndex({ userId: 1 })
db.vendors.createIndex({ status: 1, businessType: 1 })
db.vendors.createIndex({ pitchNumber: 1 }, { unique: true, sparse: true })
db.vendors.createIndex({ "pitchLocation.zone": 1 })
```

**Mongoose Schema**:
```javascript
const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: { type: String, required: true, trim: true },
  businessType: {
    type: String,
    required: true,
    enum: ['food', 'beverage', 'crafts', 'merchandise', 'other']
  },
  description: { type: String, required: true, maxlength: 1000 },
  website: String,
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  pitchRequirements: {
    size: { type: String, required: true },
    electricityRequired: { type: Boolean, default: false },
    waterRequired: { type: Boolean, default: false },
    specialRequirements: String
  },
  insuranceDocuments: [{ type: String }],
  foodHygieneCertificate: String,
  pitchNumber: String,
  pitchLocation: {
    zone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  applicationDate: { type: Date, default: Date.now },
  reviewedDate: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNotes: String
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
vendorSchema.index({ status: 1, businessType: 1 });
vendorSchema.index({ pitchNumber: 1 }, { unique: true, sparse: true });

// Validation: food vendors must have hygiene certificate
vendorSchema.pre('save', function(next) {
  if ((this.businessType === 'food' || this.businessType === 'beverage') && 
      this.status === 'approved' && 
      !this.foodHygieneCertificate) {
    next(new Error('Food/beverage vendors require hygiene certificate'));
  }
  next();
});
```

**Relationships**:
- **Many-to-One**: Vendor → User
- **Many-to-One**: Vendor → User (reviewedBy)

---

## Database Relationships Diagram

```
┌─────────────┐
│    Users    │
│   (users)   │
└──────┬──────┘
       │ 
       │ One-to-Many
       ↓
┌──────────────────┐       ┌──────────────────┐
│  Registrations   │──────→│  Competitions    │
│ (registrations)  │       │ (competitions)   │
└──────────────────┘       └────────┬─────────┘
       │                            │
       │                            │ One-to-Many
       │                            ↓
       │                   ┌──────────────────┐
       │                   │     Results      │
       └──────────────────→│   (results)      │
                           └──────────────────┘

┌─────────────┐
│    Users    │
└──────┬──────┘
       │ One-to-Many
       ↓
┌──────────────────┐
│     Vendors      │
│   (vendors)      │
└──────────────────┘
```

## Query Examples

### Find all open competitions
```javascript
db.competitions.find({
  status: 'open',
  registrationDeadline: { $gt: new Date() }
}).sort({ eventDate: 1 })
```

### Get user's registrations with competition details
```javascript
db.registrations.aggregate([
  { $match: { userId: ObjectId("...") } },
  {
    $lookup: {
      from: 'competitions',
      localField: 'competitionId',
      foreignField: '_id',
      as: 'competition'
    }
  },
  { $unwind: '$competition' },
  { $sort: { 'competition.eventDate': 1 } }
])
```

### Find competitions with available spots
```javascript
db.competitions.find({
  $expr: { $lt: ['$currentParticipants', '$maxParticipants'] },
  status: 'open'
})
```

### Get leaderboard for a competition
```javascript
db.results.find({ 
  competitionId: ObjectId("...") 
}).sort({ rank: 1 }).limit(10)
```

## Backup and Recovery

### Backup Strategy
```bash
# Daily automated backups using MongoDB Atlas
# Point-in-time recovery available
# Backup retention: 7 days for free tier, 35 days for paid tier

# Manual backup command (if needed)
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/paisley_highland_games" --out=./backup-$(date +%Y%m%d)
```

### Restore Strategy
```bash
# Restore from backup
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/paisley_highland_games" ./backup-20250615/
```

## Performance Optimization

### Query Performance
1. **Use appropriate indexes** for all common query patterns
2. **Limit result sets** with pagination
3. **Project only needed fields** to reduce data transfer
4. **Use aggregation pipeline** for complex data transformations

### Connection Pooling
```javascript
// Mongoose connection with pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
});
```

### Caching Strategy
- Cache frequently accessed competition lists (Redis, 5 min TTL)
- Cache public schedules (Redis, 1 hour TTL)
- Cache leaderboards (Redis, until result updated)

## Data Migration Scripts

### Seed Data Script
```javascript
// scripts/seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Competition = require('./models/Competition');

async function seedDatabase() {
  // Create admin user
  const admin = await User.create({
    email: 'admin@paisleygames.com',
    passwordHash: 'hashedpassword',
    role: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User'
    },
    preferences: {
      dataProcessingConsent: true
    }
  });

  // Create sample competitions
  await Competition.create([
    {
      name: 'Caber Toss - Open',
      category: 'athletic',
      subcategory: 'Caber Toss',
      description: 'Traditional caber toss competition',
      rules: 'Standard Highland Games rules apply',
      eventDate: new Date('2025-06-21'),
      startTime: '14:00',
      endTime: '16:00',
      location: 'Main Field',
      maxParticipants: 20,
      ageGroup: 'Open (18+)',
      eligibilityRequirements: ['Age 18+', 'Medical cert'],
      requiredDocuments: ['Medical Certificate'],
      registrationDeadline: new Date('2025-06-14'),
      status: 'open',
      createdBy: admin._id
    }
  ]);
  
  console.log('Database seeded successfully');
  process.exit(0);
}

seedDatabase();
```

## Security Considerations

1. **Authentication**: JWT tokens with 1-hour expiration
2. **Authorization**: Role-based access control at route level
3. **Data Encryption**: MongoDB Atlas encryption at rest
4. **Connection Security**: TLS 1.3 for all connections
5. **Input Validation**: Mongoose schemas + additional validation
6. **Rate Limiting**: Prevent brute force attacks on auth endpoints
7. **Sensitive Data**: Never log passwords or tokens
8. **GDPR Compliance**: Implement data deletion cascades

## Monitoring and Alerts

### MongoDB Atlas Monitoring
- Track query performance
- Monitor connection pool usage
- Alert on slow queries (>100ms)
- Alert on high memory usage (>80%)
- Alert on disk space (>75% full)

### Application-Level Logging
```javascript
// Log all database operations in development
mongoose.set('debug', process.env.NODE_ENV === 'development');
```

This comprehensive MongoDB schema provides a solid foundation for the Paisley Highland Games application with proper relationships, indexes, and data integrity constraints.
