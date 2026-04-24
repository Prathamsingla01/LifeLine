// services/notificationService.js
// ──────────────────────────────────────────────────────────────
//  Push via Firebase FCM  →  falls back to Twilio SMS
//  when the paramedic's device has no data connection.
// ──────────────────────────────────────────────────────────────
const admin    = require("../config/firebase");
const twilio   = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const supabase = require("../config/supabase");

class NotificationService {
  /**
   * Send a push notification to a specific paramedic.
   * Automatically falls back to SMS if FCM fails or token is absent.
   *
   * @param {string} paramedic_id  - UUID of the paramedic profile
   * @param {{ title, body, data }} payload
   */
  static async sendToParamedic(paramedic_id, payload) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("fcm_token, phone")
      .eq("id", paramedic_id)
      .single();

    if (!profile) {
      console.warn(`⚠️  No profile found for paramedic ${paramedic_id}`);
      return;
    }

    // ── 1. Try FCM push first ─────────────────────────────────
    if (profile.fcm_token) {
      try {
        await admin.messaging().send({
          token: profile.fcm_token,
          notification: { title: payload.title, body: payload.body },
          data: payload.data || {},
          android: { priority: "high" },
          apns:    { payload: { aps: { sound: "emergency.caf", badge: 1 } } },
        });
        console.log(`✅ FCM push sent to paramedic ${paramedic_id}`);
        return;
      } catch (fcmErr) {
        console.warn(`⚠️  FCM failed (${fcmErr.code}), falling back to SMS`);
      }
    }

    // ── 2. SMS fallback via Twilio ────────────────────────────
    if (profile.phone) {
      try {
        const smsBody = `[LifeLine] ${payload.title}\n${payload.body}`;
        await twilio.messages.create({
          body: smsBody,
          from: process.env.TWILIO_PHONE_NUMBER,
          to:   profile.phone,
        });
        console.log(`✅ Twilio SMS sent to ${profile.phone}`);
      } catch (smsErr) {
        console.error(`❌ SMS also failed: ${smsErr.message}`);
      }
    } else {
      console.warn(`⚠️  No FCM token or phone for paramedic ${paramedic_id}. Alert not delivered.`);
    }
  }

  /**
   * Broadcast an alert to all hospital staff of a given hospital.
   */
  static async broadcastToHospital(hospital_id, payload) {
    const { data: staff } = await supabase
      .from("profiles")
      .select("id, fcm_token, phone")
      .eq("hospital_id", hospital_id)
      .eq("role", "hospital_staff");

    const sends = (staff || []).map((s) =>
      this.sendToParamedic(s.id, payload)   // reuse same push/SMS logic
    );
    await Promise.allSettled(sends);
  }

  /**
   * Send an SMS directly (e.g., patient confirmation, OTP).
   */
  static async sendSMS(phone, message) {
    return twilio.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to:   phone,
    });
  }
}

module.exports = NotificationService;
