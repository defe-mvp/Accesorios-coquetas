
import { createClient } from '@supabase/supabase-js';

// ADVERTENCIA: Debes reemplazar estos valores con los que aparecen en tu panel de Supabase:
// Settings -> API -> Project URL y Anon Key
const supabaseUrl = 'https://ubtqzktusrpjdhpxdvoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidHF6a3R1c3JwamRocHhkdm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODA5MTgsImV4cCI6MjA4NjM1NjkxOH0.agVNNrl6-Bsj9zA8yFl_IVoYbkU6RSQNBiDkGPFdqfA';

export const supabase = createClient(supabaseUrl, supabaseKey);
