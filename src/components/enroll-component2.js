import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course-service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [preShow, setPreShow] = useState(null);

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/login");
  };

  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    if (!searchInput) return;
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        console.log(e);
        window.alert("Enroll successfully !");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handlePreShowingCourses = () => {
    CourseService.get()
      .then((data) => {
        setPreShow(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    handlePreShowingCourses();
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>Please Login your account before enroll your course !</p>
          <button className="btn btn-primary" onClick={handleNavigate}>
            Login page
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleChangeInput}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search course
          </button>
        </div>
      )}
      {currentUser &&
        preShow &&
        preShow !== 0 &&
        currentUser.user.role === "student" &&
        !searchResult && (
          <div>
            <p>Courses recommended :</p>
            {preShow.map((course) => {
              return (
                <div
                  key={course._id}
                  className="card"
                  style={{ width: "18rem", display: "inline-block" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Course: {course.title}</h5>
                    <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                      {course.description}
                    </p>
                    <p style={{ margin: "0.5rem 0rem" }}>
                      {course.students.length} students
                    </p>
                    <p style={{ margin: "0.5rem 0rem" }}>NT$ {course.price}</p>
                    <p style={{ margin: "0.5rem 0rem" }}>
                      Creator : {course.instructor.username}
                    </p>

                    <a
                      href="#"
                      id={course._id}
                      className="card-text btn btn-primary"
                      onClick={handleEnroll}
                    >
                      Enroll
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>Only students were allowed enroll courses</h1>
        </div>
      )}
      {currentUser && searchResult && searchResult.length !== 0 && (
        <div>
          <p>Search Result :</p>
          {searchResult.map((course) => {
            return (
              <div
                key={course._id}
                className="card"
                style={{ width: "18rem", display: "inline-block" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Course: {course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    {course.students.length} students
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>NT$ {course.price}</p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    Creator : {course.instructor.username}
                  </p>

                  <a
                    href="#"
                    id={course._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    Enroll
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
