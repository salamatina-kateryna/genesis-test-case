import React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import { Card, Tag } from "antd";
import VideoJS from "../components/VideoJS";
import "./CourseCard.scss";

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

const videoJsOptions = {
  autoplay: false,
  controls: false,
  muted: true,
  preload: "none",
  responsive: true,
  fluid: true,
  poster: null,
  sources: null,
};

const getRandomColor = () => {
  return arrayColors[Math.floor(Math.random() * arrayColors.length)];
};

const getDividedTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    previewImageLink,
    tags,
    lessonsCount,
    duration,
    rating,
    meta,
    description,
    status,
    launchDate,
  } = course;

  const { skills, courseVideoPreview } = meta;

  const [videoOptions, setVideoOptions] = useState(videoJsOptions);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setVideoOptions((videoOptions) => ({
        ...videoOptions,
        poster: `${previewImageLink}/cover.webp`,
        sources: [
          {
            src: courseVideoPreview?.link,
            type: "application/x-mpegURL",
          },
        ],
      }));
    };
    fetchData();
  }, [id]);

  return (
    <Card
      type="inner"
      className="card"
      title={
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            whiteSpace: "normal",
            color: "#1f2022",
          }}
        >
          {title}
        </h2>
      }
      onMouseEnter={() => player?.play()}
      onMouseLeave={() => {
        player?.currentTime(0);
        player?.pause();
        player?.hasStarted(false);
        player?.posterImage?.show();
      }}
      cover={
        <VideoJS
          key={`video-generic-${id}`}
          options={videoOptions}
          getPlayer={(player) => setPlayer(player)}
        />
      }
      style={{
        width: "260px",
      }}
      hoverable
    >
      {tags.map((tag) => (
        <span className="card__tag" href="/#" key={tag}>
          #{tag}{" "}
        </span>
      ))}
      <div className="card__wrapper">
        <p className="card__info">
          <span className="card__criterion">Lesson count:</span> {lessonsCount},
        </p>
        <p className="card__info">
          <span className="card__criterion">duration: </span>
          {getDividedTime(duration)}
        </p>
      </div>
      <p className="card__rating">
        rating: <span className="card__rating-number">{rating}</span>
      </p>
      <p className="card__description">{description}</p>
      <p className="card__skills">
        {skills?.map((skill) => (
          <Tag
            key={skill}
            color={getRandomColor()}
            style={{ margin: "3px", fontSize: "10px" }}
          >
            {skill}
          </Tag>
        ))}
      </p>
      <p className="card__status">
        <span className="card__state">status: </span> {status}
      </p>
      <p className="card__status">
        <span className="card__state"> launch date: </span>
        {moment(launchDate).format("LLL")}
      </p>
    </Card>
  );
};

export default CourseCard;
