
import { supabase } from '@/lib/supabase';

/**
 * Bootstrap utility function to create the first team leader
 * This will be implemented in Page 2 (Router/Profile Loading)
 * 
 * Purpose: If no team_leader or admin exists in the system,
 * allow the first user to become a team_leader automatically
 */
export async function bootstrapFirstLeader(userId: string): Promise<boolean> {
  try {
    console.log('Bootstrap: Checking if first leader setup is needed');
    
    // Check if any team_leader or admin exists
    const { data: existingLeaders, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['team_leader', 'admin'])
      .limit(1);

    if (checkError) {
      console.error('Bootstrap: Error checking for existing leaders', checkError);
      return false;
    }

    // If leaders exist, no bootstrap needed
    if (existingLeaders && existingLeaders.length > 0) {
      console.log('Bootstrap: Leaders already exist, no bootstrap needed');
      return false;
    }

    // No leaders exist - this user can become the first team_leader
    console.log('Bootstrap: No leaders found, promoting user to team_leader');
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: 'team_leader',
        approved: true,
        status: 'active'
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Bootstrap: Error promoting user to team_leader', updateError);
      return false;
    }

    console.log('Bootstrap: User successfully promoted to team_leader');
    return true;
  } catch (error) {
    console.error('Bootstrap: Exception during bootstrap', error);
    return false;
  }
}
