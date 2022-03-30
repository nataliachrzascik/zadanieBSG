import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useStore } from "react-redux";
import Movie from "../Movie";

const StyledBox = styled(Box)(() => ({
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

function Main(props) {
  const [mediaList, setMediaList] = useState([]);
  const [ready, setReady] = useState(false);

  const store = useStore();

  const callAPI = (apiToken) => {
    const listId = [2, 3, 4, 5, 6, 7];
    listId.map((id) => {
      fetch("https://thebetter.bsgroup.eu/Media/GetMediaList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          MediaListId: id,
          IncludeCategories: false,
          IncludeImages: true,
          IncludeMedia: false,
          PageNumber: 1,
          PageSize: 15,
        }),
      })
        .then((res) => res.json())
        .then((res) =>
          setMediaList((oldArray) => [
            ...oldArray,
            [...[res], { listId: id }],
          ])
        );
    });
    setReady(true);
  };

  async function call() {
    let token = await store.getState().userState.token;
    callAPI(token);
  }

  useEffect(() => {
    call();
  },[]);

  return (
    <div>
      <StyledBox>
        {ready &&
          mediaList.map((list, key) => {
            return (
              <div key={key}>
                <h2>List number {list[1].listId}</h2>
                {list[0].Entities.map((item, key) => {
                  if (
                    item.Images.some((item) => item.ImageTypeCode === "FRAME")
                  ) {
                    return (
                      <div key={key}>
                        <h3>{item.Title}</h3>

                        {item.Images.map((image, key) => {
                          if (image.ImageTypeCode === "FRAME") {
                            return (
                              <Movie
                                key={key}
                                url={image.Url}
                                isFrame={true}
                                id={item.Id}
                              />
                            );
                          }
                        })}
                      </div>
                    );
                  } else {
                    return (
                      <div key={key}>
                        <h3>{item.Title}</h3>
                        <Movie id={item.Id} isFrame={false} />
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
      </StyledBox>
    </div>
  );
}

export default Main;
