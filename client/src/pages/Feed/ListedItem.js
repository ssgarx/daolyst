import React from "react";
import style from "./listedItem.module.scss";
import PlusIcon from "../../assets/plusIcon.svg";

function ListedItem({ item }) {
  console.log("item", item);
  const {
    createdAt,
    projectDescription,
    projectIcon,
    projectImages,
    projectName,
    projectTag,
    projectVideoLink,
  } = item;

  return (
    <div className={style.box1}>
      <div className={style.box1A}>
        <div className={style.box1A1}>
          <img src={projectIcon} alt="product_img" />
        </div>
        <div className={style.box1A2}>
          <p>Project Name</p>
          <p>Project tag name</p>
        </div>
      </div>
      <div className={style.box1B}>
        <div>
          <button>
            <div>
              <div>
                <img src={PlusIcon} alt="+" />
              </div>
              <div>999</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListedItem;
