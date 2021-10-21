import React, { useEffect, useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import makeAnimated from "react-select/animated";
import styles from "./TagSelect.module.css";

function TagSelect({ isFilter, setSelectedTags, tags }) {
  const tagsList = tags.tags.map(({ tag_id, name }) => ({
    value: `T ${tag_id}`,
    label: name,
  }));
  const reservedList = tags.reserved_tags.map(({ tag_id, name }) => ({
    value: `R ${tag_id}`,
    label: name,
  }));

  const groupedOptions = [
    {
      label: "Filters",
      options: reservedList,
    },
    {
      label: "Tags",
      options: tagsList,
    },
  ];

  const handleSelect = (selectedTags) => {
    let currentTags = [];
    selectedTags.forEach(({ value, label }) => {
      const newVal = value.split(" ")[1];
      currentTags.push({ tag_id: newVal, name: label });
    });
    setSelectedTags(currentTags);
  };

  return (
    <Select
      className={classnames(styles.select, { [styles.filter]: isFilter })}
      isMulti
      options={isFilter ? groupedOptions : tagsList}
      components={makeAnimated()}
      placeholder={isFilter ? "Filter" : "Select"}
      onChange={handleSelect}
    />
  );
}

export default TagSelect;
