import { supabase } from './supabaseClient';

/**
 * EXEMPLES D'UTILISATION SUPABASE
 * Ces fonctions montrent comment interagir avec la base de données et l'auth.
 */

// 1. Authentification : Connexion / Inscription via Magic Link (Email sans mot de passe)
export const signInWithEmail = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      // Rediriger vers l'URL actuelle après le clic sur le lien email
      emailRedirectTo: window.location.href, 
    },
  });
  return { data, error };
};

// 2. Créer un utilisateur (Méthode classique Email/Password)
export const signUpNewUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// 3. Lire les stocks
export const fetchStocks = async () => {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
};

// 4. Insérer un produit
export const addProduct = async (productName: string, quantity: number, category: string) => {
  const { data, error } = await supabase
    .from('stocks')
    .insert([
      { 
        name: productName, 
        quantity: quantity, 
        category: category,
        status: quantity < 2 ? 'LOW' : 'OK', // Logique métier simple
        threshold: 2,
        unit: 'unit'
      },
    ])
    .select(); // .select() renvoie l'objet inséré
  return { data, error };
};

// 5. Ajouter un ticket de caisse (Exemple conceptuel, stockage des métadonnées)
export const addReceipt = async (storeName: string, totalAmount: number, items: any[]) => {
  // On suppose une table 'receipts'
  const { data, error } = await supabase
    .from('receipts')
    .insert([
      { 
        store: storeName, 
        total: totalAmount, 
        scanned_at: new Date(),
        raw_items_json: items // Supabase gère le JSON nativement
      },
    ]);
  return { data, error };
};