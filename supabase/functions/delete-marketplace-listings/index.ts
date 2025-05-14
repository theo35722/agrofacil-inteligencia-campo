
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Get environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create a Supabase client with the service role key that can bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Make sure we're dealing with a POST request
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const { searchQuery, userIdCheck } = await req.json();
    
    // Validate input
    if (!searchQuery || typeof searchQuery !== "string") {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // First, find the matching products
    const { data: matchingProducts, error: findError } = await supabase
      .from('marketplace_products')
      .select('id, title')
      .ilike('title', `%${searchQuery}%`);

    if (findError) {
      console.error("Error finding products:", findError);
      throw new Error(`Error finding products: ${findError.message}`);
    }

    if (!matchingProducts || matchingProducts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `No listings found with title similar to "${searchQuery}"` 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Found ${matchingProducts.length} listings to delete`);
    
    // Perform the deletion using the service role key (bypasses RLS)
    const { data: deletedData, error: deleteError } = await supabase
      .from('marketplace_products')
      .delete()
      .ilike('title', `%${searchQuery}%`)
      .select();

    if (deleteError) {
      console.error("Error deleting products:", deleteError);
      throw new Error(`Error deleting products: ${deleteError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        deleted: deletedData,
        count: deletedData?.length || 0,
        message: `Successfully deleted ${deletedData?.length || 0} listings` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
