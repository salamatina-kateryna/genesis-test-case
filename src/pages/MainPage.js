import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import API from "../utils/API";
import CourseCard from "../components/CourseCard";
import "./MainPage.scss";

const COUNT_COURSES_ON_PAGE = 10;

const api = new API();

const MainPage = () => {
  const [courses, setCourses] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getCourses();
      setCourses(data);

      setDisplayItems(data?.slice(0, COUNT_COURSES_ON_PAGE));
    };
    fetchData();
  }, []);

  const handleChange = (value) => {
    const index = value - 1;
    setDisplayItems(
      courses?.slice(
        index * COUNT_COURSES_ON_PAGE,
        (index + 1) * COUNT_COURSES_ON_PAGE
      )
    );
  };

  return (
    <>
      <h1 className="main__title">Self-development courses</h1>
      <section className="main__card-list">
        {displayItems.map((course) => (
          <Link
            key={course.id}
            to={`/${course.id}`}
            style={{ width: "fit-content" }}
          >
            <CourseCard key={course.id} course={course} />
          </Link>
        ))}
        <Pagination
          defaultCurrent={1}
          defaultPageSize={10}
          onChange={handleChange}
          total={courses.length}
          className="main__pagination"
        />
      </section>
    </>
  );
};

export default MainPage;
