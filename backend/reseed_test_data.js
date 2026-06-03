import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Resume Schema
const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  profileInfo: {
    fullName: String,
    designation: String,
    summary: String,
  },
  contactInfo: {
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String,
  },
  workExperience: [{
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    startDate: String,
    endDate: String,
  }],
  skills: [{
    name: String,
    progress: Number,
    category: String,
  }],
  projects: [{
    name: String,
    techStack: [String],
    bullets: [String],
    github: String,
    liveDemo: String,
  }],
}, { timestamps: true });

const Resume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // Find user
  let user = await User.findOne({ email: 'testuser@example.com' });
  if (!user) {
    console.log('Creating test user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
    });
  }

  // Delete existing resume
  await Resume.deleteMany({ userId: user._id });
  console.log('Deleted existing resumes for test user.');

  // Create valid resume
  console.log('Creating valid test resume...');
  await Resume.create({
    userId: user._id,
    title: 'Full Stack Engineer Resume',
    profileInfo: {
      fullName: 'Jane Doe',
      designation: 'Senior Full Stack Engineer',
      summary: 'Experienced developer specializing in Node.js and React.',
    },
    contactInfo: {
      email: 'jane@example.com',
      phone: '1234567890',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/janedoe',
      github: 'https://github.com/janedoe',
      website: 'https://janedoe.com',
    },
    workExperience: [
      {
        company: 'Tech Corp',
        role: 'Software Engineer',
        startDate: '2020-01',
        endDate: '2023-01',
        description: 'Developed frontend features.\nLed database migrations.',
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        startDate: '2015-08',
        endDate: '2019-05',
      }
    ],
    skills: [
      { name: 'JavaScript', progress: 90, category: 'Programming Languages' },
      { name: 'React', progress: 85, category: 'Frontend Technologies' },
      { name: 'Node.js', progress: 80, category: 'Backend Technologies' },
    ],
    projects: [
      {
        name: 'Portfolio Website',
        techStack: ['React', 'Tailwind CSS'],
        bullets: [
          'Developed responsive portfolio website.',
          'Integrated analytics tracking.'
        ],
        github: 'https://github.com/janedoe/portfolio',
        liveDemo: 'https://janedoe.com',
      }
    ],
  });

  console.log('Reseed finished successfully.');
  await mongoose.disconnect();
}

run().catch(console.error);
