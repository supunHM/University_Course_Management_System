# XAMPP Setup Guide for Course API

## Step-by-Step Instructions

### Step 1: Start XAMPP

1. **Launch XAMPP Control Panel**

   - On Mac: Open Applications → XAMPP → XAMPP Control Panel
   - On Windows: Start → XAMPP Control Panel

2. **Start MySQL Service**
   - Click the "Start" button next to "MySQL"
   - Wait for the status to show "Running" (green background)
   - MySQL should be running on port 3306

### Step 2: Create Database Using phpMyAdmin

1. **Open phpMyAdmin**

   - In XAMPP Control Panel, click "Admin" next to MySQL
   - Or navigate to: `http://localhost/phpmyadmin`

2. **Create the Database**

   - Click on "Databases" tab at the top
   - Enter `university` in the "Create database" field
   - Click "Create" button

3. **Verify Database Creation**
   - You should see `university` listed in the left sidebar

### Step 3: Run Database Setup Script

**Option A: Using phpMyAdmin (Recommended)**

1. Click on the `university` database in the left sidebar
2. Click on the "SQL" tab at the top
3. Copy and paste the contents of `database_setup.sql`
4. Click "Go" to execute the script

**Option B: Using MySQL Command Line**

1. Open Terminal/Command Prompt
2. Navigate to your project directory:
   ```bash
   cd /Users/supunherath/Documents/EAD_Assignment/course-api
   ```
3. Connect to MySQL and run script:
   ```bash
   mysql -u root -p < database_setup.sql
   ```
   (Press Enter when prompted for password since it's empty)

### Step 4: Start the Spring Boot Application

1. **Open Terminal in Project Directory**

   ```bash
   cd /Users/supunherath/Documents/EAD_Assignment/course-api
   ```

2. **Make Maven Wrapper Executable** (Mac/Linux only):

   ```bash
   chmod +x mvnw
   ```

3. **Start the Application**

   ```bash
   ./mvnw spring-boot:run
   ```

4. **Wait for Startup**
   - Look for: `Started CourseApiApplication in X seconds`
   - Application will be available at: `http://localhost:8080`

### Step 5: Test the API

1. **Test Basic Connection**

   ```bash
   curl http://localhost:8080/api/courses
   ```

   Should return: `[]` (empty array) or sample data if inserted

2. **Create a Test Course**

   ```bash
   curl -X POST http://localhost:8080/api/courses \
     -H "Content-Type: application/json" \
     -d '{
       "code": "TEST101",
       "title": "Test Course",
       "description": "This is a test course",
       "credits": 3
     }'
   ```

3. **Verify in Database**
   - Go back to phpMyAdmin
   - Click on `university` database
   - Click on `courses` table
   - You should see your test course data

### Step 6: Use the Test Data Examples

Open the `test_data.md` file and use the curl commands provided to test all endpoints:

- GET all courses
- GET single course
- POST new course
- PUT update course
- DELETE course
- Test validation errors
- Test duplicate code errors

## 🛠️ Troubleshooting

### MySQL Won't Start in XAMPP

- **Port Conflict**: Another MySQL service might be running
- **Solution**: Stop other MySQL services or change port in XAMPP
- **Check**: Use `sudo lsof -i :3306` (Mac) to see what's using port 3306

### Database Connection Error

- **Error**: `Communications link failure`
- **Solution**: Ensure MySQL is running and accessible
- **Test**: Try connecting via phpMyAdmin first

### Application Won't Start

- **Port 8080 Busy**: Another application is using port 8080
- **Solution**: Kill the process or change port in `application.properties`:
  ```properties
  server.port=8081
  ```

### Table Not Created

- **If courses table doesn't exist**: Application will auto-create it on first run
- **Manual Creation**: Use the SQL in the comments of `database_setup.sql`

## 📊 Verification Checklist

- [ ] XAMPP MySQL is running (green status)
- [ ] Database `university` exists in phpMyAdmin
- [ ] Spring Boot application started successfully
- [ ] Can access: `http://localhost:8080/api/courses`
- [ ] Test POST request works
- [ ] Data appears in phpMyAdmin

## 🔍 Quick Health Check

Run this command to verify everything is working:

```bash
# Test the API is responding
curl -i http://localhost:8080/api/courses

# Should return HTTP/1.1 200 OK with JSON response
```

Your Course API is now fully functional and connected to XAMPP MySQL! 🎉
