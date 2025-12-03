// components/EventsTags.tsx
// component handling the tags for tag searching in Events.tsx (basic styling)

import React from "react";
import { Select } from "antd";
import tags from "../lib/tag";
const alltags = tags
import { useMemo } from 'react';

// props for the tags component
interface EventsTagsProp {
    tags: string[];
    onChange: (tags: string[]) => void;
}

// returns the tags component for searching
const EventsTags: React.FC<EventsTagsProp> = ({ tags, onChange }) => {
    // get the list of options to display for tags (excluding 'other')
    const options = useMemo(() => Object.keys(alltags).filter(tag => tag !== 'other').map(tag => ({ value: tag, label: tag })), [alltags]);

    // handle adding or removing tags
    const handleChange = (values: string[]) => {
        onChange(values);
    }

    // return the full component with same styling as Sort Select
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

export default EventsTags;
