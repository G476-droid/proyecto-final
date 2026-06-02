import { supabase } from "./supabase";

export type Species = {
  id: string;
  user_id: string;
  common_name: string | null;
  scientific_name: string | null;
  description: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  weather: string | null;
  temperature: string | null;
  created_at: string;
};

export type AIResult = {
  commonName: string;
  scientificName: string;
  description: string;
  care: string;
  confidence: string;
};

export const getMySpecies = async (): Promise<Species[]> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    throw new Error("No hay usuario autenticado.");
  }

  const { data, error } = await supabase
    .from("species")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const uploadSpeciesImage = async (imageUri: string, userId: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const fileExt = blob.type.split("/")[1] || "jpg";
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("species-images")
    .upload(fileName, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("species-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const analyzeImageWithAI = async (imageUri: string): Promise<{
  imageUrl: string;
  aiResult: AIResult;
}> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    throw new Error("No hay usuario autenticado.");
  }

  const imageUrl = await uploadSpeciesImage(imageUri, user.id);

  const { data, error } = await supabase.functions.invoke("dynamic-task", {
  body: {
    imageUrl,
  },
});

console.log("DATA EDGE FUNCTION:", data);
console.log("ERROR EDGE FUNCTION:", error);

if (error) {
  throw new Error(error.message ?? "Error llamando a la función de IA.");
}

if (data?.error) {
  throw new Error(
    typeof data.error === "string" ? data.error : JSON.stringify(data.error)
  );
}

return {
  imageUrl,
  aiResult: data as AIResult,
};
};
export const saveSpeciesToDatabase = async ({
  commonName,
  scientificName,
  description,
  imageUrl,
  latitude,
  longitude,
  weather = "Templado",
  temperature = "22°C",
}: {
  commonName: string;
  scientificName: string;
  description: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  weather?: string;
  temperature?: string;
}) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    throw new Error("No hay usuario autenticado.");
  }

  const { error } = await supabase.from("species").insert({
    user_id: user.id,
    common_name: commonName,
    scientific_name: scientificName,
    description,
    image_url: imageUrl,
    latitude,
    longitude,
    weather,
    temperature,
  });

  if (error) {
    throw error;
  }
};