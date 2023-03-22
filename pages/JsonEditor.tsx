import React, { FunctionComponent, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import Footer from "./parts/Footer";
import Header from "./parts/Header";

type ServerProps = {
    ServerProps: ServerPropsType,
    currentDataType: string
}

const JsonEditor:FunctionComponent<ServerProps> = (props) => {
    const [dataPieces, setDataPieces] = useState(props.ServerProps.dataPieces ? props.ServerProps.dataPieces : {});
    const [isEditing, setIsEditing] = useState<{[id:string]: {[key:string]: any}} | null>(null);

    function createDataInputs(value:any, i:number, key?:string) {
        if(!isEditing) return <></>;

        switch (typeof value) {
            case 'string':
            case 'number':
                return <input type={typeof value == 'string' ? 'text' : 'number'} value={value}></input>
            case 'boolean':
                return <input type='checkbox' checked={value}></input>
            case 'object':
                return <>
                    {Array.isArray(value) ? value.map((subValue, j) => {
                        console.log(subValue);
                        return <div key={i} className="Data">
                            &#91;{createDataInputs(subValue, j)}&#93;
                        </div>
                    }) : Object.keys(value).map((subKey, j) => {
                        return <div key={i} className="Data Row">
                            <p>{subKey}: </p>
                            <div key={i} className="Data">
                                {createDataInputs(value[subKey], j, subKey)}
                            </div>
                        </div>
                    })}
                </>
            default:
                return <p>whoops</p>;
        }
    }

    return <>
        <Header ServerProps={props.ServerProps}></Header>
        <main className="contain">
            <div className="Lists">
                <div className="List">
                    <div className="Title">
                        <h1>{props.currentDataType}</h1>
                        <p>Results: {Object.keys(dataPieces).length}</p>
                    </div>
                    {Object.keys(dataPieces).map((dataID, i) => {
                        return <div key={i} className="DataItem" style={isEditing && Object.keys(isEditing)[0] == dataID ? {
                            color: 'var(--purple)',
                            textDecoration: 'none',
                            fontWeight: '600',
                            pointerEvents: 'none',
                            width: '100%'
                        } : {}} onClick={() => {
                            setIsEditing({[dataID]: dataPieces[dataID]});
                        }}>ID: {dataID} {isEditing && Object.keys(isEditing)[0] == dataID ? <span>&rarr;</span> : <></>}</div>
                    })}
                </div>
                {isEditing ? 
                    <div className="List">
                        <div className="Title">
                            <p className="Button" onClick={() => {
                                setIsEditing(null);
                            }}>Cancel</p>
                            <h1>{Object.keys(isEditing)[0]}</h1>
                            <p className="Button" onClick={() => {
                                setDataPieces({...dataPieces,
                                    [Object.keys(isEditing)[0]]: isEditing[Object.keys(isEditing)[0]]
                                });
                                setIsEditing(null);
                            }}>Save</p>
                        </div>
                        {Object.keys(isEditing).map((key, i) => {
                            return createDataInputs(isEditing[key], i, key)
                        })}
                    </div>
                : 
                    <></>}
            </div>
        </main>
        <Footer></Footer>
    </>
}

if(typeof window != 'undefined') hydrateRoot(document.getElementById('root') as HTMLElement, <JsonEditor ServerProps={window.ServerProps} currentDataType={window.location.href.split('dataentry/')[1].split('/')[0]}></JsonEditor>);

export default JsonEditor;