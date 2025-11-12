import React from "react";
import { useState, useEffect } from "react";
import { Input, Tag, Flex, Select } from "antd";
import type { SelectProps } from 'antd';
import tags from "../lib/tag";

const { Search } = Input;
type TagRender = SelectProps['tagRender'];

// create a list of tag options for the tag selector
const options: SelectProps['options'] = Object.keys(tags).map(key => ({
    value: key,
}));

// props for the tags component
interface TagsProp {
    tags: string[];
    onChange: (tags: string[]) => void;
}

// returns the tags component for searching
const Tags: React.FC<TagsProp> = ({ tags, onChange }) => {
    const handleChange = (values: string[]) => {
        onChange(values);
    }

    const tagRender: TagRender = (props) => {
        const { label, closable, onClose } = props;
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <Tag
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
            >
                {label}
            </Tag>
        )
    }

    return (
        <Select 
            style={{width:'100%'}}
            mode="multiple"
            tagRender={tagRender}
            placeholder="Select tags"
            value={tags}
            onChange={handleChange}
            options={options}
        />
    );
}

export default Tags;