package com.antigravity.elderguardian

import android.content.Context
import android.provider.Settings
import android.webkit.JavascriptInterface
import java.util.UUID

class WebAppInterface(private val mContext: Context) {

    /**
     * Get unique machine ID: AndroidID + "scam-radar-pro"
     */
    @JavascriptInterface
    fun getMachineId(): String {
        val androidId = Settings.Secure.getString(mContext.contentResolver, Settings.Secure.ANDROID_ID)
        return UUID.nameUUIDFromBytes(androidId.toByteArray()).toString() + "scam-radar-pro"
    }

    /**
     * Check if Accessibility Service is enabled
     */
    @JavascriptInterface
    fun isAccessibilityEnabled(): Boolean {
        return ElderAccessibilityService.isServiceConnected
    }

    /**
     * Launch Accessibility Settings
     */
    /**
     * Launch Accessibility Settings
     */
    @JavascriptInterface
    fun openAccessibilitySettings() {
        val intent = android.content.Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
        mContext.startActivity(intent)
    }

    /**
     * Launch Overlay Settings
     */
    @JavascriptInterface
    fun openOverlaySettings() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            val intent = android.content.Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                android.net.Uri.parse("package:" + mContext.packageName)
            )
            intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
            mContext.startActivity(intent)
        }
    }

    /**
     * Update Scam Keywords from React (Cloud/Manual)
     * expecting JSON array string e.g. '["转账", "安全账户"]'
     */
    @JavascriptInterface
    fun updateScamKeywords(jsonArrayString: String) {
        try {
            val prefs = mContext.getSharedPreferences("ScamRadarPrefs", Context.MODE_PRIVATE)
            prefs.edit().putString("keywords", jsonArrayString).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * Cleaner: Request uninstall of a package
     */
    @JavascriptInterface
    fun requestUninstallApp(packageName: String) {
        try {
            val intent = android.content.Intent(android.content.Intent.ACTION_DELETE)
            intent.data = android.net.Uri.parse("package:$packageName")
            intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
            mContext.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * Get Installed Apps (JSON)
     */
    @JavascriptInterface
    fun getInstalledApps(): String {
        val pm = mContext.packageManager
        val apps = pm.getInstalledApplications(android.content.pm.PackageManager.GET_META_DATA)
        val list = ArrayList<String>()
        
        for (app in apps) {
            // Filter out system apps if needed, or just return all
            // For MVP, returning all user apps
            if ((app.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM) == 0) {
                val name = pm.getApplicationLabel(app).toString()
                list.add("{\"name\":\"$name\", \"package\":\"${app.packageName}\"}")
            }
        }
        return "[" + list.joinToString(",") + "]"
    }
    @JavascriptInterface
    fun getInterceptionHistory(): String {
        val prefs = mContext.getSharedPreferences("ScamRadarPrefs", Context.MODE_PRIVATE)
        return prefs.getString("interception_history", "[]") ?: "[]"
    }

    /**
     * Share text via System Share Sheet (WeChat, etc.)
     */
    @JavascriptInterface
    fun shareText(text: String) {
        try {
            val intent = android.content.Intent(android.content.Intent.ACTION_SEND)
            intent.type = "text/plain"
            intent.putExtra(android.content.Intent.EXTRA_TEXT, text)
            intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
            
            val chooser = android.content.Intent.createChooser(intent, "分享周报给子女")
            chooser.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
            mContext.startActivity(chooser)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
