import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {Router} from "@angular/router";
import {v4 as uuidv4} from 'uuid';

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

    this.router.navigate(['']);
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
          return;
        }

        const { data: userData, error: userError } = await this.supabase
          .from('users')
          .select('created_events')
          .eq('id', eventData.creatorUser)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
          reject(userError);
          return;
        }

        const updatedCreatedEvents = Array.isArray(userData.created_events)
          ? [...new Set([...userData.created_events, uuid])]
          : [uuid];

        const { error: updateError } = await this.supabase
          .from('users')
          .update({ created_events: updatedCreatedEvents })
          .eq('id', eventData.creatorUser);

        if (updateError) {
          console.error('Error updating user with created event:', updateError);
          reject(updateError);
          return;
        }

        resolve(data);

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

  async getUserProfileData(userId: string): Promise<{
    username: string;
    name: string;
    surname: string;
    profile_image: string | null;
    followersCount: number;
    followingCount: number;
    createdEventsCount: number;
  } | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('username, name, surname, profile_image, followers, following, created_events')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile data:', error);
        return null;
      }

      return {
        username: data.username,
        name: data.name,
        surname: data.surname,
        profile_image: data.profile_image ?? null,
        followersCount: Array.isArray(data.followers) ? data.followers.length : 0,
        followingCount: Array.isArray(data.following) ? data.following.length : 0,
        createdEventsCount: Array.isArray(data.created_events) ? data.created_events.length : 0
      };
    } catch (err) {
      console.error('Unexpected error fetching user profile data:', err);
      return null;
    }
  }

  async getEditProfileData(userId: string): Promise<{
    email: string;
    username: string;
    name: string;
    surname: string;
    profile_image: string | null;
  } | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('email, username, name, surname, profile_image')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching edit profile data:', error);
        return null;
      }

      return {
        email: data.email,
        username: data.username,
        name: data.name,
        surname: data.surname,
        profile_image: data.profile_image ?? null
      };
    } catch (err) {
      console.error('Unexpected error fetching edit profile data:', err);
      return null;
    }
  }

  async getMyCreatedEventsByUserId(userId: string): Promise<any[]> {
    try {
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('created_events, username, profile_image')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        return [];
      }

      const eventIds = userData.created_events;
      if (!eventIds || eventIds.length === 0) return [];

      const { data: events, error: eventsError } = await this.supabase
        .from('events')
        .select('*')
        .in('id', eventIds)
        .order('created_at', { ascending: false });

      if (eventsError || !events) {
        console.error('Error fetching events:', eventsError);
        return [];
      }

      return events.map(event => ({
        ...event,
        imageUrls: event.images ?? [],
        creatorUsername: userData.username,
        profileImage: userData.profile_image,
      }));
    } catch (err) {
      console.error('Unexpected error fetching enriched events:', err);
      return [];
    }
  }

  async getCreatedEventsByUserId(userId: string): Promise<any[]> {
    try {
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('created_events, username, profile_image')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        return [];
      }

      const eventIds = userData.created_events;
      if (!eventIds || eventIds.length === 0) return [];

      const { data: events, error: eventsError } = await this.supabase
        .from('events')
        .select('*')
        .eq('privacy', 'public')
        .in('id', eventIds)
        .order('created_at', { ascending: false });

      if (eventsError || !events) {
        console.error('Error fetching events:', eventsError);
        return [];
      }

      return events.map(event => ({
        ...event,
        imageUrls: event.images ?? [],
        creatorUsername: userData.username,
        profileImage: userData.profile_image,
      }));
    } catch (err) {
      console.error('Unexpected error fetching enriched events:', err);
      return [];
    }
  }

  async followUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (currentUserId === targetUserId) return;

    try {
      const { data: currentUserData, error: currentUserError } = await this.supabase
        .from('users')
        .select('following')
        .eq('id', currentUserId)
        .single();

      const { data: targetUserData, error: targetUserError } = await this.supabase
        .from('users')
        .select('followers')
        .eq('id', targetUserId)
        .single();

      if (currentUserError || targetUserError) {
        throw new Error('Could not retrieve user data');
      }

      const updatedFollowing = Array.from(new Set([...(currentUserData?.following || []), targetUserId]));
      const updatedFollowers = Array.from(new Set([...(targetUserData?.followers || []), currentUserId]));

      const { error: updateCurrentUserError } = await this.supabase
        .from('users')
        .update({ following: updatedFollowing })
        .eq('id', currentUserId);

      const { error: updateTargetUserError } = await this.supabase
        .from('users')
        .update({ followers: updatedFollowers })
        .eq('id', targetUserId);

      if (updateCurrentUserError || updateTargetUserError) {
        throw new Error('Error following the user');
      }
    } catch (err) {
      console.error('Error in followUser:', err);
      throw err;
    }
  }

  async unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (currentUserId === targetUserId) return;

    try {
      const { data: currentUserData } = await this.supabase
        .from('users')
        .select('following')
        .eq('id', currentUserId)
        .single();

      const { data: targetUserData } = await this.supabase
        .from('users')
        .select('followers')
        .eq('id', targetUserId)
        .single();

      const updatedFollowing = (currentUserData?.following || []).filter((id: string) => id !== targetUserId);
      const updatedFollowers = (targetUserData?.followers || []).filter((id: string) => id !== currentUserId);

      await this.supabase
        .from('users')
        .update({ following: updatedFollowing })
        .eq('id', currentUserId);

      await this.supabase
        .from('users')
        .update({ followers: updatedFollowers })
        .eq('id', targetUserId);
    } catch (err) {
      console.error('Error in unfollowUser:', err);
      throw err;
    }
  }

  async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('following')
        .eq('id', currentUserId)
        .single();

      if (error) throw error;

      return (data?.following || []).includes(targetUserId);
    } catch (err) {
      console.error('Error checking if user is already followed:', err);
      return false;
    }
  }

  async getEventsFromFollowedUsers(userid: string, limit: number = 10, offset: number = 0): Promise<any[]> {
    const {data: userData, error: userError} = await this.supabase
      .from('users')
      .select('following')
      .eq('id', userid)
      .single();

    if (userError || !userData) throw userError || new Error('User not found');

    const followedUserIds: string[] = userData.following || [];
    if (followedUserIds.length === 0) return [];

    const { data: usersData, error: usersError } = await this.supabase
      .from('users')
      .select('id, username, profile_image')
      .in('id', followedUserIds);
    if (usersError) throw usersError;

    const userMap = new Map(usersData.map(user => [user.id, user]));

    const { data: eventsData, error: eventsError } = await this.supabase
      .from('events')
      .select('*')
      .eq('privacy', 'public')
      .in('creator_user', followedUserIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (eventsError) throw eventsError;

    return eventsData.map(event => ({
      ...event,
      creatorUsername: userMap.get(event.creator_user)?.username ?? 'Unknown',
      profileImage: userMap.get(event.creator_user)?.profile_image ?? null,
      imageUrls: event.images ?? []
    }));
  }

  async joinEvent(userId: string, eventId: string): Promise<void> {
    try {
      const { data: eventData, error: eventError } = await this.supabase
        .from('events')
        .select('participants')
        .eq('id', eventId)
        .single();

      if (eventError) console.error('Error getting event data:', eventError);

      const updatedParticipants = Array.from(new Set([
        ...(eventData?.participants || []),
        userId,
      ]));

      const { error: updateEventError } = await this.supabase
        .from('events')
        .update({ participants: updatedParticipants })
        .eq('id', eventId);

      if (updateEventError) console.error('Error updating event participants:', updateEventError);

      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('joined_events')
        .eq('id', userId)
        .single();

      if (userError) console.error('Error fetching user data:', userError);

      const updatedJoinedEvents = Array.from(new Set([
        ...(userData?.joined_events || []),
        eventId,
      ]));

      const { error: updateUserError } = await this.supabase
        .from('users')
        .update({ joined_events: updatedJoinedEvents })
        .eq('id', userId);

      if (updateUserError) console.error('Error updating user joined events:', updateUserError);

    } catch (err) {
      console.error('Error joining event:', err);
      throw err;
    }
  }

  async getJoinedEvents(
    userId: string,
    filter: 'all' | 'upcoming' | 'past' = 'all',
    sortBy: 'date_desc' | 'date_asc' | 'creator' = 'date_desc',
    limit: number = 10,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('joined_events')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('User not found');
        return [];
      }

      const joinedEventIds: string[] = userData.joined_events || [];
      if (joinedEventIds.length === 0) return [];

      const { data: usersData, error: usersError } = await this.supabase
        .from('users')
        .select('id, username, profile_image');

      if (usersError) throw usersError;
      const userMap = new Map(usersData.map(user => [user.id, user]));

      let query = this.supabase
        .from('events')
        .select('*')
        .in('id', joinedEventIds);

      const today = new Date().toISOString();

      if (filter === 'upcoming') {
        query = query.gte('created_at', today);
      } else if (filter === 'past') {
        query = query.lt('created_at', today);
      }

      if (sortBy === 'date_asc') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'date_desc') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'creator') {
        query = query.order('creator_user', { ascending: true });
      }

      query = query.range(offset, offset + limit - 1);

      const { data: eventsData, error: eventsError } = await query;
      if (eventsError) {
        console.error('Error fetching joined events:', eventsError);
        return [];
      }

      return eventsData.map(event => ({
        ...event,
        creatorUsername: userMap.get(event.creator_user)?.username ?? 'Unknown',
        profileImage: userMap.get(event.creator_user)?.profile_image ?? null,
        imageUrls: event.images ?? []
      }));
    } catch (err) {
      console.error('Unexpected error fetching joined events:', err);
      return [];
    }
  }

  async updateProfile(userId: string, data: any) {
    try {
      let imageUrl = null;

      if (data.profile_image instanceof File) {
        const file = data.profile_image;
        const uniqueName = `${userId}-${Date.now()}-${file.name}`;
        const filePath = `${uniqueName}`;

        const { error: uploadError } = await this.supabase.storage
          .from('profile-pictures')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) console.error('Error uploading profile image:', uploadError);

        const { data: urlData } = this.supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const updateData = {
        ...data,
        ...(imageUrl && { profile_image: imageUrl })
      };

      if (updateData.profile_image instanceof File) {
        delete updateData.profile_image;
      }

      const { error } = await this.supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) console.error('Error updating user profile:', error);
    } catch (err) {
      console.error('Unexpected error updating profile:', err);
      throw err;
    }
  }

  async changePassword(newPassword: string): Promise<void> {
    try {
      const { data: userData, error: userError } = await this.supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error('Could not get current user');
      }

      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Error changing password:', error);
      }
    } catch (err) {
      console.error('Unespected error changing password:', err);
    }
  }

  async verifyCurrentPassword(password: string): Promise<boolean> {
    const { data, error: userError } = await this.supabase.auth.getUser();

    if (userError || !data?.user?.email) {
      console.error('Error getting user email:', userError);
      return false;
    }

    const email = data.user.email;

    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    return !error;
  }

  async getFollowersByUserId(userId: string) {
    const { data: profile, error: profileError } = await this.supabase
      .from('users')
      .select('followers')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.followers || profile.followers.length === 0) {
      console.error('Error loading followers array:', profileError);
      return [];
    }

    const followerIds = profile.followers;

    const { data: followersData, error: followersError } = await this.supabase
      .from('users')
      .select('id, username, profile_image')
      .in('id', followerIds);

    if (followersError) {
      console.error('Error loading follower profiles:', followersError);
      return [];
    }

    return followersData;
  }

  async getFollowingByUserId(userId: string) {
    const { data: profile, error: profileError } = await this.supabase
      .from('users')
      .select('following')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.following || profile.following.length === 0) {
      console.error('Error loading following array:', profileError);
      return [];
    }

    const followingIds = profile.following;

    const { data: followingData, error: followingError } = await this.supabase
      .from('users')
      .select('id, username, profile_image')
      .in('id', followingIds);

    if (followingError) {
      console.error('Error loading following profiles:', followingError);
      return [];
    }

    return followingData;
  }

  async searchEventsPaginated(query: string, limit: number, offset: number): Promise<any[]> {
    if (!query || query.trim() === '') return [];

    const { data: eventsData, error: eventsError } = await this.supabase
      .from('events')
      .select('*')
      .eq('privacy', 'public')
      .ilike('title', `%${query.trim()}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (eventsError) throw eventsError;
    if (!eventsData || eventsData.length === 0) return [];

    const creatorIds = [...new Set(eventsData.map(e => e.creator_user))];

    const { data: usersData, error: usersError } = await this.supabase
      .from('users')
      .select('id, username, profile_image')
      .in('id', creatorIds);

    if (usersError) throw usersError;

    const userMap = new Map(usersData.map(user => [user.id, user]));

    return eventsData.map(event => ({
      ...event,
      creatorUsername: userMap.get(event.creator_user)?.username ?? 'Unknown',
      profileImage: userMap.get(event.creator_user)?.profile_image ?? null,
      imageUrls: event.images ?? []
    }));
  }

  async getRecommendedEvents(limit: number = 5, offset: number = 0): Promise<any[]> {
    const { data: eventsData, error: eventsError } = await this.supabase
      .from('events')
      .select('*')
      .eq('privacy', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (eventsError) throw eventsError;

    const creatorIds = [...new Set(eventsData.map(e => e.creator_user))];

    const { data: usersData, error: usersError } = await this.supabase
      .from('users')
      .select('id, username, profile_image')
      .in('id', creatorIds);

    if (usersError) throw usersError;

    const userMap = new Map(usersData.map(user => [user.id, user]));

    return eventsData.map(event => ({
      ...event,
      creatorUsername: userMap.get(event.creator_user)?.username ?? 'Unknown',
      profileImage: userMap.get(event.creator_user)?.profile_image ?? null,
      imageUrls: event.images ?? []
    }));
  }

  async getEventMoreInfo(eventId: string): Promise<{
    title: string;
    shopping_list: { name: string; price: number }[];
    total_price: number;
    entry_price: number;
    split_costs_enabled: boolean;
    max_participants_enabled: boolean;
    max_participants: number;
    participants: { username: string; profile_image: string; id: string | null }[];
    creatorUsername: string;
    creatorUserId: string;
  } | null> {
    const { data: event, error: eventErr } = await this.supabase
      .from('events')
      .select(`title, shopping_list, total_price, entry_price, split_costs_enabled, creator_user,
      max_participants_enabled, max_participants, participants`)
      .eq('id', eventId)
      .single();

    if (eventErr || !event) {
      console.error('Error fetching event:', eventErr);
      return null;
    }

    const { data: user, error: userErr } = await this.supabase
      .from('users')
      .select('username')
      .eq('id', event.creator_user)
      .single();

    if (userErr || !user) {
      console.error('Error fetching creator user:', userErr);
      return null;
    }

    let participantsData: { username: string; profile_image: string; id: string | null }[] = [];
    if (event.participants && event.participants.length > 0) {
      const { data: participants, error: participantsErr } = await this.supabase
        .from('users')
        .select('username, profile_image, id')
        .in('id', event.participants);

      if (participantsErr) {
        console.error('Error fetching participants:', participantsErr);
        return null;
      }

      participantsData = participants || [];
    }

    return {
      title: event.title,
      shopping_list: event.shopping_list,
      total_price: event.total_price,
      entry_price: event.entry_price,
      split_costs_enabled: event.split_costs_enabled,
      max_participants_enabled: event.max_participants_enabled,
      max_participants: event.max_participants,
      participants: participantsData,
      creatorUsername: user.username,
      creatorUserId: event.creator_user
    };
  }

  async leaveEvent(userId: string | null, eventId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data: userData, error: userError } = await this.supabase
          .from('users')
          .select('joined_events')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user joined events:', userError);
          reject(userError);
          return;
        }

        const updatedJoinedEvents = Array.isArray(userData.joined_events)
          ? userData.joined_events.filter((id: string) => id !== eventId)
          : [];

        const { error: updateUserError } = await this.supabase
          .from('users')
          .update({ joined_events: updatedJoinedEvents })
          .eq('id', userId);

        if (updateUserError) {
          console.error('Error updating user joined events:', updateUserError);
          reject(updateUserError);
          return;
        }

        const { data: eventData, error: eventError } = await this.supabase
          .from('events')
          .select('participants')
          .eq('id', eventId)
          .single();

        if (eventError) {
          console.error('Error fetching event participants:', eventError);
          reject(eventError);
          return;
        }

        const updatedParticipants = Array.isArray(eventData.participants)
          ? eventData.participants.filter((id: string) => id !== userId)
          : [];

        const { error: updateEventError } = await this.supabase
          .from('events')
          .update({ participants: updatedParticipants })
          .eq('id', eventId);

        if (updateEventError) {
          console.error('Error updating event participants:', updateEventError);
          reject(updateEventError);
          return;
        }

        resolve();
      } catch (err) {
        console.error('Unexpected error in leaveEvent:', err);
        reject(err);
      }
    });
  }

  async updateShoppingList(
    eventId: string,
    shoppingList: any[],
    totalPrice: number,
    entryPrice: number,
    splitCostsEnabled: boolean
  ) {
    const { data, error } = await this.supabase
      .from('events')
      .update({
        shopping_list: shoppingList,
        total_price: totalPrice,
        entry_price: entryPrice,
        split_costs_enabled: splitCostsEnabled
      })
      .eq('id', eventId);

    return { data, error };
  }

  async searchUsersByUsername(query: string): Promise<any[]> {
    if (!query || query.trim() === '') return [];

    const {
      data: { user: currentUser },
      error: authError
    } = await this.supabase.auth.getUser();

    if (authError) {
      console.error('Error fetching authenticated user:', authError);
      return [];
    }
    if (!currentUser) return [];

    const { data, error } = await this.supabase
      .from('users')
      .select('id, username, profile_image')
      .ilike('username', `%${query.trim()}%`)
      .neq('id', currentUser.id)

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data || [];
  }

  async sendEventInvitations(
    invitedUsers: any[],
    eventId: string,
    eventTitle: string,
    invitedById: string | null
  ): Promise<void> {
    const { data: invitedByUser, error: userError } = await this.supabase
      .from('users')
      .select('username')
      .eq('id', invitedById)
      .single();

    if (userError || !invitedByUser) {
      console.error('Error fetching inviter username:', userError);
      return;
    }

    const invitedByUsername = invitedByUser.username;

    const notifications = invitedUsers.map(user => ({
      user_id: user.id,
      type: 'event_invitation',
      data: {
        event_id: eventId,
        invited_by: invitedById,
        message: `🎉 ${invitedByUsername} invited you to "${eventTitle}".`
      },
      is_read: false
    }));

    const { error } = await this.supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('Error sending invitations:', error);
    }
  }

}
