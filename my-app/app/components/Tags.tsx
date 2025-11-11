import React from "react";
import { useState, useEffect } from "react";
import { Input, Tag, Flex } from "antd";
const { Search } = Input;

// props for the tags component
interface TagsProp {
    tags: string[];
    onChange: (tags: string[]) => void;
}

// returns the tags component for searching
const Tags: React.FC<TagsProp> = ({ tags, onChange }) => {
    const [input, setInput] = useState('');

    // handle when deleting tags
    const handleClose = (removed: string) => {
        const new_tags = tags.filter(tag => tag != removed);
        onChange(new_tags);
    };

    // check if a tag can be added (not empty and unique)
    const canAddTag = (input: string) => {
        if (input === "" || tags.includes(input)) return false;

        return true;
    }

    // handle tag input search bar
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    // handle submit of a tag to add it
    const handleSubmit = (input: string) => {
        setInput('');

        if (!canAddTag(input)) return;

        const new_tags = [...tags, input];
        onChange(new_tags);
    }

    return (
        <div style={{marginBottom:16}}>
            <Flex justify="center">
                <Search
                    placeholder="Enter category tags here"
                    value={input}
                    onChange={handleChange}
                    onSearch={handleSubmit}
                    enterButton
                    style={{width:300}}
                />
            </Flex>
            <Flex justify="center" wrap="wrap">
                {tags.map((tag) => (
                    <Tag 
                        key={tag}
                        closable
                        onClose={() => handleClose(tag)}
                        style={{margin:4}}
                    >
                        {tag}
                    </Tag>
                ))}
            </Flex>
        </div>
    );
}

export default Tags;