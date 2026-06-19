import React from 'react'
import "./dashbord.css";
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';

const Dashbord = () => {
  const {myCourse} = CourseData();
// console.log("User:", user);
console.log("My Courses:", myCourse);
  return(
  <>
  <div className="student-dashboard">
      <h2>All Enrolled Courses</h2>
      <div className="dashboard-content">
        {myCourse && myCourse.length > 0 ? (
          myCourse.map((e) => <CourseCard key={e._id} course={e} />)
        ) : (
          <p>No course Enrolled Yet</p>
        )}
      </div>
    </div>
  </>
  )
}

export default Dashbord