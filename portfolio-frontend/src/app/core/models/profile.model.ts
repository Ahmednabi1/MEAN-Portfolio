export interface Education {
  degree: string;
  institution: string;
  meta: string;
  achievementTitle: string;
  achievementItems: string[];
  achievementDescription: string;
}

export interface Profile {
  _id?: string;
  fullName: string;
  heroEyebrow: string;
  heroSubtitle: string;
  aboutParagraphs: string[];
  profilePicture: string;
  email: string;
  phone: string;
  location: string;
  graduationInfo: string;
  role: string;
  linkedinUrl: string;
  githubUrl: string;
  education: Education;
  resumeDownloadUrl: string;
  resumeViewUrl: string;
}