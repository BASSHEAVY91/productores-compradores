import { UserRole } from './role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  location?: string;
  contactMethod?: ContactMethod;
  contactValue?: string;
}

export interface ContactMethod {
  type: 'whatsapp' | 'phone' | 'email';
  value: string;
}
