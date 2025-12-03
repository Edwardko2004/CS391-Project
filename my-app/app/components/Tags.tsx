// components/Tags.tsx
// component handling the tags for tag searching in Events.tsx

import React from "react";
import { Select } from "antd";
import type { SelectProps } from 'antd';
import tags from "../lib/tag";
const alltags = tags
import { useMemo } from 'react';

type TagRender = SelectProps['tagRender'];

// props for the tags component
interface TagsProp {
    tags: string[];
    onChange: (tags: string[]) => void;
}

// returns the tags component for searching
const Tags: React.FC<TagsProp> = ({ tags, onChange }) => {
    // get the list of options to display for tags (excluding 'other')
    const options = useMemo(() => Object.keys(alltags).filter(tag => tag !== 'other').map(tag => ({ value: tag, label: tag })), [alltags]);

    // handle adding or removing tags
    const handleChange = (values: string[]) => {
        onChange(values);
    }

    // Custom tag render for styling
    const tagRender: TagRender = (props) => {
        const { label, closable, onClose } = props;
        return (
            <span className="text-xs px-2 py-1 rounded bg-cyan-400/10 border border-cyan-600 text-cyan-200" style={{marginRight: '4px'}}>
                {label}
                {closable && (
                    <span 
                        onClick={onClose}
                        className="ml-1 cursor-pointer hover:text-cyan-100"
                    >
                        ×
                    </span>
                )}
            </span>
        );
    }

    // return the full component
    return (
        <Select 
            className="custom-select"
            style={{width:'100%'}}
            mode="tags"
            placeholder="Select or type tags"
            value={tags}
            onChange={handleChange}
            options={options}
            tagRender={tagRender}
            popupMatchSelectWidth={false}
        />
    );
}

export default Tags;