# Admin Dashboard Setup Guide

## Overview

Your travel website now includes a full-featured admin dashboard with authentication and CMS capabilities.

## Features

### Admin Dashboard Includes:
- Secure authentication system with email/password
- CRUD operations for Cities
- CRUD operations for Travel Packages
- CMS for Hero Banners
- CMS for Customer Reviews
- CMS for Popular Destinations
- Dashboard with statistics overview

### Database Tables:
- `admin_users` - Admin authentication
- `cities` - City destinations
- `packages` - Travel packages
- `hero_banners` - Homepage hero content
- `customer_reviews` - Customer testimonials
- `popular_destinations` - Featured destinations
- `payments` - Payment records

## Getting Started

### Step 1: Create Your First Admin Account

1. Navigate to: `/admin/setup`
2. Fill in your details:
   - Full Name
   - Email
   - Password (min 6 characters)
3. Click "Create Admin Account"

### Step 2: Login

1. Navigate to: `/admin/login`
2. Enter your credentials
3. Access the admin dashboard

### Step 3: Manage Content

Once logged in, you can:
- **Cities** - Add/edit/delete travel destinations
- **Packages** - Create travel packages with prices, durations, and features
- **Hero Banners** - Manage homepage banner content
- **Reviews** - Add customer testimonials
- **Popular Destinations** - Feature specific destinations for flights/hotels

## Admin Routes

- `/admin/setup` - Create first admin account
- `/admin/login` - Admin login page
- `/admin/dashboard` - Dashboard overview
- `/admin/dashboard/cities` - Manage cities
- `/admin/dashboard/packages` - Manage packages
- `/admin/dashboard/hero-banners` - Manage hero banners
- `/admin/dashboard/reviews` - Manage reviews
- `/admin/dashboard/destinations` - Manage popular destinations

## Security

- All admin routes are protected with authentication
- Row Level Security (RLS) enabled on all tables
- Only authenticated admins can perform CRUD operations
- Public users can only read content (cities, packages, reviews, etc.)

## Notes

- The newsletter subscribe button color has been changed to #dcac56
- All database operations use Supabase
- Authentication uses Supabase Auth
- Password hashing uses bcrypt
