import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "./EditorToolbar";

export default function RichTextEditor({initialDescription, setFormattedDescription}){

    const QuillOnChange = (value)=>{
        setFormattedDescription(value);
    }

    return (
        <div>
            <EditorToolbar />
            <ReactQuill theme="snow" style={{height:'60vh', width:'90vw', marginBottom:'2vh', border:'1px solid black', borderRadius:'5px', overflow:'auto'}} placeholder='Description' modules={modules} formats={formats} defaultValue={initialDescription} onChange={QuillOnChange} />
        </div>
    );
}