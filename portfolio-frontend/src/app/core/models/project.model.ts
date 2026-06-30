export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  images: string[];
  badge: string;
  techStack: string[];
  links: ProjectLink[];
  order: number;
}

// export interface Project {
//   _id?: string;
//   title: string;
//   description: string;
//   images: string[];
//   badge: string;
//   techStack: string[];

//   links: {
//     label: string;
//     url: string;
//   }[];

//   order: number;
// }