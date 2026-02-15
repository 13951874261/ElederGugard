package com.antigravity.elderguardian

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.SharedPreferences
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.util.Log

class ElderAccessibilityService : AccessibilityService() {

    companion object {
        var isServiceConnected = false
    }

    private lateinit var prefs: SharedPreferences
    private val prefsListener = SharedPreferences.OnSharedPreferenceChangeListener { _, key ->
        if (key == "keywords") {
            updateKeywords()
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        isServiceConnected = true
        Log.d("ElderGuardian", "Accessibility Service Connected")
        
        try {
            prefs = getSharedPreferences("ScamRadarPrefs", Context.MODE_PRIVATE)
            prefs.registerOnSharedPreferenceChangeListener(prefsListener)
            updateKeywords()
        } catch (e: Exception) {
            Log.e("ElderGuardian", "Failed to init prefs", e)
        }
    }

    private fun updateKeywords() {
        val keywordsJson = prefs.getString("keywords", "[\"转账\", \"安全账户\", \"投资\", \"回报率\", \"冻结\"]")
        ScamDetector.updateKeywords(keywordsJson)
    }

    private var lastScanTime: Long = 0
    private val SCAN_THROTTLE = 1000L // Scan max once every 1 second

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        // Performance Optimization 1: Skip system UI
        if (event.packageName?.toString() == "com.android.systemui") return
        
        // Performance Optimization 2: Throttle Scanning
        val now = System.currentTimeMillis()
        if (now - lastScanTime < SCAN_THROTTLE) return
        lastScanTime = now

        try {
            val rootNode = rootInActiveWindow ?: return
            checkNode(rootNode)
        } catch (e: Exception) {
            // Log.e("ElderGuardian", "Error parsing nodes", e) 
        }
    }

    private fun checkNode(node: AccessibilityNodeInfo?) {
        if (node == null) return

        if (node.text != null) {
            val text = node.text.toString()
            
            // Delegate analysis to ScamDetector (Future: LLM Inference)
            val detectedKeyword = ScamDetector.analyzeText(text)
            
            if (detectedKeyword != null) {
                Log.w("ElderGuardian", "SCAM DETECTED: $detectedKeyword in $text")
                triggerOverlay(detectedKeyword)
            }
        }

        val childCount = node.childCount
        for (i in 0 until childCount) {
            checkNode(node.getChild(i))
        }
    }

    private fun triggerOverlay(keyword: String) {
        if (!ScamDetector.shouldTriggerAlert()) return

        try {
            val intent = android.content.Intent(this, ScamOverlayService::class.java)
            startService(intent)
            
            ScamDetector.logInterception(this, "Suspected Scam Content: $keyword")
        } catch (e: Exception) {
            Log.e("ElderGuardian", "Failed to start overlay", e)
        }
    }

    override fun onInterrupt() {
        isServiceConnected = false
        Log.d("ElderGuardian", "Accessibility Service Interrupted")
        try {
             if (::prefs.isInitialized) {
                prefs.unregisterOnSharedPreferenceChangeListener(prefsListener)
            }
        } catch (e: Exception) {
            Log.e("ElderGuardian", "Error unregistering listener", e)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isServiceConnected = false
    }
}
