# NODE-JS-Task-4
This contains the server side code for node js task 4 of Start Ng remote Internship

### Here is a link to the live api --> https://quintinonlineschool.herokuapp.com/

#### Admin login --> email: "quintinmakwe@gmail.com", password: "glasgoware"

### Admin Routes
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
   
  #### Delete tutor by id  [ DELETE /api/v1/admin/tutor/deleteTutor/:tutorId]
   
  #### Create a lesson  [ POST /api/v1/admin/tutor/createLesson]
   
  #### Get all lessons  [ GET /api/v1/admin/tutor/getLesson]
   
  #### Get lesson by id  [ GET /api/v1/admin/tutor/getLesson/:lessonId]
   
  #### Update lesson by id  [ PUT /api/v1/admin/tutor/updateLesson/:lessonId]
   
  #### Delete lesson by id  [ DELETE /api/v1/admin/tutor/deleteLesson/:lessonId]
   
   



### Tutors Routes
  #### Post signup details  [ POST /api/v1/tutor/signup]
  
  #### Post login details  [ POST /api/v1/tutor/login]
  
  #### Post details of subject to register  [ POST /api/v1/tutor/registerSubject]
  
  #### Get all registered subjects  [ GET /api/v1/tutor/viewRegisteredSubject]
  
  #### Update a subject by id  [ PUT /api/v1/tutor/updateSubject/:subjectId]
  
  #### Delete a subject by id  [ DELETE /api/v1/tutor/deleteSubject/:subjectId]



### Student Routes
  #### Post student signup details  [ POST /api/v1/student/signup]
  
  #### Post student login details  [ POST /api/v1/student/login]
  
  #### Get tutors taking subject in a category  [ GET /api/v1/student/getTutor]
  
  #### Post book lesson details  [ POST /api/v1/student/bookLesson]
  


### General Routes
  #### Get a subject in a category by id  [ GET /api/v1/general/retrieveSubject/:subjectId]
  
  #### Get all subjects by category  [ GET /api/v1/general/retrieveSubject]
  
  #### Get all categories [ GET /api/v1/general/retrieveCategory]
  
  #### Post subject detail to search subject by name  [ POST /api/v1/general/searchSubject]
  
  #### Post tutor detail to search tutor by name  [ POST /api/v1/general/searchTutors]
