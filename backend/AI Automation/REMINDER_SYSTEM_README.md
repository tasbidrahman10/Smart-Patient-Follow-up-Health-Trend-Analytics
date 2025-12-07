# Patient Follow-up Reminder System Setup

## Overview
The reminder system has been integrated into your Smart Patient Follow-up System. It provides automated email/SMS reminders to patients one day before their scheduled follow-up appointments.

## New Features Added

### 1. Database Tables
Run the following SQL file to create the necessary tables:
```bash
mysql -u your_username -p smart_patient_followup < reminders.sql
```

### 2. Backend API Endpoints
New reminder routes have been added to your backend:
- `GET /api/reminders/dashboard` - Get reminder dashboard data
- `GET /api/reminders/upcoming` - Get patients needing reminders (for n8n)
- `POST /api/reminders/create` - Create a reminder record
- `PUT /api/reminders/update-status/:id` - Update reminder status
- `GET /api/reminders/logs/:reminderId` - Get reminder logs
- `POST /api/reminders/send-manual` - Trigger manual reminder

### 3. Frontend - Reminder Status Dashboard
The reminders.html page now shows:
- **Status Overview**: Total reminders sent, pending, failed
- **Three Categories**: 
  - Overdue follow-ups (past due date)
  - Today's follow-ups
  - Upcoming follow-ups (next 7 days)
- **For Each Patient**: 
  - Patient details and condition
  - Follow-up date
  - Reminder status (Sent, Pending, Failed, No Reminder Set)
  - Contact options (Call/Email buttons)
  - Manual reminder send button

### 4. n8n Workflow Setup

#### Import the Workflow
1. Open your n8n instance
2. Go to Workflows > Import
3. Import the `patient_reminder_workflow.json` file

#### Configure Credentials
You'll need to set up the following credentials in n8n:

1. **MySQL Database**
   - Host: localhost (or your DB host)
   - Port: 3306
   - Database: smart_patient_followup
   - User: your_db_user
   - Password: your_db_password

2. **SMTP Email** (for email reminders)
   - Host: your_smtp_host
   - Port: 587
   - User: your_email
   - Password: your_email_password
   - SSL/TLS: Usually enabled

3. **Twilio** (for SMS reminders - optional)
   - Account SID: your_twilio_account_sid
   - Auth Token: your_twilio_auth_token
   - From Number: your_twilio_phone_number

#### Workflow Features
- **Automatic Daily Run**: Scheduled to run at 9 AM daily
- **Manual Trigger**: Can be triggered from the web app
- **Email/SMS Support**: Sends based on patient preference
- **Status Tracking**: Updates reminder status in database
- **Error Handling**: Logs failed attempts

## How It Works

1. **Daily Automation**:
   - n8n checks for patients with follow-ups tomorrow
   - Creates reminder records
   - Sends email/SMS based on patient preferences
   - Updates status to "sent" or "failed"

2. **Manual Reminders**:
   - Click "Send Reminder" button on any patient
   - Triggers n8n webhook to send immediate reminder
   - Updates status in real-time

3. **Status Tracking**:
   - All reminders are logged in the database
   - Dashboard shows current status for each reminder
   - Failed reminders can be retried manually

## Configuration

### Email Templates
The email template is included in the n8n workflow and can be customized in the "Send Email Reminder" node.

### SMS Templates
The SMS template is in the "Send SMS Reminder" node. Keep it concise due to SMS character limits.

### Reminder Preferences
Each patient can have reminder preferences:
- `email` - Email only
- `sms` - SMS only
- `both` - Both email and SMS
- `none` - No reminders

## Testing

1. **Test Database Connection**:
   ```bash
   node -e "require('./database.js')"
   ```

2. **Test Reminder API**:
   ```bash
   # Get reminder dashboard (need auth token)
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/reminders/dashboard
   ```

3. **Test n8n Workflow**:
   - Use the "Execute Workflow" button in n8n
   - Check if reminders are created and sent

## Troubleshooting

### Common Issues

1. **"Failed to fetch reminders" error**:
   - Check if backend server is running
   - Verify reminder routes are loaded in server.js
   - Check database connection

2. **Reminders not sending**:
   - Verify n8n workflow is active
   - Check SMTP/Twilio credentials
   - Look for errors in n8n execution history

3. **Wrong timezone**:
   - Adjust the schedule trigger time in n8n
   - Modify scheduled_time in reminder creation

### Logs
- Backend logs: Check console output
- n8n logs: View execution history in n8n UI
- Database logs: Check reminder_logs table

## Future Enhancements
- Add WhatsApp reminder support
- Implement reminder templates
- Add bulk reminder management
- Create reminder analytics dashboard
- Add patient confirmation tracking

## Support
For issues or questions, please check:
- Backend logs for API errors
- n8n execution logs for workflow errors
- Browser console for frontend errors
- Database reminder_logs table for reminder-specific issues