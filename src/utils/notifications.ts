import emailjs from '@emailjs/browser';
import { DeviceData } from './dataGenerator';

const EMAILJS_SERVICE_ID = 'service_your_id';
const EMAILJS_TEMPLATE_ID = 'template_your_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';
const TWILIO_ACCOUNT_SID = 'your_account_sid';
const TWILIO_AUTH_TOKEN = 'your_auth_token';
const TWILIO_PHONE_NUMBER = 'your_twilio_number';

export const sendNotifications = async (deviceType: string, data: DeviceData) => {
  const timestamp = new Date().toLocaleString();
  const deviceName = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
  
  // Prepare the alert message
  const getAlertMessage = () => {
    if (deviceType === 'ventilator') {
      if (data.metrics.temperature! >= 38) return 'High Temperature';
      if (data.metrics.pressure! >= 35) return 'High Pressure';
      if (data.metrics.oxygenLevel! <= 88) return 'Low Oxygen Level';
      if (data.metrics.firmwareStatus === 'Unresponsive') return 'Firmware Unresponsive';
    } else {
      if (data.metrics.temperature! >= 40) return 'High Temperature';
      if (data.metrics.batteryVoltage! <= 10.5) return 'Low Battery';
      if (Math.abs(data.metrics.ecgSignal!) >= 0.9) return 'Abnormal ECG Signal';
      if (data.metrics.capacitorStatus === 'Not Ready') return 'Capacitor Not Ready';
    }
    return 'Unknown Issue';
  };

  const alertMessage = getAlertMessage();

  // Email content
  const emailParams = {
    to_email: 'anoushka.explore@gmail.com',
    subject: `Technician Alert: ${deviceName} Issue Detected`,
    device_type: deviceName,
    issue: alertMessage,
    timestamp: timestamp,
    metrics: JSON.stringify(data.metrics, null, 2)
  };

  // WhatsApp message content
  const whatsappMessage = `🚨 ALERT: ${deviceName} requires attention!\n\nIssue: ${alertMessage}\nTime: ${timestamp}\n\nPlease check the system immediately.`;

  try {
    // Send email
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailParams,
      EMAILJS_PUBLIC_KEY
    );

    // Send WhatsApp message using Twilio
    const twilioClient = await import('twilio');
    const client = twilioClient.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    await client.messages.create({
      body: whatsappMessage,
      from: `whatsapp:${TWILIO_PHONE_NUMBER}`,
      to: 'whatsapp:+917304199985'
    });

    console.log('Notifications sent successfully');
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};