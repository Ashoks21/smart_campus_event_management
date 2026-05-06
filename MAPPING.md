# Concept Mapping: Learning Management System (LMS) to Smart Campus Event System

This document outlines how the logic from a traditional "Course/LMS" project has been adapted and enhanced for the **Smart Campus Event Management System**. Use this as a reference during your viva to explain your architectural decisions.

## 🎯 Key Transformations

| Friend's Project (LMS) | Your Project (Event Management) | Rationale |
| :--- | :--- | :--- |
| **Courses** | **Events** | Shift from educational content to dynamic campus activities. |
| **Course Details** | **Event Details** | Includes venue (MapPin) and organizer (Users) instead of just an instructor. |
| **Instructor** | **Organizer / Club** | Campus events are typically managed by clubs or societies. |
| **Enrollment** | **Registration** | Simplified process for ticket reservation. |
| **Learning Modules** | **Experience Highlights** | Focus on what students will *do* at the event (workshops, networking). |
| **Course Fee** | **Entry Fee** | Supports both Paid and Free campus events. |
| **Certificate** | **Digital Ticket / QR** | Focus on entry validation rather than academic completion. |

---

## 🚀 Smart Enhancements (To Impress the Examiner)

### 1. Popularity Analytics (Social Proof)
*   **Concept**: We don't just show event info; we show real-time interest.
*   **Implementation**: A "Trending Meter" in `EventDetails.jsx` that combines mock baseline data with actual registration counts from the system.
*   **VFR-Role**: This shows you understand how to implement data-driven UI components.

### 2. Role-Based Access Control (RBAC)
*   **Concept**: Differentiation between a General Student and a Club Administrator.
*   **Implementation**: Logic in `AuthContext.jsx` that assigns roles based on email patterns (e.g., `admin@campus.edu` gets the **Admin** badge).
*   **VFR-Role**: This demonstrates knowledge of security and permission layers.

### 3. State Persistence
*   **Concept**: "True" app behavior without a backend.
*   **Implementation**: Deep integration with `localStorage`. If you refresh the page after registering, your ticket *remains* in your dashboard.
*   **VFR-Role**: Proves you can manage complex application state effectively.

### 4. Digital QR Integration
*   **Concept**: Modern campus entry.
*   **Implementation**: Use of a mock QR API in `Success.jsx` to generate a scanable ticket unique to the registration ID.
*   **VFR-Role**: Shows you are thinking about the "Smart" and physical aspects of campus management.

---

## 🛠️ Tech Stack Explained
*   **React 19 & Vite**: For lightning-fast performance and modern hooks.
*   **Context API**: Used for centralizing Authentication and Registration data across the app.
*   **Lucide-React**: For a premium iconography system (consistent UI).
*   **Vanilla CSS**: Used custom CSS variables (`--primary`, `--glass`) to build a unique design system rather than relying on generic frameworks.
