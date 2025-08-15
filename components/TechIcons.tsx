import React from 'react'
import {getTechLogos} from "@/lib/utils";

async function TechIcons ({techStack}: TechIconProps) {
    const techIcons = await getTechLogos(techStack);
    return (
        <div className={"flex flex-row"}>{techIcons.slice(0,3).map(({tech,url},index)=>{
            return <div className={"relative group bg-dark-300 rounded-full p-2 flex-center"} key={index}>
                <span className={"tech-tooltip"}>{tech}</span>
                <img src={url} alt="Tech Logo" height={100} width={100} className={"size-5"}/>
            </div>
        })}</div>
    )
}

export default TechIcons
