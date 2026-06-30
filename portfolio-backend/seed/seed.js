// npm run seed
// creates the single admin account (from .env) and pre-fills the database with existing portfolio content
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const SkillCategory = require('../models/SkillCategory');
const Experience = require('../models/Experience');
// const bycrypt = require('bcryptjs');
async function seed() {
  await connectDB();

  //ADMIN USER
  const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });

  if (existingAdmin) {
    console.log(`Admin "${process.env.ADMIN_USERNAME}" already exists — skipping creation.`);
  } else {

    // const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      // password: hashedPassword
      password: process.env.ADMIN_PASSWORD
    });
    console.log(`Admin user "${process.env.ADMIN_USERNAME}" created.`);
  }

  // PROFILE
  const profileExists = await Profile.findOne();
  if (profileExists) {
    console.log('Profile document already exists — skipping.');
  } else {
    await Profile.create({
      fullName: 'Ahmed Nabil Abdeldhady',
      heroEyebrow: 'Backend-Focused Full Stack Developer',
      heroSubtitle: 'Node.js · NestJS · PostgreSQL · MongoDB',
      aboutParagraphs: [
        'Backend-focused MERN Stack Developer with expertise in building scalable APIs, managing complex database systems, and implementing secure authentication. I specialize in creating robust backend solutions that power modern web applications.',
        'With proficiency in Node.js, Express.js, Nest.js, MongoDB, and PostgreSQL, I bring a strong foundation in data structures, design patterns, and Agile methodologies to every project. My experience includes developing comprehensive backend systems for complex applications like Shatla, my graduation project that achieved 1st place in the Information Systems department.',
        "I'm passionate about writing clean, efficient code and building systems that scale. Whether it's architecting database schemas, implementing RESTful APIs, or integrating third-party services, I approach each challenge with technical precision and creative problem-solving."
      ],
      email: 'ahmed.nabil.4426@gmail.com',
      phone: '+201145372314',
      location: 'Cairo, Maadi',
      graduationInfo: 'Computer Science & AI Graduate',
      role: 'Backend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/ahmed-nabil-434a922a6/',
      githubUrl: 'https://github.com/Ahmednabi1',
      education: {
        degree: 'Bachelor of Computer Science and Artificial Intelligence',
        institution: 'Faculty of Computers and Artificial Intelligence, Cairo University',
        meta: 'Major: Information Systems · Graduated: 2025 · GPA: 3.0 (Very Good)',
        achievementTitle: 'Outstanding Graduation Project',
        achievementItems: [
          'Project: Shatla (Smart Plant Care Mobile App) — Backend Developer',
          'Recognition: 1st place among Information Systems department projects',
          'University Ranking: 4th across all graduation projects at Cairo University Career Quest event',
          'Grade: A+'
        ],
        achievementDescription: 'Developed a comprehensive backend system for a mobile app that enables home gardeners to manage plant care schedules, monitor climate conditions, and access e-commerce features. The system includes region-specific climate data integration, automated care schedule generation, and robust error handling mechanisms.'
      },
      resumeDownloadUrl: 'https://drive.google.com/uc?export=download&id=1Y_Jmci3NRfSlY-AwsnU2a4uLO5CjRQ-r',
      resumeViewUrl: 'https://drive.google.com/file/d/1Y_Jmci3NRfSlY-AwsnU2a4uLO5CjRQ-r/view?usp=sharing'
    });
    console.log('Profile document created.');
  }

  // SKILLS
  const skillCount = await SkillCategory.countDocuments();
  if (skillCount > 0) {
    console.log('Skill categories already exist — skipping.');
  } else {
    await SkillCategory.insertMany([
      {
        name: 'Languages', icon: 'fas fa-code', order: 1,
        tags: ['JavaScript', 'TypeScript', 'Python', 'C++', 'Java']
      },
      {
        name: 'Backend', icon: 'fas fa-server', order: 2,
        tags: ['Node.js', 'Express.js', 'Nest.js', 'RESTful APIs', 'WebSocket']
      },
      {
        name: 'Frontend', icon: 'fas fa-desktop', order: 3,
        tags: ['React.js', 'HTML5', 'CSS3', 'Responsive Design']
      },
      {
        name: 'Databases & Caching', icon: 'fas fa-database', order: 4,
        tags: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQL Server', 'Redis']
      },
      {
        name: 'Tools', icon: 'fas fa-tools', order: 5,
        tags: ['Git', 'Sequelize', 'Multer', 'Passport', 'Socket.IO']
      },
      {
        name: 'Methodologies', icon: 'fas fa-sitemap', order: 6,
        tags: ['MVC Architecture', 'SOLID Principles', 'Design Patterns', 'Agile/Scrum', 'Data Structures']
      }
    ]);
    console.log('Skill categories created.');
  }

  // EXPERIENCE
  const expCount = await Experience.countDocuments();
  if (expCount > 0) {
    console.log('Experience entries already exist — skipping.');
  } else {
    await Experience.insertMany([
      {
        role: 'Backend Developer Intern',
        company: 'BEE Interactive',
        dateRange: 'Jul 2024 – Sep 2024',
        description: 'Developed backend APIs and integrated databases for responsive applications, collaborating with frontend teams to optimize performance and deliver seamless user experiences.',
        order: 1
      },
      {
        role: 'React Developer Intern',
        company: 'Digital Egypt Pioneers Initiative (DEPI)',
        dateRange: 'Apr 2024 – Oct 2024',
        description: 'Enhanced user interfaces with React, integrated APIs, and managed application state. Gained valuable experience in both frontend development and backend integration.',
        order: 2
      },
      {
        role: 'Web Development Trainee',
        company: 'Sprints x Microsoft Summer Camp',
        dateRange: 'aug 2025 – sep 2025',
        description: 'Completed an intensive web development program focused on modern frontend development and professional software engineering practices. Built a full-stack "F&B Online Shop" project, strengthening practical development skills and end-to-end application delivery.',
        order: 3
      },
      {
      role: 'AI Trainer (Freelance)',
      company: 'Outlier',
      dateRange: 'Nov 2024 – Nov 2025',
      description: 'Contributed to AI model training by evaluating, improving, and validating model responses across diverse tasks. Applied analytical thinking, attention to detail, and quality assurance practices to enhance model performance.',
      order: 4
    },
    {
      role: 'Website Crowdtester (Freelance)',
      company: 'test.io',
      dateRange: 'Sep 2024 – Apr 2025',
      description: 'Conducted functional and exploratory testing of websites, reproduced and documented defects with clear reproduction steps, and verified user flows across multiple browsers and devices.',
      order: 5
    }
    ]);
    console.log('Experience entries created.');
  }

  // PROJECTS
  const projectCount = await Project.countDocuments();
  if (projectCount > 0) {
    console.log('Projects already exist — skipping.');
  } else {
    await Project.insertMany([
      {
        title: 'Shatla — Smart Plant Care App',
        description: '1st place in Information Systems, 4th overall at Cairo University. A comprehensive mobile app backend for plant care management with e-commerce integration, climate monitoring, and personalized care schedules.',
        badge: 'Award-winning',
        techStack: ['Nest.js', 'TypeScript', 'PostgreSQL', 'Redis', 'RESTful APIs'],
        links: [
          { label: 'LinkedIn', url: 'https://www.linkedin.com/posts/ahmed-nabil-434a922a6_shatla-graduationproject-cairouniversity-activity-7356297840387678208-GbFK' },
          { label: 'Demo', url: 'https://www.linkedin.com/posts/ahmed-nabil-434a922a6_graduationproject-ai-flutter-activity-7352816821810487297-YQl8' }
        ],
        order: 1
      },
      {
        title: 'Books Nest — Rental System',
        description: 'Full-featured book rental application with comprehensive user management, authentication system, password recovery, and administrative dashboards.',
        techStack: ['Node.js', 'Express.js', 'MySQL', 'Sequelize', 'Multer'],
        links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/posts/ahmed-nabil-434a922a6_id-like-to-share-my-latest-full-stack-project-activity-7352031445218922496-85KX' }],
        order: 2
      },
      {
        title: 'Mini Social Media Platform',
        description: 'Complete social media platform featuring secure authentication, CRUD operations for users, posts, and comments. Implemented MVC architecture with pagination and form validation.',
        techStack: ['Node.js', 'Express.js', 'MySQL', 'EJS', 'MVC'],
        links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/posts/ahmed-nabil-434a922a6_nodejs-sequelize-ejs-activity-7230202004285911040-fmkv' }],
        order: 3
      },
      {
        title: 'Yapper Chat Application',
        description: 'Real-time chat application with private and public rooms, WebSocket-based messaging, and OAuth integration via Passport with responsive design.',
        techStack: ['React.js', 'Node.js', 'Socket.IO', 'Passport', 'OAuth'],
        links: [{ label: 'GitHub', url: 'https://github.com/Ahmednabi1/Yapper-Chat-App' }],
        order: 4
      },
      {
        title: 'User Registration System',
        description: 'Full-featured registration platform with profile image uploads, real-time validations, AJAX interactions, multi-language support (EN & AR), email notifications, and comprehensive PHPUnit testing.',
        techStack: ['Laravel', 'PHP', 'MySQL', 'Blade', 'AJAX', 'PHPUnit'],
        links: [{ label: 'GitHub', url: 'https://github.com/Ahmednabi1/Registration-System' }],
        order: 5
      },
      {
        title: 'Student Affairs Management',
        description: 'Student records system with rules-based department assignment, status toggling, name search, confirmation dialogues, and full CRUD with validations.',
        techStack: ['Django', 'Python', 'AJAX', 'SQLite', 'HTML/CSS'],
        links: [{ label: 'GitHub', url: 'https://github.com/Ahmednabi1/Students-Affair-System' }],
        order: 6
      },
      {
        title: 'Train Booking System',
        description: 'Train booking management with conceptual and physical ERDs, a fully implemented SQL Server database, and a C# desktop GUI supporting seat booking, cancellation, and reporting.',
        techStack: ['C#', 'MS SQL Server', 'ERD', 'Database Design', 'GUI'],
        links: [{ label: 'GitHub', url: 'https://github.com/Ahmednabi1/Library-Management-System?tab=readme-ov-file' }],
        order: 7
      }
    ]);
    console.log('Projects created.');
  }

  console.log('\nSeed complete.');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
