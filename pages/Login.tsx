import React, { FunctionComponent, useEffect, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import Header from './parts/Header';
import Footer from './parts/Footer';

type Props = {
    ServerProps: ServerPropsType
}

const Login:FunctionComponent<Props> = (props) => {
    const [isLogin, setIsLogin] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [formState, setFormState] = useState({
        username: '',
        password: '',
    });

    if(typeof window != 'undefined') window.onload = () => {
        if(window.localStorage.getItem('CMSRememberMe') && window.localStorage.getItem('CMSRememberMe') == 'true'){
            setRememberMe(true);
            if(window.localStorage.getItem('CMSusername') && window.localStorage.getItem('CMSpassword')) setFormState({
                username: window.localStorage.getItem('CMSusername') as string,
                password: window.localStorage.getItem('CMSpassword') as string
            });
        }
    }

    async function postLogin() {
        const response = await fetch(`/user/${isLogin ? 'login' : 'register'}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formState.username, 
                password: formState.password
            })
        });
        if(response.redirected) window.location.href = response.url;
    }

    return <>
        <Header ServerProps={props.ServerProps}></Header>
        <main className='Contain'>
            <form>
                <h1>{isLogin ? 'Login' : 'Register'}</h1>
                <input className='LoginField' type="text" placeholder='Username' value={formState.username} onChange={e => {
                    if(rememberMe) window.localStorage.setItem('CMSusername', e.target.value);
                    setFormState({...formState,
                        username: e.target.value
                    })
                }} />
                <input className='LoginField' type="text" placeholder='Password' value={formState.password} onChange={e => {
                    if(rememberMe) window.localStorage.setItem('CMSpassword', e.target.value);
                    setFormState({...formState,
                        password: e.target.value
                    })
                }} />
                <div className='SubButtons'>
                    {isLogin ? <div className='RememberMe' onClick={() => {
                            window.localStorage.setItem('CMSRememberMe', (!rememberMe).toString());
                            setRememberMe(!rememberMe);
                        }}>
                        <div style={{
                            backgroundColor: rememberMe ? 'var(--purple)' : 'var(--white)'
                        }}></div>
                        <p>remeber me?</p>
                    </div> : <></>}
                    <p className='LoginLink' onClick={() => {
                        setIsLogin(!isLogin);
                    }}>{isLogin ? 'register' : 'login'}</p>
                </div>
                <button type='button' onClick={postLogin}>Go</button>
            </form>
        </main>
        <Footer></Footer>
    </>
}

if (typeof window !== 'undefined') {
    hydrateRoot(document.getElementById('root') as HTMLElement, <Login ServerProps={window.ServerProps}/>);
}

export default Login;