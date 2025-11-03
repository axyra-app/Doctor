# **App Name**: DoctorAtHome

## Core Features:

- User Authentication: Securely authenticate users (patients and doctors) via Firebase Auth, supporting registration, login, and email verification.
- Profile Management: Enable users to manage their profiles, including personal information, specialization (doctors), and profile picture upload.
- Appointment Request: Allow patients to submit appointment requests, including a description of the issue, preferred doctor type, and address.
- Real-time Request Updates: Provide real-time status updates for patient requests, such as 'pending,' 'accepted,' 'en route,' and 'completed'.
- Doctor Availability: Enable doctors to view pending appointment requests in their area and accept or reject them based on availability.
- In-app Notifications: Implement in-app push notifications to alert patients when a doctor accepts their request and to notify doctors of new requests in their area.
- Automated Doctor Assignment Tool: Use a generative AI tool to consider multiple features of a request such as medical speciality, location, patient reviews of nearby doctors, doctor availability, pricing, and insurance coverage, in order to generate an optimal ranked list of doctor suggestions.

## Style Guidelines:

- Primary color: Blue (#3498DB), representing trust, health, and professionalism.
- Background color: Light gray (#ECF0F1), offering a clean and calm user interface.
- Accent color: Green (#2ECC71), used for successful actions and confirmations.
- Font pairing: 'Inter' (sans-serif) for both headlines and body text, ensuring readability and a modern look.
- Use a consistent set of healthcare-related icons in a flat style, providing visual cues for different functions.
- A clean and intuitive layout with clear visual hierarchy. Use of cards to display information, making it easy to scan.
- Subtle animations and transitions to provide feedback on user interactions, creating a smooth user experience.