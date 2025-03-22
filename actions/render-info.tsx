"use server";

import "server-only";

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  // @ts-ignore
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// export default async function renderInfo({ name }: { name: string }) {
//   // Securely fetch data from an API, and read environment variables...
//   const { data, error } = await supabase.from("games").select(`
//         *,
//         players:game_player!inner (
//             id:player_id, team:team_id, player:players!player_id(name, created_at))
//         )
//     `);
//
//   console.log(data);
//
//   return (
//     <ScrollView style={{ height: 300 }}>
//       <Text style={{ color: "red", padding: 20 }}>{JSON.stringify(error)}</Text>
//       {data?.map((item) => (
//         <Text style={{ color: "white", padding: 20 }}>
//           {JSON.stringify(item)}
//         </Text>
//       ))}
//     </ScrollView>
//   );
// }
