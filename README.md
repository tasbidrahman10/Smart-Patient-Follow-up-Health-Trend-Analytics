# 🏥 Smart Patient Follow-Up System

A comprehensive digital healthcare management solution designed to ensure continuous patient care through automated follow-up tracking, intelligent reminders and visual analytical dashboard report of patients.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Impact & Relevance](#-impact--relevance)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [System Architecture](#-system-architecture)
- [API Endpoints](#-api-endpoints)
- [Workflow](#-workflow)
- [Dependencies](#-dependencies)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **Smart Patient Follow-Up System** is an intelligent healthcare management platform that automates patient monitoring and follow-up scheduling, generates visually understanbale analytics of health vitals without human touch. By leveraging modern web technologies and workflow automation, it ensures no patient is left behind in their treatment journey, while significantly reducing the administrative burden on healthcare providers.

**Developed as part of:** CSE299 - Junior Capstone Design Project

---

## 🌍 Impact & Relevance

This system addresses critical challenges in the Bangladeshi healthcare landscape:

### 🔴 Doctor-Patient Workload Crisis
Bangladesh faces one of the world's lowest doctor-to-patient ratios. This system provides **automated supervision** that maintains vital connections between patients and healthcare providers without overwhelming medical staff.

### 💊 Treatment Adherence
In today's fast-paced environment, patients frequently miss follow-up appointments, particularly critical for chronic conditions like **hypertension** and **diabetes**. Our intelligent reminder system ensures patients stay on track with their treatment plans. It also generates health analytics which patients easily understand their health vitals' condition by simply visualing the data. It already gives them an idea about their health before visiting doctor with the report. **Doctors' feedback on patients' reports is a must which cannot be avoided.**

### 📁 Digital Transformation
Many local clinics still rely on vulnerable physical registers. This system offers a **high-impact, low-cost digitization solution** that protects patient data and ensures instant access to complete medical histories.

---

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- 👤 **Patient Management** - Complete CRUD operations for patient records
- 📊 **AI-Powered Analytics Dashboard** - Automated health trend analysis with visual insights
- ⏰ **Automated Follow-Up Reminders** - Smart scheduling system that identifies upcoming appointments
- 📧 **Multi-Channel Notifications** - Email and SMS reminder delivery via n8n workflows
- 📈 **Real-Time Status Tracking** - Monitor reminder delivery success/failure rates
- 🎨 **Dynamic Patient Dashboards** - Personalized HTML dashboards generated on-demand
- 📱 **Responsive Design** - Mobile-friendly interface built with Bootstrap 5
- 🔍 **Health Status Classification** - AI-driven analysis categorizing patients as Critical, Moderate, or Normal
- 📄 **PDF Export** - Downloadable analytics reports for offline review

---

## 🛠️ Tech Stack

### Frontend
- **Core:** HTML5, CSS3, ES6+ JavaScript
- **Framework:** Bootstrap 5 (CDN)
- **Icons:** Bootstrap Icons
- **API Communication:** Native Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API)
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Security:** CORS enabled for cross-origin requests

### Database
- **DBMS:** MySQL
- **Driver:** mysql2 (Node.js client)

### Automation & Integration
- **Workflow Engine:** n8n
- **Use Cases:** 
  - Dynamic dashboard generation
  - Email/SMS reminder delivery
  - Webhook-based triggers and callbacks

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [XAMPP](https://www.apachefriends.org/) (includes Apache & MySQL)
- [n8n](https://n8n.io/) (Workflow Automation Platform)
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Git (for cloning the repository)

---

## 💾 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-patient-followup.git
cd smart-patient-followup
```

### 2. Install Backend Dependencies

Navigate to the backend directory and install required packages:

```bash
cd backend
npm install
```

This will install all dependencies listed in `package.json`:
- express (^5.1.0)
- mysql2 (^3.15.2)
- dotenv (^17.2.3)
- cors (^2.8.5)
- bcryptjs (^3.0.2)
- jsonwebtoken (^9.0.2)
- nodemon (dev dependency)

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=patient_followup
JWT_SECRET=your_super_secret_jwt_key_here
N8N_WEBHOOK_URL=http://localhost:5678
```

**Important:** Replace `your_super_secret_jwt_key_here` with a strong, random string.

### 4. Set Up the Database

1. Open **phpMyAdmin** (http://localhost/phpmyadmin)
2. Create a new database named `patient_followup`
3. Import the database schema (if provided) or run your migration scripts

### 5. Install and Configure n8n

```bash
npm install n8n -g
```

Import the provided n8n workflow JSON files into your n8n instance.

---

## 🚀 Running Locally

Follow these steps to run the application on your local machine:

### Step 1: Start XAMPP Services

1. Launch **XAMPP Control Panel**
2. Start the **Apache** module (for phpMyAdmin access)
3. Start the **MySQL** module (for database connectivity)

![XAMPP Control Panel](https://via.placeholder.com/600x200?text=Start+Apache+%26+MySQL)

### Step 2: Navigate to Backend Directory

Open your terminal/command prompt and navigate to the backend folder:

```bash
cd path/to/smart-patient-followup/backend
```

**Example:**
```bash
C:\Users\YourName\Projects\smart-patient-followup\backend
```

### Step 3: Start the Express Server

Launch the backend server with the following command:

```bash
node server.js
```

**For Development (with auto-reload):**
```bash
npm run dev
```

You should see output similar to:
```
✅ Server running on http://localhost:5000
✅ Database connected successfully
```

### Step 4: Start n8n Workflow Engine

In a **new terminal window**, start n8n:

```bash
n8n start
```

n8n will be accessible at: `http://localhost:5678`

### Step 5: Access the Application

Open your web browser and navigate to:

```
http://localhost:5000
```

or open the `index.html` file directly from your frontend directory.

### 📝 Default Login Credentials

Use these credentials for initial testing (create an account if needed):

```
Email: admin@example.com
Password: admin123
```

**⚠️ Security Note:** Change default credentials immediately in production environments.

---

## 🏗️ System Architecture

### Workflow Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ◄────► │ Express API  │ ◄────► │    MySQL    │
│ (Bootstrap) │  JWT   │  (Node.js)   │  SQL   │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                              ▲  │
                              │  │ Webhooks
                              │  ▼
                        ┌──────────────┐
                        │  n8n Engine  │
                        │  (Port 5678) │
                        └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Email/SMS        │
                    │ Notifications    │
                    └──────────────────┘
```

### Component Communication

1. **User Access**: Frontend sends JWT token with each request
2. **Patient Management**: CRUD operations via REST API
3. **Automated Reminders**: 
   - System detects upcoming follow-ups
   - n8n workflows fetch records and send notifications
   - Status callbacks update the database
4. **AI Analytics**: 
   - Health vitals fetched from database
   - AI analysis determines patient status (Critical/Moderate/Normal)
   - Dynamic dashboard generated with visual insights

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login (returns JWT) |

### Patient Management (`/api/patients`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Retrieve all patients |
| GET | `/api/patients/:id` | Get specific patient details |
| POST | `/api/patients` | Add new patient |
| PUT | `/api/patients/:id` | Update patient information |
| DELETE | `/api/patients/:id` | Remove patient record |
| GET | `/api/patients/stats` | Get patient statistics |

### Reminder System (`/api/reminders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reminders` | List all reminders |
| GET | `/api/reminders/upcoming` | Get upcoming reminders |
| POST | `/api/reminders/create` | Create new reminder |
| PUT | `/api/reminders/update-status/:id` | Update reminder status |

### n8n Webhook Endpoints (Port 5678)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook/patient-dashboard` | Generate patient dashboard |
| POST | `/webhook/send-manual-reminder` | Trigger immediate reminder |

---

## 🔄 Workflow

### Complete Patient Follow-Up Lifecycle

1. **User Authentication**
   - Staff member logs in
   - System validates credentials
   - JWT token generated and stored locally

2. **Patient Onboarding**
   - Staff registers patient with health vitals
   - Data stored in MySQL database
   - Next follow-up date scheduled

3. **AI-Powered Reminder Lifecycle**
   - **Detection**: System scans for follow-ups due "Tomorrow"
   - **Processing**: n8n workflows fetch upcoming records
   - **Execution**: Automated emails/SMS sent to patients
   - **Feedback Loop**: n8n updates reminder status (Sent/Failed)
   - **Manual Intervention**: Staff reviews dashboard for failed attempts

4. **AI-Powered Analytics Dashboard**
   - **Data Fetch**: System retrieves patient's health vitals
   - **Processing**: Data formatted for analysis engine
   - **AI Analysis**: Determines patient status (Critical/Moderate/Normal)
   - **Generation**: Creates visual dashboard with downloadable PDF

---

## 📚 Dependencies

### Backend Dependencies

```json
{
  "express": "^5.1.0",
  "mysql2": "^3.15.2",
  "dotenv": "^17.2.3",
  "cors": "^2.8.5",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.2"
}
```

### Development Dependencies

```json
{
  "nodemon": "latest"
}
```

### Frontend Libraries (CDN)

- Bootstrap 5 (CSS & JS Bundle)
- Bootstrap Icons
- Google Fonts (Inter/Roboto)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a new **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Code Style Guidelines

- Use meaningful variable and function names
- Comment complex logic
- Follow ES6+ JavaScript standards
- Maintain consistent indentation (2 spaces)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Tasbid Al Rahman** - *Junior Capstone Design (CSE299)*

- GitHub: [@tasbidrahman10](https://github.com/tasbidrahman10)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/tasbid-a-rahman-/)

---

## 🙏 Acknowledgments

- North South University (NSU)
- CSE299 Course Supervisors
- Open-source community for the amazing tools and libraries
- n8n team for the powerful workflow automation platform

---

## 📞 Support

For questions, issues, or feature requests, please:

- Open an [Issue](https://github.com/tasbidrahman10/Smart-Patient-Follow-up-Health-Trend-Analytics/issues)
- Contact: tasbidrahman555@gmail.com

---

<div align="center">

**Made with ❤️ for better healthcare in Bangladesh**

⭐ Star this repository if you find it helpful!

</div>
