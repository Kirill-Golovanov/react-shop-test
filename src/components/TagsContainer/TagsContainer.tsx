import React from "react";
import styles from "./TagsContainer.module.css";

interface Mark {
  Mark_Name: string;
  color_code: string;
}

interface TagsContainerProps {
  marks?: Mark[];
}

const TagsContainer = ({ marks }: TagsContainerProps) => {

  const getTagDataArray = (): { text: string; color: string }[] => {
    if (!marks || marks.length === 0) {
      return [];
    }
    const tags = marks.map((mark, index) => {
      let text = "";
      switch (mark.Mark_Name.toLowerCase()) {
        case "premium":
          text = "ПРЕМИУМ";
          break;
        case "hit":
          text = "ХИТ";
          break;
        default:
          text = mark.Mark_Name.toUpperCase();
      }
      return { text, color: mark.color_code };
    });
    return tags;
  };

  const tagDataArray = getTagDataArray();

  if (tagDataArray.length === 0) {
    return null;
  }

  return (
    <div className={styles.tagsContainer}>
      {tagDataArray.map((tag, index) => (
        <div
          key={`tag-${index}`}
          className={styles.tag}
          style={{ backgroundColor: tag.color }}
          title={tag.text}
        >
          <span className={styles.tagText}>{tag.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TagsContainer;
