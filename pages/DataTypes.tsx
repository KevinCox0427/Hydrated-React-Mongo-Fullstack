import React, { FunctionComponent } from "react";
import { hydrateRoot } from "react-dom/client";
import Header from "./parts/Header";
import Footer from "./parts/Footer";

type ServerProps = {
    ServerProps: ServerPropsType
}

const DataTypes:FunctionComponent<ServerProps> = (props) => {
    return <>
        <Header ServerProps={props.ServerProps}></Header>
        <main className="contain">
            <h1>Data Types:</h1>
            {props.ServerProps.dataTypes ? 
                props.ServerProps.dataTypes.map((dataType, i) => <a key={i} href={`/dataentry/${dataType}`}>{dataType}</a>)
                :
                <></>
            }
        </main>
        <Footer></Footer>
    </>
}

if(typeof window != 'undefined') hydrateRoot(document.getElementById('root') as HTMLElement, <DataTypes ServerProps={window.ServerProps}></DataTypes>);

export default DataTypes;