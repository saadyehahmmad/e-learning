# English E-Learning Platform APIs & Architecture

This document outlines the API structure and features needed to transform the existing boilerplate into a fully-fledged English E-Learning Platform tailored for Students and Tutors.

## 🌟 Platform Overview

The platform supports two primary modes of English learning:
1. **Self-Paced Courses:** Tutors create courses made up of video/text lessons. Students enroll and track their progress.
2. **Live Tutoring Sessions:** Tutors set their weekly availability. Students book 1-on-1 English practice sessions.

---

## 🏛️ System Architecture

The application will be built using NestJS with TypeORM/Mongoose (extending the current boilerplate).

### User Roles
- **Admin**: Full access to monitor courses, users, and platform settings.
- **Tutor**: Can create courses, manage lessons, set availability, and manage their bookings.
- **Student**: Can browse courses, enroll, track progress, and book live sessions with tutors.

---

## 🔌 Core API Specifications

### 1. Authentication & Users (`/api/v1/auth`, `/api/v1/users`)
*Already partially implemented by the boilerplate.*
- `POST /auth/email/register` - Register as a `Tutor` or `Student`.
- `POST /auth/email/login` - Login.
- `GET /users/me` - Get current user profile.
- `PATCH /users/me` - Update profile (e.g., Tutor adding bio/certifications, Student updating English level from A1 to C2).
- `GET /users/tutors` - List all verified English tutors (Public).

### 2. Courses (`/api/v1/courses`)
- `GET /courses` - List available courses (Filters: Level, Tutor, Price).
- `GET /courses/:id` - Get course details.
- `POST /courses` - Create a new course *(Tutor/Admin only)*.
- `PATCH /courses/:id` - Update a course *(Tutor/Admin only)*.
- `DELETE /courses/:id` - Delete a course *(Tutor/Admin only)*.

### 3. Lessons (`/api/v1/courses/:courseId/lessons`)
- `GET /courses/:courseId/lessons` - Get all lessons for a course.
- `GET /courses/:courseId/lessons/:lessonId` - Get lesson content.
- `POST /courses/:courseId/lessons` - Add a new lesson *(Tutor only)*.
- `PATCH /courses/:courseId/lessons/:lessonId` - Edit lesson *(Tutor only)*.

### 4. Enrollments (`/api/v1/enrollments`)
- `POST /enrollments` - Enroll in a course. Payload: `{ courseId: UUID }`.
- `GET /enrollments/my-courses` - List courses the current student is enrolled in.
- `PATCH /enrollments/:id/progress` - Update progress (e.g., mark a lesson as completed).

### 5. Tutor Availability (`/api/v1/availability`)
- `POST /availability` - Set weekly typical availability. Payload: `{ dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }` *(Tutor only)*.
- `GET /availability/:tutorId` - View specific tutor's available time slots.

### 6. Bookings (Live Sessions) (`/api/v1/bookings`)
- `POST /bookings` - Book a live session. Payload: `{ tutorId: UUID, date: 'YYYY-MM-DD', time: 'HH:mm' }` *(Student only)*.
- `GET /bookings/my-appointments` - Get a list of upcoming or past sessions for the logged-in user (works for both Tutors and Students).
- `PATCH /bookings/:id/status` - Accept, reject, or mark a session as completed *(Tutor/Student depending on rules)*.

### 7. Reviews & Ratings (`/api/v1/reviews`)
- `POST /reviews` - Submit a review for a course or tutor. Payload: `{ targetId: UUID, targetType: 'course'|'tutor', rating: 5, comment: 'Great English practice!' }`.
- `GET /reviews/:targetId` - Get reviews for a specific course/tutor.

---

## 🛠️ Refactoring Guide & Next Steps

To make the existing codebase fully ready for E-Learning, the following steps must be taken:

1. **Database Schema Setup:**
   - Define entities for `Course`, `Lesson`, `Enrollment`, `Availability`, `Booking`, and `Review`.
   - Update `User` entity to map relationships (e.g., `User` has many `Courses` as a Tutor).
2. **Modules Generation:**
   - Use the NestJS CLI (`nest g resource [name]`) to generate the required modules in the `src/` directory.
3. **Role-Based Access Control (RBAC):**
   - Utilize existing guards (like `RolesGuard`) to strictly enforce permissions (e.g., only Tutors can create courses).
4. **Data Seeders:**
   - Update existing startup seeders to create mock Tutors, dummy English courses, and Student accounts for easier testing.
