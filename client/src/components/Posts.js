import React from "react";
import style from "./posts.module.scss";

// let tmpData = {
//   postsId: "61339e87c3f3d9471818876d",
//   username: "sagar1",
//   userusername: "ssgarx1",
//   postBody: "https://www.youtube.com/watch?v=RBumgq5yVrA&ab_channel=Passenger",
//   createdAt: "2021-09-04T16:40:08.931Z",
//   postTitle: "Passenger | Let Her Go (Official Video)",
//   postDescription:
//     "The new album 'Songs For The Drunk And Broken Hearted' is out now and available from https://www.passengermusic.com 'Let Her Go' from the album 'All the Litt...",
//   postDomain: "youtube.com",
//   postImage: "https://i.ytimg.com/vi/RBumgq5yVrA/maxresdefault.jpg",
// };
// postsMarkUp = (
//   <div className={style.fence}>
//     <a href={tmpData.postBody} target="_blank" rel="noopener noreferrer">
//       <div className={style.image}>
//         <img src={tmpData.postImage} alt="link_img" />
//       </div>
//       <div className={style.desc}>{tmpData.postDescription}</div>
//       <div className={style.domain}>{tmpData.postDomain}</div>
//     </a>
//   </div>
// );

function Posts({ loading, displayPosts, groupId }) {
  let postsMarkUp;
  if (loading) {
    postsMarkUp = <p>Loading</p>;
  } else if (!displayPosts) {
    postsMarkUp = <p>No posts yet</p>;
  } else {
    postsMarkUp = (
      <div className={style.posts_box}>
        {displayPosts.map(
          (x, index) =>
            x.postsId === groupId && (
              <div id={x.id} key={index} className={style.fence}>
                <a href={x.postBody} target="_blank" rel="noopener noreferrer">
                  <div className={style.image}>
                    <img src={x.postImage} alt="link_img" />
                  </div>
                  <div className={style.desc}>{x.postDescription}</div>
                  <div className={style.domain}>{x.postDomain}</div>
                </a>
              </div>
            )
        )}
        <div
          id="refrenceBlock2"
          // style={{ height: 15, backgroundColor: "red" }}
        ></div>
      </div>
    );
  }
  return <div>{postsMarkUp}</div>;
}

export default Posts;
