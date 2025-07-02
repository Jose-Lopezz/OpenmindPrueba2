import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);
  
  // Mock users for demonstration
  private mockUsers = [
    { id: '1', name: 'Juan Pérez', email: 'juan@email.com', password: '123456' },
    { id: '2', name: 'María García', email: 'maria@email.com', password: '123456' }
  ];

  get user() {
    return this.userSignal.asReadonly();
  }

  get isAuthenticated() {
    return this.userSignal() !== null;
  }

  login(email: string, password: string): Observable<boolean> {
    const foundUser = this.mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      this.userSignal.set({ 
        id: foundUser.id, 
        name: foundUser.name, 
        email: foundUser.email 
      });
      return of(true).pipe(delay(1000));
    }
    
    return of(false).pipe(delay(1000));
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    const newUser = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      email, 
      password 
    };
    
    this.mockUsers.push(newUser);
    this.userSignal.set({ 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email 
    });
    
    return of(true).pipe(delay(1000));
  }

  logout(): void {
    this.userSignal.set(null);
  }
}