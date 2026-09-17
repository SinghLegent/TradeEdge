import { supabase } from './supabase';
import { Trade } from '../types';

// Fetch all trades for the logged-in user
export async function fetchTrades(): Promise<Trade[]> {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading trades:', error.message);
    return [];
  }
  
  // Ensure timestamp exists on the client side even if missing in DB
  return data.map((t: any) => ({
    ...t,
    timestamp: t.timestamp || new Date(t.date || t.created_at).getTime()
  })) as Trade[];
}

// Add or update a trade
export async function addTrade(tradeData: Trade): Promise<Trade> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // We omit `timestamp` from the DB insert just in case their table doesn't have it, 
  // since `created_at` or `date` can be used.
  const { timestamp, ...dbData } = tradeData as any;

  // Supabase "upsert" is great for inserting new or updating existing by Primary Key
  const { data, error } = await supabase
    .from('trades')
    .upsert([{ ...dbData, user_id: user.id }])
    .select();

  if (error) throw new Error(error.message);
  
  const saved = data[0];
  return {
    ...saved,
    timestamp: saved.timestamp || new Date(saved.date || saved.created_at).getTime()
  } as Trade;
}

// Delete a trade
export async function removeTrade(tradeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', tradeId);

  if (error) throw new Error(error.message);
  return true;
}
