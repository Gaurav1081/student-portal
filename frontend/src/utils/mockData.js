export const mockData = {
  users: [
    { id: 1, name: "John Smith", email: "john@example.com", role: "Trainer", courses: ["Web Development"] },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "Trainer", courses: ["UI/UX Design"] },
    { id: 3, name: "Alice Cooper", email: "alice@example.com", role: "Learner", courses: ["Web Development", "UI/UX Design"] },
    { id: 4, name: "Bob Wilson", email: "bob@example.com", role: "Learner", courses: ["Web Development"] },
  ],
  courses: [
    { id: 1, name: "Full Stack Web Development", duration: "12 weeks", trainer: "John Smith", enrolled: 45, description: "Learn HTML, CSS, JavaScript, React, Node.js" },
    { id: 2, name: "UI/UX Design Mastery", duration: "8 weeks", trainer: "Sarah Johnson", enrolled: 32, description: "Design thinking, wireframing, prototyping" },
    { id: 3, name: "Digital Marketing", duration: "10 weeks", trainer: "Mike Davis", enrolled: 28, description: "SEO, Social Media, Content Marketing" },
  ],
  sessions: [
    { id: 1, title: "Introduction to React", course: "Full Stack Web Development", trainer: "John Smith", date: "2026-01-15", startTime: "10:00", endTime: "12:00", teamsLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_123", students: 25, status: "upcoming" },
    { id: 2, title: "Advanced React Hooks", course: "Full Stack Web Development", trainer: "John Smith", date: "2026-01-16", startTime: "14:00", endTime: "16:00", teamsLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_456", students: 18, status: "upcoming" },
    { id: 3, title: "Design Principles Workshop", course: "UI/UX Design Mastery", trainer: "Sarah Johnson", date: "2026-01-10", startTime: "09:00", endTime: "11:00", teamsLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_789", students: 30, status: "completed" },
  ],
  admins: [
    { id: 1, email: "admin@cosmos.com", password: "admin123", name: "System Administrator" }
  ]
};