import React, { FunctionComponent } from 'react';
import { hydrateRoot } from 'react-dom/client';
import Header from './parts/Header';
import Footer from './parts/Footer';

type Props = {
    ServerProps: ServerPropsType
};

const Home:FunctionComponent<Props> = (props) => {
    return <>
        <Header ServerProps={props.ServerProps}></Header>
        <div id="Home" className='Contain'>
            <h1>Happy Coding!</h1>
        </div>
        <Footer></Footer>
    </>
}

if(typeof window !== 'undefined') {
    hydrateRoot(document.getElementById('root') as HTMLElement, <Home ServerProps={window.ServerProps}/>);
}

export default Home;