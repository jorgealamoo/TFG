
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import {Router} from "@angular/router";
import { v4 as uuidv4 } from 'uuid';

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
        await this.updateUsername(data.user.id, credentials.username);
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

  async getUserId(): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) {
        console.error('Error getting user ID:', error);
        return null;
      }
      return data.user?.id ?? null;
    } catch (err) {
      console.error('Unexpected error getting user ID:', err);
      return null;
    }
  }

  async getUsernameById(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching username:', error);
        return null;
      }

      return data.username ?? null;
    } catch (err) {
      console.error('Unexpected error fetching username:', err);
      return null;
    }
  }

  async getUserProfileImage(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('profile_image')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile image:', error);
        return null;
      }

      return data.profile_image || null;
    } catch (err) {
      console.error('Unexpected error fetching user profile image:', err);
      return null;
    }
  }


  async uploadEventImages(eventUuid: string, images: (File | string)[]): Promise<string[]> {
    const uploadedPaths: string[] = [];

    for (const image of images) {
      if (typeof image === 'string') {
        uploadedPaths.push(image);
        continue;
      }

      const fileName = image.name;
      const filePath = `${eventUuid}-images/${fileName}`;

      const { error } = await this.supabase.storage
        .from('event-images')
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading image ${fileName}`, error);
        continue;
      }

      uploadedPaths.push(filePath);
    }

    return uploadedPaths;
  }

  async createEvent(eventData: {
    uuid: string;
    title: string;
    description: string;
    categories: string[];
    location: string;
    date: string;
    hour: string;
    privacy: string;
    shoppingList: { name: string; price: number }[];
    totalPrice: number;
    maxParticipants: number;
    maxParticipantsEnabled: boolean;
    participants: string[];
    images: (File | string)[];
    splitCostsEnabled: boolean;
    entryPrice: number;
    creatorUser: string;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const uuid = eventData.uuid || uuidv4();

        const imagePaths = await this.uploadEventImages(uuid, eventData.images);

        const { data, error } = await this.supabase
          .from('events')
          .insert([
            {
              id: uuid,
              title: eventData.title,
              description: eventData.description,
              categories: eventData.categories,
              location: eventData.location,
              date: eventData.date,
              hour: eventData.hour,
              privacy: eventData.privacy,
              shopping_list: eventData.shoppingList,
              total_price: eventData.totalPrice,
              max_participants: eventData.maxParticipants,
              max_participants_enabled: eventData.maxParticipantsEnabled,
              participants: eventData.participants,
              images: imagePaths,
              split_costs_enabled: eventData.splitCostsEnabled,
              entry_price: eventData.entryPrice,
              creator_user: eventData.creatorUser
            }
          ]);

        if (error) {
          console.error('Error creating event:', error);
          reject(error);
        } else {
          resolve(data);
        }
      } catch (err) {
        console.error('Unexpected error creating event:', err);
        reject(err);
      }
    });
  }

  getEventImageUrl(path: string): string {
    const { data } = this.supabase.storage
      .from('event-images')
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async getEventById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event by ID:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error fetching event:', err);
      throw err;
    }
  }

}
