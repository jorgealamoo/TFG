
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async signUp(credentials: {email: string, username: string, password: string, repeatPassword: string}) {
    return new Promise(async (resolve, reject) => {
      if (credentials.password !== credentials.repeatPassword) {
        reject('Passwords do not match');
      }

      const {error, data} = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("Error in supabase.auth.signUp() method", error);
        reject(error);
      }

      if (data?.user) {
        await this.updateUsername(data.user.id, credentials.username); // Call the function to update username
        resolve(data);
      } else {
        reject('User not found after sign-up');
      }
    });
  }

  async signIn(credentials: {email: string, password: string}) {
    return new Promise(async (resolve, reject) => {
      const {error, data} = await this.supabase.auth.signInWithPassword(credentials);
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  async signOut() {
    await this.supabase.auth.signOut();

    this.supabase.getChannels().map(sup => {
      this.supabase.removeChannel(sup);
    });

    this.router.navigate(['/']);
  }

  async updateUsername(userId: string, username: string) {
    const {error} = await this.supabase
      .from('users')
      .update({username: username})
      .eq('id', userId);

    if (error) {
      console.error("Error updating username", error);
    }
  }

  getTodos() {
    return this.supabase.from('todos').select('*');
  }
}
