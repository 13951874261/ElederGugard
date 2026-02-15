package com.antigravity.elderguardian

import android.content.Context
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject

/**
 * Singleton class to handle scam detection logic.
 * Currently uses keyword matching, but designed to be replaced by LLM in v2.0.
 */
object ScamDetector {

    private const val TAG = "ScamDetector"
    private var cachedKeywords: List<String> = listOf()
    private var lastTriggerTime: Long = 0
    private const val TRIGGER_COOLDOWN = 5000L // 5 seconds debounce

    /**
     * Update keywords from JSON string
     */
    fun updateKeywords(jsonString: String?) {
        cachedKeywords = jsonString?.replace("[", "")
            ?.replace("]", "")
            ?.replace("\"", "")
            ?.split(",")
            ?.map { it.trim() }
            ?.filter { it.isNotEmpty() } 
            ?: listOf()
        Log.d(TAG, "Keywords updated: $cachedKeywords")
    }

    /**
     * Analyze text for scam content
     * @return true if scam detected, false otherwise
     */
    fun analyzeText(text: String): String? {
        if (text.isEmpty()) return null

        // O(N) Keyword Match - To be replaced by LLM Inference in v2.0
        for (keyword in cachedKeywords) {
            if (text.contains(keyword)) {
                return keyword // Return the detected keyword
            }
        }
        return null
    }

    /**
     * Save interception log to SharedPreferences
     */
    fun logInterception(context: Context, reason: String) {
        try {
            val prefs = context.getSharedPreferences("ScamRadarPrefs", Context.MODE_PRIVATE)
            val history = prefs.getString("interception_history", "[]")
            val list = JSONArray(history)
            
            val newItem = JSONObject()
            newItem.put("time", System.currentTimeMillis())
            newItem.put("source", "Accessibility/AI")
            newItem.put("reason", reason)
            
            list.put(newItem)
            
            // Keep last 20 logs
            while (list.length() > 20) {
                list.remove(0)
            }
            
            prefs.edit().putString("interception_history", list.toString()).apply()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to save log", e)
        }
    }

    /**
     * Check if we should trigger an alert (debouncing)
     */
    fun shouldTriggerAlert(): Boolean {
        val now = System.currentTimeMillis()
        if (now - lastTriggerTime < TRIGGER_COOLDOWN) {
            return false
        }
        lastTriggerTime = now
        return true
    }
}
