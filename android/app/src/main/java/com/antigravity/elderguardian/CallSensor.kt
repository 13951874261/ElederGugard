package com.antigravity.elderguardian

import android.content.Context
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import android.util.Log

/**
 * Monitors phone call states (Ringing, Offhook, Idle).
 * Acts as a sensor to trigger "Scam Radar" audio analysis (future).
 */
class CallSensor(private val context: Context) {
    
    private val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    private var isListening = false

    private val phoneStateListener = object : PhoneStateListener() {
        override fun onCallStateChanged(state: Int, phoneNumber: String?) {
            super.onCallStateChanged(state, phoneNumber)
            val stateStr = when (state) {
                TelephonyManager.CALL_STATE_IDLE -> "IDLE"
                TelephonyManager.CALL_STATE_RINGING -> "RINGING"
                TelephonyManager.CALL_STATE_OFFHOOK -> "OFFHOOK" // Active Call
                else -> "UNKNOWN"
            }
            
            Log.d("ElderGuardian", "Call State: $stateStr")

            // Log meaningful events to ScamDetector
            if (state == TelephonyManager.CALL_STATE_RINGING) {
                 ScamDetector.logInterception(context, "Call Ringing: Potential Scam Check Started")
            } else if (state == TelephonyManager.CALL_STATE_OFFHOOK) {
                 ScamDetector.logInterception(context, "Call Answered: Audio Analysis Ready")
            }
        }
    }

    fun start() {
        if (!isListening) {
            try {
                telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE)
                isListening = true
                Log.d("ElderGuardian", "CallSensor Started")
            } catch (e: SecurityException) {
                Log.e("ElderGuardian", "Permission missing for CallSensor", e)
            }
        }
    }

    fun stop() {
        if (isListening) {
            telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_NONE)
            isListening = false
            Log.d("ElderGuardian", "CallSensor Stopped")
        }
    }
}
