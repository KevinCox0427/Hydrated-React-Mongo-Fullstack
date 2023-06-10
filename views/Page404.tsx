import React, { FunctionComponent } from "react";
import { hydrateRoot } from "react-dom/client";
import Footer from "./parts/Footer";
import Header from "./parts/Header";

type ServerProps = {
    ServerProps: ServerPropsType
}

const Page404:FunctionComponent<ServerProps> = (props) => {
    return <>
        <Header ServerProps={props.ServerProps}></Header>
        <div id="Page404" className="Contain">
            <h1>Error: Page Not Found</h1>
        </div>
        <Footer></Footer>
    </>
}

if(typeof window != 'undefined') {
    hydrateRoot(document.getElementById('root') as HTMLElement, <Page404 ServerProps={window.ServerProps}></Page404>);
}

export default Page404;