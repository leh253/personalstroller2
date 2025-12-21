
export type ParentStatus = 'future' | 'parent';
export type Gender = 'Femme' | 'Homme';

export interface Child {
  name: string;
  age: string;
}

export interface UserFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string;
  parentStatus: ParentStatus;
  pregnancyTerm: string;
  children: Child[];
  consent: boolean;
}

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizStep {
  id: string;
  question: string;
  options: QuizOption[];
}

export type QuizAnswers = Record<string, string>;

export interface Stroller {
  id?: number;
  marque: string;
  modele: string;
  Modele?: string;
  Q1: string;
  Q2: string;
  Q3: string;
  Q4: string;
  Q5: string;
  Q6: string;
  url_image?: string;
  url_produit?: string;
  "site web"?: string;
  [key: string]: any;
}

export type ScreenState = 'welcome' | 'login' | 'register' | 'quiz' | 'loading_results' | 'results';
