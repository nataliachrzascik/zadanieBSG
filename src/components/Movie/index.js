import "../../App.css";
import React, { useState } from "react";
import { useStore } from "react-redux";
import ReactPlayer from "react-player";
import MuiAlert from "@material-ui/lab/Alert";
import './movie.css';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Movie(props) {
  const { url, isFrame, id } = props;

  const [isClicked, setIsClicked] = useState(true);
  const [ready, setReady] = useState(false);
  const [urlItem, setUrlItem] = useState("");

  const store = useStore();

  async function call(id) {
    let token = await store.getState().userState.token;
    let isLogged = await store.getState().userState.isLogged;
    callMoviePlay(token, id, isLogged);
    setIsClicked(false);
    setReady(true);
  }

  const callMoviePlay = (apiToken, movieID, isLogged) => {
    fetch("https://thebetter.bsgroup.eu/Media/GetMediaPlayInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        MediaId: movieID,
        StreamType: `${isLogged ? "MAIN" : "TRIAL"}`,
      }),
    })
      .then((res) => res.json())
      .then((res) =>
        res.hasOwnProperty("ContentUrl")
          ? setUrlItem(res.ContentUrl)
          : setUrlItem(undefined)
      );
  };

  if (isFrame) {
    return isClicked ? (
      <img className="normal-size"  src={url} onClick={() => call(id)} alt="" />
    ) : (
      ready &&
        (urlItem !== undefined ? (
          <ReactPlayer controls url={urlItem} />
        ) : (
          <>
            <Alert severity="error">
              You don't have value subscription for this video or video link is deprecated !
            </Alert>
            <img
              className="normal-size"
              src={url}
              onClick={() => call(id)}
              alt=""
            />
          </>
        ))
    );
  } else {
    return isClicked ? (
      <button
        className="classic"
        onClick={() => call(id)}
      />
    ) : (
      ready &&
        (urlItem !== undefined ? (
          <>
            <Alert severity="error">
              You don't have value subscription for this video or video link is deprecated!
            </Alert>
            <ReactPlayer controls url={urlItem} />
          </>
        ) : (
          <button
            className="classic"
            onClick={() => call(id)}
          />
        ))
    );
  }
}

export default Movie;
