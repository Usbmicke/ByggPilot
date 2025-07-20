import { purgeCache } from "@netlify/functions";

export default async (req, context) => {
  try {
    console.log('🧹 Purging Netlify CDN cache...');
    
    // Rensa hela sajten - vi vill bli av med gamla Firebase-cachen
    await purgeCache({ 
      tags: ["all"], // Använd en bred tagg för att rensa allt
      site_slug: context.site?.name || "byggpilot" 
    });
    
    console.log('✅ Cache purged successfully!');
    
    return new Response(JSON.stringify({
      success: true,
      message: "CDN cache has been purged! Old Firebase files should be cleared.",
      timestamp: new Date().toISOString()
    }), { 
      status: 202,
      headers: {
        "Content-Type": "application/json"
      }
    });
    
  } catch (error) {
    console.error('❌ Cache purge failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
