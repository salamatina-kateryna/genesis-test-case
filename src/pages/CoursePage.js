import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag, List, Modal } from "antd";
import { UnlockOutlined, LockOutlined } from "@ant-design/icons";
import API from "../utils/API";
import moment from "moment";
import VideoJS from "../components/VideoJS";
import "./CoursePage.scss";

const api = new API();

const getDividedTime = (seconds = 0) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};

const arrayColors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
  "yellow",
];

const getRandomColor = () => {
  return arrayColors[Math.floor(Math.random() * arrayColors.length)];
};

const videoJsOptions = {
  autoplay: false,
  controls: true,
  muted: false,
  preload: "none",
  responsive: true,
  fluid: true,
  sources: null,
};

const CoursePage = () => {
  let { id } = useParams();

  const [course, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({});
  const [videoOptions, setVideoOptions] = useState(videoJsOptions);
  const [modalVideoOptions, setModalVideoOptions] = useState(videoJsOptions);

  const {
    title,
    lessons = [],
    tags,
    duration,
    rating,
    meta = [],
    description,
    status,
    launchDate,
  } = course;

  const { skills } = meta;

  const stopAllPlayers = () => {
    Array.from(document.querySelectorAll("audio,video")).forEach((player) =>
      player.pause()
    );
  };

  const showModal = (lesson) => {
    setCurrentLesson(lesson);
    setIsModalOpen(true);
    stopAllPlayers();
  };
  const handleOk = () => {
    setCurrentLesson({});
    setIsModalOpen(false);
    stopAllPlayers();
  };
  const handleCancel = () => {
    setCurrentLesson({});
    setIsModalOpen(false);
    stopAllPlayers();
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getCourse(id);
      setCourses(data);

      setVideoOptions((videoOptions) => ({
        ...videoOptions,
        poster: `${data?.lessons[0]?.previewImageLink}/lesson-${data.lessons[0]?.order}.webp`,
        sources: [
          { src: data?.lessons[0]?.link, type: "application/x-mpegURL" },
        ],
      }));
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!currentLesson?.link) return;

    setModalVideoOptions((videoOptions) => ({
      ...videoOptions,
      poster: `${currentLesson?.previewImageLink}/lesson-${currentLesson?.order}.webp`,
      sources: [{ src: currentLesson?.link, type: "application/x-mpegURL" }],
    }));
  }, [currentLesson]);

  return (
    <div className="course">
      <h1 className="course__title">{title}</h1>
      <div className="course__container">
        <div className="course__video">
          <VideoJS key={`video-generic-${course?.id}`} options={videoOptions} />
          <small>press Q to speed up video</small>
          <br />
          <small>press A for standard video speed</small> <br />
          <small>press Z to slow down video</small>
        </div>
        <div className="course__data">
          {tags?.map((tag, index) => (
            <span className="course__tag" href="/#" key={index}>
              #{tag}{" "}
            </span>
          ))}
          <div className="course__wrapper">
            <p className="course__info">
              <span className="course__criterion">Lesson count: </span>
              {lessons.length}
            </p>
            <p className="course__info">
              <span className="course__criterion">duration: </span>{" "}
              {getDividedTime(duration)}
            </p>
          </div>
          <p className="course__rating">
            rating: <span className="course__rating-number">{rating}</span>
          </p>
          <p className="course__description">{description}</p>
          <p className="course__skills">
            {skills?.map((skill) => (
              <Tag
                key={skill}
                color={getRandomColor()}
                style={{ margin: "3px", fontSize: "16px" }}
              >
                {skill}
              </Tag>
            ))}
          </p>
          <div className="course__wrapper course__wrapper--big-width">
            <p className="course__status">
              <span className="course__state">status: </span> {status}
            </p>
            <p className="course__status">
              <span className="course__state"> launch date: </span>
              {moment(launchDate).format("LLL")}
            </p>
          </div>
        </div>
      </div>

      <h2 className="course__list-title">List of lessons</h2>
      <List
        className="course__list"
        itemLayout="horizontal"
        dataSource={lessons}
        renderItem={(lesson) => (
          <List.Item
            onClick={() =>
              lesson.status === "unlocked" ? showModal(lesson) : null
            }
            style={{
              opacity: lesson.status === "unlocked" ? "1" : "0.5",
              cursor: lesson.status === "unlocked" && "pointer",
            }}
          >
            <List.Item.Meta
              avatar={
                lesson.status === "unlocked" ? (
                  <UnlockOutlined />
                ) : (
                  <LockOutlined />
                )
              }
              title={lesson.title}
            />
            {getDividedTime(lesson.duration)}
          </List.Item>
        )}
      />
      <Modal
        title={currentLesson?.title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={"70%"}
        centered={true}
        style={{
          top: 0,
        }}
      >
        <VideoJS
          key={`video-generic-${currentLesson?.id}`}
          options={modalVideoOptions}
        />
        <small>press Q to speed up video</small>
        <br />
        <small>press A for standard video speed</small> <br />
        <small>press Z to slow down video</small>
      </Modal>
    </div>
  );
};

export default CoursePage;
