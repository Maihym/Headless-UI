export interface Review {
  source: string;
  recommended: boolean;
  author: string;
  profilePic: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  service: string;
  platforms?: string[];
}


