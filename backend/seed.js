import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";


import User from "./models/user.model.js";
import Resume from "./models/resume.model.js";
import Application from "./models/application.model.js";
import Payment from "./models/payment.model.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

// Demo data
const names = [
    "Arjun Sharma", "Priya Singh", "Rahul Gupta", "Ananya Verma",
    "Vikram Singh", "Kavya Patel", "Aditya Kumar", "Shreya Jain",
    "Rohan Mehta", "Isha Sharma", "Karan Verma", "Riya Gupta",
    "Siddharth Jain", "Nisha Patel", "Abhishek Rao", "Pooja Singh",
    "Varun Agarwal", "Meera Nair", "Nikhil Shah", "Tanya Kapoor",
    "Harsh Bansal", "Divya Mishra", "Akash Reddy", "Sneha Kumar",
    "Yash Kapoor", "Aditi Sharma", "Rohit Malhotra", "Sakshi Jain",
    "Aryan Sinha", "Neha Verma"
];

const companies = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple",
    "Netflix", "Uber", "Adobe", "Oracle", "IBM",
    "Infosys", "TCS", "Wipro", "Accenture", "Flipkart",
    "Zomato", "Swiggy", "Paytm", "PhonePe", "Zoho"
];

const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Business Analyst"
];

const universities = [
    "KIIT University",
    "IIT Delhi",
    "IIT Bombay",
    "NIT Trichy",
    "BITS Pilani",
    "VIT Vellore",
    "DTU",
    "IIIT Hyderabad"
];

const degrees = [
    "B.Tech Computer Science",
    "B.Tech Information Technology",
    "B.E Computer Science",
    "M.Tech Computer Science",
    "MCA"
];

const skills = {
    languages: [
        "JavaScript", "Python", "Java", "C++", "TypeScript"
    ],
    frameworks: [
        "React", "Node.js", "Express", "Django", "Spring Boot"
    ],
    databases: [
        "MongoDB", "MySQL", "PostgreSQL", "Redis"
    ],
    aiTools: [
        "TensorFlow", "PyTorch", "Scikit-learn", "Gemini API"
    ],
    coreCS: [
        "Data Structures", "Algorithms",
        "System Design", "Computer Networks", "Operating Systems"
    ]
};

const randomElement = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

const randomElements = (arr, count) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, count);

const randomDate = (start, end) =>
    new Date(
        start.getTime() +
        Math.random() * (end.getTime() - start.getTime())
    );

const generatePhone = () =>
    `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;

const generateUTR = () =>
    String(Math.floor(100000000000 + Math.random() * 900000000000));

// Generate Resume
const generateResume = (user) => ({
    userId: user._id,
    title: `${user.name.split(" ")[0]}'s Resume`,

    personalInfo: {
        name: user.name,
        email: user.email,
        phone: generatePhone(),
        location: randomElement([
            "Bhubaneswar",
            "Bangalore",
            "Delhi",
            "Mumbai",
            "Hyderabad"
        ]),
        linkedin: `linkedin.com/in/${user.name.toLowerCase().replace(/\s+/g, "-")}`,
        github: `github.com/${user.name.toLowerCase().replace(/\s+/g, "")}`
    },

    summary: "Motivated software developer interested in building scalable applications using modern technologies.",

    education: [{
        institution: randomElement(universities),
        degree: randomElement(degrees),
        location: "India",
        startDate: "2022",
        endDate: "2026"
    }],

    experience: [],

    projects: [{
        name: "Full Stack Web Application",
        techStack: ["React", "Node.js", "MongoDB"],
        startDate: "2025",
        endDate: "2026",
        bullets: [
            "Developed responsive user interfaces.",
            "Implemented REST APIs.",
            "Integrated MongoDB for data persistence."
        ]
    }],

    skills: {
        languages: randomElements(skills.languages, 3),
        frameworks: randomElements(skills.frameworks, 3),
        databases: randomElements(skills.databases, 2),
        aiTools: randomElements(skills.aiTools, 2),
        coreCS: randomElements(skills.coreCS, 3)
    },

    achievements: [
        "Participated in coding competitions",
        "Solved Data Structures and Algorithms problems"
    ]
});

// Generate Applications
const generateApplications = (user) => {
    const count = Math.floor(Math.random() * 5) + 1;

    return Array.from({ length: count }, () => ({
        user: user._id,
        company: randomElement(companies),
        role: randomElement(roles),
        status: randomElement([
            "Applied",
            "Interview",
            "Offer",
            "Rejected"
        ]),
        appliedDate: randomDate(
            new Date(2025, 0, 1),
            new Date()
        ),
        notes: "Demo application created for testing."
    }));
};

// Generate UPI Payment
const generatePayment = (user) => ({
    userId: user._id,
    paymentMethod: "upi",
    utr: generateUTR(),
    amount: 129,
    currency: "INR",
    status: "completed",
    plan: "premium_lifetime",
    verifiedAt: new Date(),
    verifiedBy: null
});

// Main seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("Starting NextHire demo data seeding...");

        const demoUsers = [];

        // Create 30 demo users
        for (let i = 0; i < 30; i++) {
            const email = `demo.user${String(i + 1).padStart(3, "0")}@nexthire.local`;

            // Prevent duplicate users on repeated runs
            const existingUser = await User.findOne({ email });

            if (existingUser) continue;

            const isPremium = i < 7;

            const hashedPassword = await bcrypt.hash(
                "password123",
                10
            );

            demoUsers.push({
                name: names[i % names.length],
                email,
                password: hashedPassword,
                role: "user",
                isPremium,
                premiumPurchaseDate: isPremium ? new Date() : null,
                jobSearchCount: 0,
                lastJobSearch: null
            });
        }

        if (demoUsers.length === 0) {
            console.log("Demo users already exist. Nothing to seed.");
            return;
        }

        // Insert users
        const insertedUsers = await User.insertMany(demoUsers);

        console.log(`Created ${insertedUsers.length} demo users`);

        const resumes = [];
        const applications = [];
        const payments = [];

        for (const user of insertedUsers) {
            // Generate resumes
            if (Math.random() > 0.2) {
                resumes.push(generateResume(user));
            }

            // Generate applications
            applications.push(...generateApplications(user));

            // Generate completed UPI payment records
            if (user.isPremium) {
                payments.push(generatePayment(user));
            }
        }

        // Insert resumes
        if (resumes.length > 0) {
            await Resume.insertMany(resumes);
        }

        // Insert applications
        if (applications.length > 0) {
            await Application.insertMany(applications);
        }

        // Insert payments
        if (payments.length > 0) {
            await Payment.insertMany(payments);
        }

        console.log("\nNextHire demo data created successfully!");

        console.log(`
        Users: ${insertedUsers.length}
        Premium Users: ${insertedUsers.filter(u => u.isPremium).length}
        Resumes: ${resumes.length}
        Applications: ${applications.length}
        Payments: ${payments.length}
        `);

        console.log("Demo login password: password123");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
};

seedDatabase();
