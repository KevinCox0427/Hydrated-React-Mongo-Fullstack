import React, { FunctionComponent } from 'react';
import { hydrateRoot } from 'react-dom/client';
import Header from './parts/Header';
import Footer from './parts/Footer';

type Props = {
    ServerProps: ServerPropsType
};

const App:FunctionComponent<Props> = (props) => {
    return <>
        <Header ServerProps={props.ServerProps}></Header>
        <main className='Contain'>
            <h1>Happy Coding!</h1>
        </main>
        <Footer></Footer>
    </>
}

if (typeof window !== 'undefined') hydrateRoot(document.getElementById('root') as HTMLElement, <App ServerProps={window.ServerProps}/>);

export default App;