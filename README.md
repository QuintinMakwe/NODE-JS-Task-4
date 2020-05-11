# NODE-JS-Task-4
This contains the server side code for node js task 4 of Start Ng remote Internship

#### Here is a link to the live api --> https://quintinonlineschool.herokuapp.com/

#### Admin login --> email: "quintinmakwe@gmail.com", password: "glasgoware"

## Admin Routes
  #### Make a tutor admin [ POST /api/v1/admin/tutor/maketutoradmin ]
    REQ
      body -> {email}
    RES : 200
      body -> {message: `Tutor with email ${email} has been made an admin`}
  #### Create a subject [ POST /api/v1/admin/tutor/createSubject ]
    REQ
      body -> {name, category, detail}
    RES : 200
      body -> {message: subject}  
  #### Update subject by id [ PUT /api/v1/admin/tutor/updateSubject/:subjectId ]
    REQ
      body -> {name, category, data}
    RES : 200
      body -> {message: `Updated subject successfully`}   
  #### Delete subject by id  [ DELETE /api/v1/admin/tutor/deletSubject/:subjectId]
    REQ
      params -> subjectId
    RES : 200
      body -> { message: "Deleted subject successfully" }   
  #### Delete category  [ DELETE /api/v1/admin/tutor/deleteCategory]
    REQ
      body -> {category}
    RES : 200
      body -> { message: `Deleted all subject in ${category} category` }   
  #### Get all tutors  [ GET /api/v1/admin/tutor/]
    REQ
      body -> {}
    RES : 200
      body -> { message: tutor }   
  #### Get tutor by id  [ GET /api/v1/admin/tutor/:tutorId]
    REQ
      body -> {}
    RES : 200
      body -> { message: tutor }   
  #### Deactivate tutor by id  [ PUT /api/v1/admin/tutor//deactivateTutor/:tutorId]
    REQ
      body -> {}
    RES : 200
      body -> { message: "Tutor deleted successfully" }     
  #### Create a lesson  [ POST /api/v1/admin/tutor/createLesson]
    REQ
      body -> {name, timeStart, timeEnd, tutor, data, category, subject}
    RES : 200
      body -> { message: lesson }    
  #### Get all lessons  [ GET /api/v1/admin/tutor/getLesson]
    REQ
      body -> {}
    RES : 200
      body -> { message: lesson }   
  #### Get lesson by id  [ GET /api/v1/admin/tutor/getLesson/:lessonId]
    REQ
      body -> {}
    RES : 200
      body -> { message: lesson }     
  #### Update lesson by id  [ PUT /api/v1/admin/tutor/updateLesson/:lessonId]
    REQ
      body -> {name, timeStart, timeEnd, tutor, data, category, subject}
    RES : 200
      body -> { message: "Updated Lesson successfully" }    
  #### Delete lesson by id  [ DELETE /api/v1/admin/tutor/deleteLesson/:lessonId]
    REQ
      body -> {}
    RES : 200
      body -> { message: "Successfully deleted lesson" }    
   

## Tutors Routes
  #### Post signup details  [ POST /api/v1/tutor/signup]
    REQ
      body -> {name, email, password,}
    RES : 200
      body -> { message: tutor } 
  #### Post login details  [ POST /api/v1/tutor/login]
    REQ
      body -> {email, password}
    RES : 200
      body -> { token, tutor }  
  #### Post details of subject to register  [ POST /api/v1/tutor/registerSubject]
    REQ
      body -> { subject, category}
    RES : 200
      body -> { message: "Registered subject succcessfully" }  
  #### Get all registered subjects  [ GET /api/v1/tutor/viewRegisteredSubject]
    REQ
      body -> { }
    RES : 200
      body -> { message: tutorSubjects }  
  #### Update a subject by id  [ PUT /api/v1/tutor/updateSubject/:subjectId]
    REQ
      body -> {name, category, data  }
    RES : 200
      body -> { message: `Updated subject successfully` }  
  #### Delete a subject by id  [ DELETE /api/v1/tutor/deleteSubject/:subjectId]
    REQ
      body -> {}
    RES : 200
      body -> { message: "Deleted subject successfully" } 


## Student Routes
  #### Post student signup details  [ POST /api/v1/student/signup]
    REQ
      body -> {name, email, password}
    RES : 200
      body -> { message: student }   
  #### Post student login details  [ POST /api/v1/student/login]
    REQ
      body -> {email, password}
    RES : 200
      body -> { token, student  }   
  #### Get tutors taking subject in a category  [ GET /api/v1/student/getTutor]
    REQ
      body -> {subject, category}
    RES : 200
      body -> { message: result }    
  #### Post book lesson details  [ POST /api/v1/student/bookLesson]
    REQ
      body -> {name, tutor, subject }
    RES : 200
      body -> { message: student }   


## General Routes
  #### Get a subject in a category by id  [ GET /api/v1/general/retrieveSubject/:subjectId]
    REQ
      body -> {category}
    RES : 200
      body -> { message: subject }    
  #### Get all subjects by category  [ GET /api/v1/general/retrieveSubject]
    REQ
      body -> {category}
    RES : 200
      body -> { message: subjectsInCategory } 
  #### Get all categories [ GET /api/v1/general/retrieveCategory]
    REQ
      body -> {}
    RES : 200
      body -> { message: category } 
  #### Post subject detail to search subject by name  [ POST /api/v1/general/searchSubject]
    REQ
      body -> {subjectName }
    RES : 200
      body -> { message: subject }  
  #### Post tutor detail to search tutor by name  [ POST /api/v1/general/searchTutors]
    REQ
      body -> { tutorName }
    RES : 200
      body -> { message: tutor } 
