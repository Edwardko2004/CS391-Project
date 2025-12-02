// components/Tags.tsx
// component handling the tags for tag searching in Events.tsx

import React from "react";
import { Input, Select } from "antd";
import type { SelectProps } from 'antd';
import tags from "../lib/tag";
const alltags = tags
import { useMemo } from 'react';
const { Search } = Input;

type TagRender = SelectProps['tagRender'];

// props for the tags component
interface TagsProp {
    tags: string[];
    onChange: (tags: string[]) => void;
}

// returns the tags component for searching
const Tags: React.FC<TagsProp> = ({ tags, onChange }) => {
    // get the list of options to display for tags
    const options = useMemo(() => Object.keys(alltags).map(tag => ({ value: tag })), [alltags]);

    // handle adding or removing tags
    const handleChange = (values: string[]) => {
        onChange(values);
    }

    // return the full component
    return (
        <Select 
            style={{width:'100%'}}
            mode="multiple"
            placeholder="Select tags"
            value={tags}
            onChange={handleChange}
            options={options}
        />
    );
}

export default Tags;